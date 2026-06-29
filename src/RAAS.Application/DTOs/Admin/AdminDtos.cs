namespace RAAS.Application.DTOs.Admin;

public record AdminUserDto(Guid Id, string Email, string FullName, string? Phone, int OrderCount, decimal TotalSpent, DateTime JoinedAt);
public record CreateCouponRequest(
    string Code, string Description, decimal DiscountPercent, decimal? MaxDiscountAmount,
    decimal MinOrderAmount, DateTime ValidFrom, DateTime ValidUntil, int UsageLimit);
public record CouponDto(Guid Id, string Code, string Description, decimal DiscountPercent, decimal MinOrderAmount, DateTime ValidUntil, int UsageCount, int UsageLimit, bool IsActive);
public record StoreSettingsDto(bool SampleOrderEnabled, decimal FreeDeliveryThreshold);
public record UpdateStoreSettingsRequest(bool SampleOrderEnabled, decimal FreeDeliveryThreshold);
