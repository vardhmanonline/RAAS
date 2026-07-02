using System.ComponentModel.DataAnnotations;
using RAAS.Domain.Common;

namespace RAAS.Domain.Entities;

public class LandDeal : BaseEntity
{
    [Required]
    [StringLength(32)]
    public string DealCode { get; set; } = string.Empty;

    [Required]
    [StringLength(160)]
    public string Title { get; set; } = string.Empty;

    [StringLength(160)]
    public string Location { get; set; } = string.Empty;

    public decimal AreaInAcres { get; set; }
    public decimal AcquisitionCost { get; set; }
    public decimal ExpectedRevenue { get; set; }
    public bool RegistrationCompleted { get; set; }
    public DateTime? RegisteredOn { get; set; }

    public ICollection<InvestmentFlow> InvestmentFlows { get; set; } = new List<InvestmentFlow>();
    public ICollection<InvestorPayout> Payouts { get; set; } = new List<InvestorPayout>();
    public ICollection<ComplianceCase> ComplianceCases { get; set; } = new List<ComplianceCase>();
}
