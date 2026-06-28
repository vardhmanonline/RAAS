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

    public AdminController(IOrderService orders, IAdminService admin)
    {
        _orders = orders;
        _admin = admin;
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
}
