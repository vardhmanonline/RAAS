using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RAAS.Application.DTOs.Orders;
using RAAS.Application.Interfaces;

namespace RAAS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orders;
    private readonly IAnalyticsService _analytics;

    public OrdersController(IOrderService orders, IAnalyticsService analytics)
    {
        _orders = orders;
        _analytics = analytics;
    }

    [HttpPost("validate-coupon")]
    public async Task<IActionResult> ValidateCoupon([FromBody] ValidateCouponRequest request) =>
        Ok(await _orders.ValidateCouponAsync(request));

    [Authorize]
    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout([FromBody] CheckoutRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        try
        {
            return Ok(await _orders.PlaceOrderAsync(userId, request));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [Authorize]
    [HttpGet("my")]
    public async Task<IActionResult> MyOrders()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        return Ok(await _orders.GetUserOrdersAsync(userId));
    }

    [Authorize]
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetOrder(Guid id)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var order = await _orders.GetOrderAsync(id, userId);
        return order == null ? NotFound() : Ok(order);
    }

    [Authorize]
    [HttpPost("track-cart")]
    public async Task<IActionResult> TrackCart()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await _analytics.TrackEventAsync(
            new Application.DTOs.Analytics.TrackEventRequest("AddedToCart", null, null, null, null),
            userId, HttpContext.Connection.RemoteIpAddress?.ToString(), Request.Headers.UserAgent);
        return Ok();
    }

    [Authorize]
    [HttpPost("track-checkout")]
    public async Task<IActionResult> TrackCheckout()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await _analytics.TrackEventAsync(
            new Application.DTOs.Analytics.TrackEventRequest("CheckoutStarted", null, null, null, null),
            userId, HttpContext.Connection.RemoteIpAddress?.ToString(), Request.Headers.UserAgent);
        return Ok();
    }
}
