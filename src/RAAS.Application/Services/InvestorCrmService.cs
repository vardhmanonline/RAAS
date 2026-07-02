using RAAS.Application.DTOs.InvestorCrm;
using RAAS.Application.Interfaces;
using RAAS.Domain.Entities;
using RAAS.Domain.Enums;

namespace RAAS.Application.Services;

public class InvestorCrmService : IInvestorCrmService
{
    private readonly IUnitOfWork _uow;

    public InvestorCrmService(IUnitOfWork uow) => _uow = uow;

    public async Task<InvestorCrmOverviewDto> GetOverviewAsync()
    {
        var investors = (await _uow.Repository<InvestorAccount>().GetAllAsync()).ToList();
        var deals = (await _uow.Repository<LandDeal>().GetAllAsync()).ToList();
        var flows = (await _uow.Repository<InvestmentFlow>().GetAllAsync()).ToList();
        var compliance = (await _uow.Repository<ComplianceCase>().GetAllAsync()).ToList();

        return new InvestorCrmOverviewDto(
            investors.Count,
            deals.Count,
            investors.Sum(i => i.TotalCommittedCapital),
            deals.Where(d => d.RegistrationCompleted).Sum(d => d.AreaInAcres),
            compliance.Count(c => c.Status != ComplianceCaseStatus.Closed),
            flows.Where(f => f.FundSource == FundSource.White).Sum(f => f.Amount),
            flows.Where(f => f.FundSource == FundSource.Black).Sum(f => f.Amount));
    }

    public async Task<IEnumerable<InvestorAccountSummaryDto>> GetInvestorsAsync() =>
        (await _uow.Repository<InvestorAccount>().GetAllAsync())
        .OrderByDescending(i => i.CreatedAt)
        .Select(i => new InvestorAccountSummaryDto(i.Id, i.AccountCode, i.FullName, i.Email, i.KycCompleted, i.TotalCommittedCapital, i.PricingTierCode));

    public async Task<IEnumerable<LandDealSummaryDto>> GetDealsAsync() =>
        (await _uow.Repository<LandDeal>().GetAllAsync())
        .OrderByDescending(d => d.CreatedAt)
        .Select(d => new LandDealSummaryDto(d.Id, d.DealCode, d.Title, d.Location, d.AreaInAcres, d.AcquisitionCost, d.ExpectedRevenue, d.RegistrationCompleted));

    public async Task<IEnumerable<PricingPlanDto>> GetPricingPlansAsync() =>
        (await _uow.Repository<PricingPlan>().FindAsync(p => p.IsActive))
        .OrderBy(p => p.MonthlyPrice)
        .Select(p => new PricingPlanDto(p.Id, p.Code, p.Name, p.MonthlyPrice, p.IncludesBasicCrm, p.IncludesAdvancedTracking, p.IncludesComplianceDashboard));

    public async Task<IEnumerable<ComplianceCaseDto>> GetComplianceCasesAsync(string? status)
    {
        var cases = (await _uow.Repository<ComplianceCase>().GetAllAsync()).AsQueryable();
        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<ComplianceCaseStatus>(status, true, out var parsedStatus))
        {
            cases = cases.Where(c => c.Status == parsedStatus);
        }

