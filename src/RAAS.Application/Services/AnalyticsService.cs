using RAAS.Application.DTOs.Analytics;
using RAAS.Application.Interfaces;
using RAAS.Domain.Entities;
using RAAS.Domain.Enums;

namespace RAAS.Application.Services;

public class AnalyticsService : IAnalyticsService
{
    private readonly IUnitOfWork _uow;

    public AnalyticsService(IUnitOfWork uow) => _uow = uow;

    public async Task TrackEventAsync(TrackEventRequest request, Guid? userId, string? ip, string? userAgent)
    {
        if (!Enum.TryParse<EventType>(request.EventType, true, out var eventType))
            return;

        await _uow.Repository<Event>().AddAsync(new Event
        {
            EventType = eventType,
            UserId = userId,
            ProductId = request.ProductId,
            OrderId = request.OrderId,
            SessionId = request.SessionId,
            Metadata = request.Metadata,
            IpAddress = ip,
            UserAgent = userAgent
        });
        await _uow.SaveChangesAsync();
    }

    public async Task<AnalyticsDashboardDto> GetDashboardAsync()
    {
        var orders = (await _uow.Repository<Order>().GetAllAsync()).ToList();
        var users = (await _uow.Repository<User>().FindAsync(u => u.Role == UserRole.Customer)).ToList();
        var events = (await _uow.Repository<Event>().GetAllAsync()).ToList();
        var products = (await _uow.Repository<Product>().GetAllAsync()).ToList();
        var orderItems = (await _uow.Repository<OrderItem>().GetAllAsync()).ToList();
        var referrals = (await _uow.Repository<Referral>().GetAllAsync()).ToList();

        var now = DateTime.UtcNow;
        var today = now.Date;
        var weekAgo = now.AddDays(-7);
        var monthAgo = now.AddDays(-30);

        var deliveredOrders = orders.Where(o => o.Status != OrderStatus.Cancelled).ToList();
        var totalRevenue = deliveredOrders.Sum(o => o.Total);

        var sales = new SalesAnalyticsDto(
            totalRevenue,
            deliveredOrders.Where(o => o.CreatedAt.Date == today).Sum(o => o.Total),
            deliveredOrders.Where(o => o.CreatedAt >= weekAgo).Sum(o => o.Total),
            deliveredOrders.Where(o => o.CreatedAt >= monthAgo).Sum(o => o.Total),
            deliveredOrders.Count > 0 ? totalRevenue / deliveredOrders.Count : 0,
            deliveredOrders.Count,
            deliveredOrders.Count(o => o.CreatedAt.Date == today));

        var customersWithOrders = deliveredOrders.Select(o => o.UserId).Distinct().ToHashSet();
        var repeatCustomers = users.Count(u => deliveredOrders.Count(o => o.UserId == u.Id) > 1);
        var customers = new CustomerAnalyticsDto(
            customersWithOrders.Count > 0 ? (double)repeatCustomers / customersWithOrders.Count * 100 : 0,
            users.Count(u => u.CreatedAt >= monthAgo),
            repeatCustomers,
            users.Count);

        var topSelling = orderItems
            .GroupBy(i => i.ProductId)
            .Select(g => new TopProductDto(
                g.Key,
                g.First().ProductName,
                g.Sum(i => i.Quantity),
                g.Sum(i => i.TotalPrice),
                products.FirstOrDefault(p => p.Id == g.Key)?.ViewCount ?? 0))
            .OrderByDescending(p => p.UnitsSold)
            .Take(10)
            .ToList();

        var lowPerforming = products
            .Where(p => p.IsActive)
            .OrderBy(p => p.ViewCount)
            .Take(5)
            .Select(p => new TopProductDto(p.Id, p.Name, 0, 0, p.ViewCount))
            .ToList();

        var categoryPerf = products
            .GroupBy(p => p.CategoryId)
            .Select(g =>
            {
                var catProducts = g.Select(p => p.Id).ToHashSet();
                var catItems = orderItems.Where(i => catProducts.Contains(i.ProductId));
                return new CategoryPerformanceDto(
                    products.First(p => p.CategoryId == g.Key).Name,
                    catItems.Sum(i => i.TotalPrice),
                    catItems.Select(i => i.OrderId).Distinct().Count());
            })
            .OrderByDescending(c => c.Revenue)
            .ToList();

        var productAnalytics = new ProductAnalyticsDto(topSelling, lowPerforming, categoryPerf);

        var convertedReferrals = referrals.Count(r => r.IsRewarded);
        var referralAnalytics = new ReferralAnalyticsDto(
            referrals.Count > 0 ? (double)convertedReferrals / referrals.Count * 100 : 0,
            referrals.Count,
            convertedReferrals,
            referrals.GroupBy(r => r.ReferrerId)
                .Select(g =>
                {
                    var user = users.FirstOrDefault(u => u.Id == g.Key);
                    return new TopReferrerDto(g.Key, user?.FullName ?? "", user?.ReferralCode ?? "", g.Count(), user?.ReferralEarnings ?? 0);
                })
                .OrderByDescending(r => r.ReferralCount)
                .Take(10)
                .ToList());

        var visits = events.Count(e => e.EventType == EventType.PageVisit);
        var productViews = events.Count(e => e.EventType == EventType.ProductViewed);
        var addToCarts = events.Count(e => e.EventType == EventType.AddedToCart);
        var checkoutStarts = events.Count(e => e.EventType == EventType.CheckoutStarted);
        var purchases = events.Count(e => e.EventType == EventType.PurchaseCompleted);

        var funnel = new FunnelAnalyticsDto(
            visits, productViews, addToCarts, checkoutStarts, purchases,
            visits > 0 ? (double)productViews / visits * 100 : 0,
            productViews > 0 ? (double)addToCarts / productViews * 100 : 0,
            addToCarts > 0 ? (double)checkoutStarts / addToCarts * 100 : 0,
            checkoutStarts > 0 ? (double)purchases / checkoutStarts * 100 : 0);

        return new AnalyticsDashboardDto(sales, customers, productAnalytics, referralAnalytics, funnel);
    }
}
