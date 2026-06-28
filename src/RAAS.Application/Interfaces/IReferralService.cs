using RAAS.Application.DTOs.Referrals;

namespace RAAS.Application.Interfaces;

public interface IReferralService
{
    Task<ReferralDashboardDto> GetDashboardAsync(Guid userId);
    Task<IEnumerable<ReferralRecordDto>> GetReferralHistoryAsync(Guid userId);
    Task ProcessReferralRewardAsync(Guid referredUserId);
}