        return cases
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new ComplianceCaseDto(
                c.Id,
                c.InvestorAccountId,
                c.LandDealId,
                c.AlertType,
                c.Severity.ToString(),
                c.Status.ToString(),
                c.DueDate,
                c.CreatedAt));
    }

    public async Task<RevenueReportDto> GetRevenueReportAsync(Guid? dealId, decimal? minAreaInAcres, DateTime? from, DateTime? to)
    {
        var allDeals = (await _uow.Repository<LandDeal>().GetAllAsync()).ToList();
        var flows = (await _uow.Repository<InvestmentFlow>().GetAllAsync()).AsQueryable();
        var payouts = (await _uow.Repository<InvestorPayout>().GetAllAsync()).AsQueryable();

        if (dealId.HasValue)
        {
            flows = flows.Where(f => f.LandDealId == dealId.Value);
            payouts = payouts.Where(p => p.LandDealId == dealId.Value);
            allDeals = allDeals.Where(d => d.Id == dealId.Value).ToList();
        }

        if (minAreaInAcres.HasValue)
            allDeals = allDeals.Where(d => d.AreaInAcres >= minAreaInAcres.Value).ToList();

        var eligibleDealIds = allDeals.Select(d => d.Id).ToHashSet();
        flows = flows.Where(f => eligibleDealIds.Contains(f.LandDealId));
        payouts = payouts.Where(p => eligibleDealIds.Contains(p.LandDealId));

        if (from.HasValue)
        {
            flows = flows.Where(f => f.FlowDate >= from.Value);
            payouts = payouts.Where(p => p.PaidOn >= from.Value);
        }

        if (to.HasValue)
        {
            flows = flows.Where(f => f.FlowDate <= to.Value);
            payouts = payouts.Where(p => p.PaidOn <= to.Value);
        }

        var totalEarnings = flows.Sum(f => f.Amount);
        var investorPayouts = payouts.Sum(p => p.Amount);

        return new RevenueReportDto(
            totalEarnings,
            investorPayouts,
            totalEarnings - investorPayouts,
            eligibleDealIds.Count,
            allDeals.Sum(d => d.AreaInAcres),
            flows.Where(f => f.FundSource == FundSource.White).Sum(f => f.Amount),
            flows.Where(f => f.FundSource == FundSource.Black).Sum(f => f.Amount));
    }

    public async Task<Guid> CreateInvestorAsync(CreateInvestorAccountRequest request)
    {
        var accountCode = await GenerateUniqueCodeAsync<InvestorAccount>("INV", a => a.AccountCode);
        var investor = new InvestorAccount
        {
            AccountCode = accountCode,
            FullName = request.FullName,
            Email = request.Email.Trim().ToLowerInvariant(),
            Phone = request.Phone,
            PanNumber = request.PanNumber,
            TotalCommittedCapital = request.TotalCommittedCapital,
            PricingTierCode = string.IsNullOrWhiteSpace(request.PricingTierCode) ? "BASIC_CRM" : request.PricingTierCode.Trim().ToUpperInvariant(),
            KycCompleted = false
        };

        await _uow.Repository<InvestorAccount>().AddAsync(investor);
        await _uow.SaveChangesAsync();
        return investor.Id;
    }

    public async Task<Guid> CreateLandDealAsync(CreateLandDealRequest request)
    {
        var dealCode = await GenerateUniqueCodeAsync<LandDeal>("DEAL", d => d.DealCode);
        var deal = new LandDeal
        {
            DealCode = dealCode,
            Title = request.Title,
            Location = request.Location,
            AreaInAcres = request.AreaInAcres,
            AcquisitionCost = request.AcquisitionCost,
            ExpectedRevenue = request.ExpectedRevenue,
            RegistrationCompleted = request.RegistrationCompleted,
            RegisteredOn = request.RegisteredOn
        };

        await _uow.Repository<LandDeal>().AddAsync(deal);
        await _uow.SaveChangesAsync();
        return deal.Id;
    }

    public async Task<Guid> RecordInvestmentFlowAsync(CreateInvestmentFlowRequest request)
    {
        if (!Enum.TryParse<FundSource>(request.FundSource, true, out var source))
            throw new InvalidOperationException("Fund source must be White or Black.");

        await EnsureEntityExistsAsync<InvestorAccount>(request.InvestorAccountId, "Investor account not found");
        await EnsureEntityExistsAsync<LandDeal>(request.LandDealId, "Land deal not found");

        var flow = new InvestmentFlow
        {
            InvestorAccountId = request.InvestorAccountId,
            LandDealId = request.LandDealId,
            FundSource = source,
            Amount = request.Amount,
            FlowDate = request.FlowDate ?? DateTime.UtcNow,
            Notes = request.Notes
        };

        await _uow.Repository<InvestmentFlow>().AddAsync(flow);
        await _uow.SaveChangesAsync();
        return flow.Id;
    }

    public async Task<Guid> RecordInvestorPayoutAsync(CreateInvestorPayoutRequest request)
    {
        await EnsureEntityExistsAsync<InvestorAccount>(request.InvestorAccountId, "Investor account not found");
        await EnsureEntityExistsAsync<LandDeal>(request.LandDealId, "Land deal not found");

        var payout = new InvestorPayout
        {
            InvestorAccountId = request.InvestorAccountId,
            LandDealId = request.LandDealId,
            Amount = request.Amount,
            PaidOn = request.PaidOn ?? DateTime.UtcNow,
            Notes = request.Notes
        };

        await _uow.Repository<InvestorPayout>().AddAsync(payout);
        await _uow.SaveChangesAsync();
        return payout.Id;
    }

    public async Task<Guid> CreateComplianceCaseAsync(CreateComplianceCaseRequest request)
    {
        if (!Enum.TryParse<ComplianceSeverity>(request.Severity, true, out var severity))
            throw new InvalidOperationException("Compliance severity is invalid.");

        if (request.InvestorAccountId.HasValue)
            await EnsureEntityExistsAsync<InvestorAccount>(request.InvestorAccountId.Value, "Investor account not found");

        if (request.LandDealId.HasValue)
            await EnsureEntityExistsAsync<LandDeal>(request.LandDealId.Value, "Land deal not found");

        var complianceCase = new ComplianceCase
        {
            InvestorAccountId = request.InvestorAccountId,
            LandDealId = request.LandDealId,
            AlertType = request.AlertType,
            Severity = severity,
            Status = ComplianceCaseStatus.Open,
            DueDate = request.DueDate,
            Notes = request.Notes
        };

        await _uow.Repository<ComplianceCase>().AddAsync(complianceCase);
        await _uow.SaveChangesAsync();
        return complianceCase.Id;
    }

    private async Task EnsureEntityExistsAsync<T>(Guid id, string error) where T : class
    {
        var entity = await _uow.Repository<T>().GetByIdAsync(id);
        if (entity == null)
            throw new InvalidOperationException(error);
    }

    private async Task<string> GenerateUniqueCodeAsync<T>(string prefix, Func<T, string> selector) where T : class
    {
        var dateToken = DateTime.UtcNow.ToString("yyyyMMdd");
        var random = Random.Shared;

        for (var i = 0; i < 10; i++)
        {
            var code = $"{prefix}-{dateToken}-{random.Next(100, 999)}";
            var all = await _uow.Repository<T>().GetAllAsync();
            var exists = all.Any(e => selector(e) == code);
            if (!exists)
                return code;
        }

        throw new InvalidOperationException($"Unable to generate unique {prefix} code");
    }
}
