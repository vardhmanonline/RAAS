using RAAS.Application.DTOs.Orders;

namespace RAAS.Application.Interfaces;

public interface IOrderService
{
    Task<CouponValidationDto> ValidateCouponAsync(ValidateCouponRequest request);
    Task<OrderDto> PlaceOrderAsync(Guid userId, CheckoutRequest request);
    Task<OrderDto> PlaceGuestOrderAsync(GuestCheckoutRequest request);
    Task<OrderDto> ClaimSampleOrderAsync(Guid userId, ClaimSampleRequest request);
    Task<IEnumerable<OrderDto>> GetUserOrdersAsync(Guid userId);
    Task<OrderDto?> GetOrderAsync(Guid orderId, Guid? userId = null);
    Task<IEnumerable<OrderDto>> GetAllOrdersAsync();
    Task<OrderDto?> UpdateOrderStatusAsync(Guid orderId, string status);
    decimal CalculateDeliveryCharge(decimal subtotal);
}
