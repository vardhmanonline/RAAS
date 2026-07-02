using System.ComponentModel.DataAnnotations;
using RAAS.Domain.Common;

namespace RAAS.Domain.Entities;

public class InvestorAccount : BaseEntity
{
    [Required]
    [StringLength(32)]
    public string AccountCode { get; set; } = string.Empty;

    [Required]
    [StringLength(120)]
    public string FullName { get; set; } = string.Empty;

    [EmailAddress]
    [StringLength(256)]
    public string Email { get; set; } = string.Empty;

    [StringLength(15)]
    public string? Phone { get; set; }

    [StringLength(32)]
    public string? PanNumber { get; set; }

    public bool KycCompleted { get; set; }
    public decimal TotalCommittedCapital { get; set; }

    [StringLength(64)]
    public string PricingTierCode { get; set; } = "BASIC_CRM";

    public ICollection<InvestmentFlow> InvestmentFlows { get; set; } = new List<InvestmentFlow>();
    public ICollection<InvestorPayout> Payouts { get; set; } = new List<InvestorPayout>();
    public ICollection<ComplianceCase> ComplianceCases { get; set; } = new List<ComplianceCase>();
}
