namespace RAAS.Application.DTOs.Admin;

public record AdminUserDto(Guid Id, string Email, string FullName, string? Phone, int OrderCount, decimal TotalSpent, DateTime JoinedAt);
public record CreateCouponRequest(
    string Code, string Description, decimal DiscountPercent, decimal? MaxDiscountAmount,
    decimal MinOrderAmount, DateTime ValidFrom, DateTime ValidUntil, int UsageLimit);
public record CouponDto(Guid Id, string Code, string Description, decimal DiscountPercent, decimal MinOrderAmount, DateTime ValidUntil, int UsageCount, int UsageLimit, bool IsActive);
public record StoreSettingsDto(
    bool SampleOrderEnabled, 
    decimal FreeDeliveryThreshold,
    int RecentPurchaseCount,
    int RecentPurchaseDays,
    int LowStockThreshold,
    string SupportEmail,
    string SupportPhone,
    string CompanyName,
    string CompanyTagline,
    string CompanyDescription,
    string LogoUrl,
    string MainTagline,
    string SecondaryTagline,
    string WebsiteUrl,
    string FssaiStatus,
    string GstStatus,
    string ManufacturingLocation);
public record UpdateStoreSettingsRequest(
    bool SampleOrderEnabled, 
    decimal FreeDeliveryThreshold,
    int RecentPurchaseCount,
    int RecentPurchaseDays,
    int LowStockThreshold,
    string SupportEmail,
    string SupportPhone,
    string CompanyName,
    string CompanyTagline,
    string CompanyDescription,
    string LogoUrl,
    string MainTagline,
    string SecondaryTagline,
    string WebsiteUrl,
    string FssaiStatus,
    string GstStatus,
    string ManufacturingLocation);

public record SpecialOfferDto(
    Guid Id,
    string Title,
    string Description,
    string BadgeText,
    string ButtonText,
    string ButtonLink,
    string BackgroundColor,
    string TextColor,
    string BadgeColor,
    string ButtonColor,
    int DisplayOrder,
    bool IsActive,
    DateTime? ValidFrom,
    DateTime? ValidUntil);

public record CreateSpecialOfferRequest(
    string Title,
    string Description,
    string BadgeText,
    string ButtonText,
    string ButtonLink,
    string BackgroundColor,
    string TextColor,
    string BadgeColor,
    string ButtonColor,
    int DisplayOrder,
    bool IsActive,
    DateTime? ValidFrom,
    DateTime? ValidUntil);

public record UpdateSpecialOfferRequest(
    string Title,
    string Description,
    string BadgeText,
    string ButtonText,
    string ButtonLink,
    string BackgroundColor,
    string TextColor,
    string BadgeColor,
    string ButtonColor,
    int DisplayOrder,
    bool IsActive,
    DateTime? ValidFrom,
    DateTime? ValidUntil);
