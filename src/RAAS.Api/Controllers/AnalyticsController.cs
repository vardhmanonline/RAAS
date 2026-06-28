using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RAAS.Application.DTOs.Analytics;
using RAAS.Application.Interfaces;

namespace RAAS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _analytics;

    public AnalyticsController(IAnalyticsService analytics) => _analytics = analytics;

    [HttpPost("track")]
    public async Task<IActionResult> Track([FromBody] TrackEventRequest request)
    {
        Guid? userId = null;
        if (User.Identity?.IsAuthenticated == true && Guid.TryParse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value, out var uid))
            userId = uid;

        await _analytics.TrackEventAsync(request, userId,
            HttpContext.Connection.RemoteIpAddress?.ToString(), Request.Headers.UserAgent);
        return Ok();
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("dashboard")]
    public async Task<IActionResult> Dashboard() => Ok(await _analytics.GetDashboardAsync());
}
