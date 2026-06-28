namespace RAAS.Application.DTOs.Analytics;

public record SalesAnalyticsDto(
    decimal TotalRevenue, decimal TodayRevenue, decimal WeekRevenue, decimal MonthRevenue,
    decimal AverageOrderValue, int TotalOrders, int TodayOrders);

public record CustomerAnalyticsDto(
    double RepeatCustomerPercent, int NewCustomers, int ReturningCustomers, int TotalCustomers);

public record ProductAnalyticsDto(
    List<TopProductDto> TopSelling, List<TopProductDto> LowPerforming, List<CategoryPerformanceDto> CategoryPerformance);

public record TopProductDto(Guid ProductId, string Name, int UnitsSold, decimal Revenue, int ViewCount);
public record CategoryPerformanceDto(string Category, decimal Revenue, int OrderCount);

public record ReferralAnalyticsDto(
    double ConversionRate, int TotalReferrals, int ConvertedReferrals, List<TopReferrerDto> TopReferrers);

public record TopReferrerDto(Guid UserId, string Name, string ReferralCode, int ReferralCount, decimal Earnings);

public record FunnelAnalyticsDto(
    int Visits, int ProductViews, int AddToCarts, int CheckoutStarts, int Purchases,
    double ViewRate, double CartRate, double CheckoutRate, double PurchaseRate);

public record AnalyticsDashboardDto(
    SalesAnalyticsDto Sales, CustomerAnalyticsDto Customers,
    ProductAnalyticsDto Products, ReferralAnalyticsDto Referrals, FunnelAnalyticsDto Funnel);

public record TrackEventRequest(string EventType, Guid? ProductId, Guid? OrderId, string? SessionId, string? Metadata);
