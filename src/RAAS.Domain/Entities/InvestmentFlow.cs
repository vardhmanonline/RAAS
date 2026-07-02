using RAAS.Domain.Common;
using RAAS.Domain.Enums;

namespace RAAS.Domain.Entities;

public class InvestmentFlow : BaseEntity
{
    public Guid InvestorAccountId { get; set; }
    public Guid LandDealId { get; set; }
    public FundSource FundSource { get; set; }
    public decimal Amount { get; set; }
    public DateTime FlowDate { get; set; } = DateTime.UtcNow;
    public string? Notes { get; set; }

    public InvestorAccount? InvestorAccount { get; set; }
    public LandDeal? LandDeal { get; set; }
}
