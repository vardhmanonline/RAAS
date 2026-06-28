using RAAS.Application.DTOs.Analytics;

namespace RAAS.Application.Interfaces;

public interface IAnalyticsService
{
    Task TrackEventAsync(TrackEventRequest request, Guid? userId, string? ip, string? userAgent);
    Task<AnalyticsDashboardDto> GetDashboardAsync();
}
