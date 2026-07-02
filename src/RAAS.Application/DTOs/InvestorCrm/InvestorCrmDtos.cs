namespace RAAS.Application.DTOs.InvestorCrm;

public record CreateInvestorAccountRequest(string FullName, string Email, string? Phone, string? PanNumber, decimal TotalCommittedCapital, string PricingTierCode);
public record CreateLandDealRequest(string Title, string Location, decimal AreaInAcres, decimal AcquisitionCost, decimal ExpectedRevenue, bool RegistrationCompleted, DateTime? RegisteredOn);
public record CreateInvestmentFlowRequest(Guid InvestorAccountId, Guid LandDealId, string FundSource, decimal Amount, DateTime? FlowDate, string? Notes);
public record CreateInvestorPayoutRequest(Guid InvestorAccountId, Guid LandDealId, decimal Amount, DateTime? PaidOn, string? Notes);
public record CreateComplianceCaseRequest(Guid? InvestorAccountId, Guid? LandDealId, string AlertType, string Severity, DateTime? DueDate, string? Notes);

public record InvestorAccountSummaryDto(Guid Id, string AccountCode, string FullName, string Email, bool KycCompleted, decimal TotalCommittedCapital, string PricingTierCode);
public record LandDealSummaryDto(Guid Id, string DealCode, string Title, string Location, decimal AreaInAcres, decimal AcquisitionCost, decimal ExpectedRevenue, bool RegistrationCompleted);
public record PricingPlanDto(Guid Id, string Code, string Name, decimal MonthlyPrice, bool IncludesBasicCrm, bool IncludesAdvancedTracking, bool IncludesComplianceDashboard);
public record ComplianceCaseDto(Guid Id, Guid? InvestorAccountId, Guid? LandDealId, string AlertType, string Severity, string Status, DateTime? DueDate, DateTime CreatedAt);

public record RevenueReportDto(decimal TotalEarnings, decimal InvestorPayouts, decimal NetRevenue, int DealCount, decimal TotalLandArea, decimal WhiteFunds, decimal BlackFunds);
public record InvestorCrmOverviewDto(int TotalInvestors, int TotalDeals, decimal TotalCommittedCapital, decimal RegisteredLandArea, int OpenComplianceCases, decimal WhiteFunds, decimal BlackFunds);
