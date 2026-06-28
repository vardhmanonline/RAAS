using RAAS.Application.DTOs.Referrals;
using RAAS.Application.Interfaces;
using RAAS.Domain.Entities;

namespace RAAS.Application.Services;

public class ReferralService : IReferralService
{
    private readonly IUnitOfWork _uow;
    private const decimal RewardPerReferral = 50m;

    public ReferralService(IUnitOfWork uow) => _uow = uow;

    public async Task<ReferralDashboardDto> GetDashboardAsync(Guid userId)
    {
        var user = await _uow.Repository<User>().GetByIdAsync(userId)
            ?? throw new InvalidOperationException("User not found");

        var referrals = (await _uow.Repository<Referral>().FindAsync(r => r.ReferrerId == userId)).ToList();
        var shareUrl = $"https://raas.in/register?ref={user.ReferralCode}";
        var shareMessage = $"Taste authentic Rajasthani food! Use my code {user.ReferralCode} and get ₹50 off. {shareUrl}";

        return new ReferralDashboardDto(
            user.ReferralCode,
            user.ReferralEarnings,
            referrals.Count,
            referrals.Count(r => !r.IsRewarded),
            RewardPerReferral,
            shareMessage,
            shareUrl);
    }

    public async Task<IEnumerable<ReferralRecordDto>> GetReferralHistoryAsync(Guid userId)
    {
        var referrals = await _uow.Repository<Referral>().FindAsync(r => r.ReferrerId == userId);
        var users = await _uow.Repository<User>().GetAllAsync();
        var userMap = users.ToDictionary(u => u.Id);

        return referrals.OrderByDescending(r => r.CreatedAt).Select(r => new ReferralRecordDto(
            userMap.TryGetValue(r.ReferredUserId, out var u) ? u.FullName : "User",
            r.CreatedAt,
            r.RewardAmount,
            r.IsRewarded));
    }

    public async Task ProcessReferralRewardAsync(Guid referredUserId)
    {
        var referral = (await _uow.Repository<Referral>().FindAsync(r =>
            r.ReferredUserId == referredUserId && !r.IsRewarded)).FirstOrDefault();

        if (referral == null) return;

        var orders = await _uow.Repository<Order>().FindAsync(o => o.UserId == referredUserId);
        if (!orders.Any()) return;

        referral.IsRewarded = true;
        referral.RewardedAt = DateTime.UtcNow;
        await _uow.Repository<Referral>().UpdateAsync(referral);

        var referrer = await _uow.Repository<User>().GetByIdAsync(referral.ReferrerId);
        if (referrer != null)
        {
            referrer.ReferralEarnings += referral.RewardAmount;
            referrer.LoyaltyPoints += 50;
            referrer.UpdatedAt = DateTime.UtcNow;
            await _uow.Repository<User>().UpdateAsync(referrer);
        }

        await _uow.SaveChangesAsync();
    }
}
