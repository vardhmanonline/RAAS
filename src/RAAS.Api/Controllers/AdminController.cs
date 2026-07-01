using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RAAS.Application.DTOs.Admin;
using RAAS.Application.DTOs.Orders;
using RAAS.Application.Interfaces;

namespace RAAS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IOrderService _orders;
    private readonly IAdminService _admin;
    private readonly IStoreSettingsService _settings;
    private readonly ISpecialOfferService _specialOffers;

    public AdminController(IOrderService orders, IAdminService admin, IStoreSettingsService settings, ISpecialOfferService specialOffers)
    {
        _orders = orders;
        _admin = admin;
        _settings = settings;
        _specialOffers = specialOffers;
    }

    [HttpGet("orders")]
    public async Task<IActionResult> GetOrders() => Ok(await _orders.GetAllOrdersAsync());

    [HttpPut("orders/{id:guid}/status")]
    public async Task<IActionResult> UpdateOrderStatus(Guid id, [FromBody] UpdateOrderStatusRequest request)
    {
        var order = await _orders.UpdateOrderStatusAsync(id, request.Status);
        return order == null ? NotFound() : Ok(order);
    }

    [HttpGet("customers")]
    public async Task<IActionResult> GetCustomers() => Ok(await _admin.GetCustomersAsync());

    [HttpGet("coupons")]
    public async Task<IActionResult> GetCoupons() => Ok(await _admin.GetCouponsAsync());

    [HttpPost("coupons")]
    public async Task<IActionResult> CreateCoupon([FromBody] CreateCouponRequest request) =>
        Ok(await _admin.CreateCouponAsync(request));

    [HttpDelete("coupons/{id:guid}")]
    public async Task<IActionResult> DeactivateCoupon(Guid id) =>
        await _admin.DeactivateCouponAsync(id) ? NoContent() : NotFound();

    [HttpGet("settings")]
    public async Task<IActionResult> GetSettings() => Ok(await _settings.GetSettingsAsync());

    [HttpPut("settings")]
    public async Task<IActionResult> UpdateSettings([FromBody] UpdateStoreSettingsRequest request) =>
        Ok(await _settings.UpdateSettingsAsync(request));

    [HttpGet("special-offers")]
    public async Task<IActionResult> GetAllSpecialOffers() => Ok(await _specialOffers.GetAllOffersAsync());

    [HttpPost("special-offers")]
    public async Task<IActionResult> CreateSpecialOffer([FromBody] CreateSpecialOfferRequest request) =>
        Ok(await _specialOffers.CreateOfferAsync(request));

    [HttpPut("special-offers/{id:guid}")]
    public async Task<IActionResult> UpdateSpecialOffer(Guid id, [FromBody] UpdateSpecialOfferRequest request)
    {
        var offer = await _specialOffers.UpdateOfferAsync(id, request);
        return offer == null ? NotFound() : Ok(offer);
    }

    [HttpDelete("special-offers/{id:guid}")]
    public async Task<IActionResult> DeleteSpecialOffer(Guid id) =>
        await _specialOffers.DeleteOfferAsync(id) ? NoContent() : NotFound();
}
