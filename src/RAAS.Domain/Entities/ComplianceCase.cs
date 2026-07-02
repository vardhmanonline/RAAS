using RAAS.Domain.Common;
using RAAS.Domain.Enums;

namespace RAAS.Domain.Entities;

public class ComplianceCase : BaseEntity
{
    public Guid? InvestorAccountId { get; set; }
    public Guid? LandDealId { get; set; }
    public string AlertType { get; set; } = string.Empty;
    public ComplianceSeverity Severity { get; set; } = ComplianceSeverity.Medium;
    public ComplianceCaseStatus Status { get; set; } = ComplianceCaseStatus.Open;
    public DateTime? DueDate { get; set; }
    public string? Notes { get; set; }

    public InvestorAccount? InvestorAccount { get; set; }
    public LandDeal? LandDeal { get; set; }
}
