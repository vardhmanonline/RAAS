namespace RAAS.Application.DTOs.Referrals;

public record ReferralDashboardDto(
    string ReferralCode, decimal TotalEarnings, int TotalReferrals, int PendingReferrals,
    decimal RewardPerReferral, string ShareMessage, string ShareUrl);

public record ReferralRecordDto(string ReferredUserName, DateTime Date, decimal Reward, bool IsRewarded);
