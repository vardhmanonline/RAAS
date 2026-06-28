namespace RAAS.Application.DTOs.Orders;

public record CartItemDto(Guid ProductId, string ProductName, string ImageUrl, decimal UnitPrice, int Quantity);
public record ValidateCouponRequest(string Code, decimal Subtotal);
public record CouponValidationDto(bool IsValid, string Message, decimal DiscountAmount, string? Code);
public record CheckoutRequest(
    List<CartItemDto> Items, string CouponCode, string PaymentMethod,
    string ShippingName, string ShippingPhone, string ShippingAddress,
    string ShippingCity, string ShippingState, string ShippingPincode);
public record OrderDto(
    Guid Id, string OrderNumber, string Status, decimal Subtotal, decimal DeliveryCharge,
    decimal Discount, decimal Total, string PaymentMethod, string PaymentStatus,
    DateTime CreatedAt, List<OrderItemDto> Items);
public record OrderItemDto(Guid ProductId, string ProductName, string ProductImageUrl, int Quantity, decimal UnitPrice, decimal TotalPrice);
public record UpdateOrderStatusRequest(string Status);
