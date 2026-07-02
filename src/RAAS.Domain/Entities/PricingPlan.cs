using System.ComponentModel.DataAnnotations;
using RAAS.Domain.Common;

namespace RAAS.Domain.Entities;

public class PricingPlan : BaseEntity
{
    [Required]
    [StringLength(64)]
    public string Code { get; set; } = string.Empty;

    [Required]
    [StringLength(120)]
    public string Name { get; set; } = string.Empty;

    public decimal MonthlyPrice { get; set; }
    public bool IncludesBasicCrm { get; set; }
    public bool IncludesAdvancedTracking { get; set; }
    public bool IncludesComplianceDashboard { get; set; }
    public bool IsActive { get; set; } = true;
}
