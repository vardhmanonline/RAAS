using RAAS.Application.DTOs.InvestorCrm;

namespace RAAS.Application.Interfaces;

public interface IInvestorCrmService
{
    Task<InvestorCrmOverviewDto> GetOverviewAsync();
    Task<IEnumerable<InvestorAccountSummaryDto>> GetInvestorsAsync();
    Task<IEnumerable<LandDealSummaryDto>> GetDealsAsync();
    Task<IEnumerable<PricingPlanDto>> GetPricingPlansAsync();
    Task<IEnumerable<ComplianceCaseDto>> GetComplianceCasesAsync(string? status);
    Task<RevenueReportDto> GetRevenueReportAsync(Guid? dealId, decimal? minAreaInAcres, DateTime? from, DateTime? to);

    Task<Guid> CreateInvestorAsync(CreateInvestorAccountRequest request);
    Task<Guid> CreateLandDealAsync(CreateLandDealRequest request);
    Task<Guid> RecordInvestmentFlowAsync(CreateInvestmentFlowRequest request);
    Task<Guid> RecordInvestorPayoutAsync(CreateInvestorPayoutRequest request);
    Task<Guid> CreateComplianceCaseAsync(CreateComplianceCaseRequest request);
}
