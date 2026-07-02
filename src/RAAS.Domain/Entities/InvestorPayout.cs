using RAAS.Domain.Common;

namespace RAAS.Domain.Entities;

public class InvestorPayout : BaseEntity
{
    public Guid InvestorAccountId { get; set; }
    public Guid LandDealId { get; set; }
    public decimal Amount { get; set; }
    public DateTime PaidOn { get; set; } = DateTime.UtcNow;
    public string? Notes { get; set; }

    public InvestorAccount? InvestorAccount { get; set; }
    public LandDeal? LandDeal { get; set; }
}
