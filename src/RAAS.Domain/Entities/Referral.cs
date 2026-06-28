using RAAS.Domain.Common;

namespace RAAS.Domain.Entities;

public class Referral : BaseEntity
{
    public Guid ReferrerId { get; set; }
    public Guid ReferredUserId { get; set; }
    public decimal RewardAmount { get; set; }
    public bool IsRewarded { get; set; }
    public DateTime? RewardedAt { get; set; }

    public User Referrer { get; set; } = null!;
    public User ReferredUser { get; set; } = null!;
}
