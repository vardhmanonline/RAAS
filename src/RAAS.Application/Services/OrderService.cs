using RAAS.Application.DTOs.Orders;
using RAAS.Application.Interfaces;
using RAAS.Domain.Entities;
using RAAS.Domain.Enums;

namespace RAAS.Application.Services;

public class OrderService : IOrderService
{
    private readonly IUnitOfWork _uow;
    private readonly IEmailService _email;
    private readonly IAnalyticsService _analytics;
    private readonly IReferralService _referral;

    public OrderService(IUnitOfWork uow, IEmailService email, IAnalyticsService analytics, IReferralService referral)
    {
        _uow = uow;
        _email = email;
        _analytics = analytics;
        _referral = referral;
    }

    public async Task<CouponValidationDto> ValidateCouponAsync(ValidateCouponRequest request)
    {
        var coupon = (await _uow.Repository<Coupon>().FindAsync(c =>
            c.Code == request.Code.ToUpper() && c.IsActive)).FirstOrDefault();

        if (coupon == null)
            return new CouponValidationDto(false, "Invalid coupon code", 0, null);

        if (DateTime.UtcNow < coupon.ValidFrom || DateTime.UtcNow > coupon.ValidUntil)
            return new CouponValidationDto(false, "Coupon has expired", 0, null);

        if (coupon.UsageCount >= coupon.UsageLimit)
            return new CouponValidationDto(false, "Coupon usage limit reached", 0, null);

        if (request.Subtotal < coupon.MinOrderAmount)
            return new CouponValidationDto(false, $"Minimum order amount is ₹{coupon.MinOrderAmount}", 0, null);

        var discount = request.Subtotal * coupon.DiscountPercent / 100;
        if (coupon.MaxDiscountAmount.HasValue)
            discount = Math.Min(discount, coupon.MaxDiscountAmount.Value);

        return new CouponValidationDto(true, $"{coupon.DiscountPercent}% discount applied", discount, coupon.Code);
    }

    public async Task<OrderDto> PlaceOrderAsync(Guid userId, CheckoutRequest request)
    {
        if (request.Items.Count == 0)
            throw new InvalidOperationException("Cart is empty");

        var productRepo = _uow.Repository<Product>();
        var orderItems = new List<OrderItem>();
        decimal subtotal = 0;

        foreach (var item in request.Items)
        {
            var product = await productRepo.GetByIdAsync(item.ProductId)
                ?? throw new InvalidOperationException($"Product not found: {item.ProductName}");

            if (product.Stock < item.Quantity)
                throw new InvalidOperationException($"Insufficient stock for {product.Name}");

            var lineTotal = product.Price * item.Quantity;
            subtotal += lineTotal;

            orderItems.Add(new OrderItem
            {
                ProductId = product.Id,
                ProductName = product.Name,
                ProductImageUrl = product.ImageUrl,
                Quantity = item.Quantity,
                UnitPrice = product.Price,
                TotalPrice = lineTotal
            });

            product.Stock -= item.Quantity;
            product.UpdatedAt = DateTime.UtcNow;
            await productRepo.UpdateAsync(product);

            if (product.Stock <= 10)
                await _email.SendLowStockAlertAsync(product.Name, product.Stock);
        }

        decimal discount = 0;
        string? couponCode = null;
        if (!string.IsNullOrWhiteSpace(request.CouponCode))
        {
            var validation = await ValidateCouponAsync(new ValidateCouponRequest(request.CouponCode, subtotal));
            if (validation.IsValid)
            {
                discount = validation.DiscountAmount;
                couponCode = validation.Code;
                var coupon = (await _uow.Repository<Coupon>().FindAsync(c => c.Code == couponCode)).First();
                coupon.UsageCount++;
                await _uow.Repository<Coupon>().UpdateAsync(coupon);
            }
        }

        var deliveryCharge = CalculateDeliveryCharge(subtotal);
        var total = subtotal + deliveryCharge - discount;

        var order = new Order
        {
            OrderNumber = $"RAAS{DateTime.UtcNow:yyMMdd}{Random.Shared.Next(1000, 9999)}",
            UserId = userId,
            Status = OrderStatus.Pending,
            PaymentMethod = Enum.Parse<PaymentMethod>(request.PaymentMethod, true),
            PaymentStatus = request.PaymentMethod == "COD" ? "Pending" : "Paid",
            Subtotal = subtotal,
            DeliveryCharge = deliveryCharge,
            Discount = discount,
            Total = total,
            CouponCode = couponCode,
            ShippingName = request.ShippingName,
            ShippingPhone = request.ShippingPhone,
            ShippingAddress = request.ShippingAddress,
            ShippingCity = request.ShippingCity,
            ShippingState = request.ShippingState,
            ShippingPincode = request.ShippingPincode
        };

        await _uow.Repository<Order>().AddAsync(order);
        foreach (var item in orderItems)
        {
            item.OrderId = order.Id;
            await _uow.Repository<OrderItem>().AddAsync(item);
        }

        var user = await _uow.Repository<User>().GetByIdAsync(userId);
        if (user != null)
        {
            user.LoyaltyPoints += (int)(total / 10);
            user.UpdatedAt = DateTime.UtcNow;
            await _uow.Repository<User>().UpdateAsync(user);
        }

        await _uow.SaveChangesAsync();

        await _email.SendOrderConfirmationAsync(user!.Email, user.FullName, order.OrderNumber, order.Total);
        await _email.SendAdminOrderAlertAsync(order.OrderNumber, order.Total, user.FullName);
        await _analytics.TrackEventAsync(
            new DTOs.Analytics.TrackEventRequest("PurchaseCompleted", null, order.Id, null, null),
            userId, null, null);
        await _referral.ProcessReferralRewardAsync(userId);

        return MapOrder(order, orderItems);
    }

    public async Task<IEnumerable<OrderDto>> GetUserOrdersAsync(Guid userId)
    {
        var orders = await _uow.Repository<Order>().FindAsync(o => o.UserId == userId);
        var result = new List<OrderDto>();
        foreach (var order in orders.OrderByDescending(o => o.CreatedAt))
        {
            var items = await _uow.Repository<OrderItem>().FindAsync(i => i.OrderId == order.Id);
            result.Add(MapOrder(order, items));
        }
        return result;
    }

    public async Task<OrderDto?> GetOrderAsync(Guid orderId, Guid? userId = null)
    {
        var order = await _uow.Repository<Order>().GetByIdAsync(orderId);
        if (order == null || (userId.HasValue && order.UserId != userId)) return null;
        var items = await _uow.Repository<OrderItem>().FindAsync(i => i.OrderId == order.Id);
        return MapOrder(order, items);
    }

    public async Task<IEnumerable<OrderDto>> GetAllOrdersAsync()
    {
        var orders = await _uow.Repository<Order>().GetAllAsync();
        var result = new List<OrderDto>();
        foreach (var order in orders.OrderByDescending(o => o.CreatedAt))
        {
            var items = await _uow.Repository<OrderItem>().FindAsync(i => i.OrderId == order.Id);
            result.Add(MapOrder(order, items));
        }
        return result;
    }

    public async Task<OrderDto?> UpdateOrderStatusAsync(Guid orderId, string status)
    {
        var order = await _uow.Repository<Order>().GetByIdAsync(orderId);
        if (order == null) return null;

        var newStatus = Enum.Parse<OrderStatus>(status, true);
        order.Status = newStatus;
        order.UpdatedAt = DateTime.UtcNow;

        var user = await _uow.Repository<User>().GetByIdAsync(order.UserId);

        if (newStatus == OrderStatus.Shipped)
        {
            order.ShippedAt = DateTime.UtcNow;
            if (user != null)
                await _email.SendOrderShippedAsync(user.Email, user.FullName, order.OrderNumber);
        }
        else if (newStatus == OrderStatus.Delivered)
        {
            order.DeliveredAt = DateTime.UtcNow;
            if (user != null)
                await _email.SendOrderDeliveredAsync(user.Email, user.FullName, order.OrderNumber, user.ReferralCode);
        }

        await _uow.Repository<Order>().UpdateAsync(order);
        await _uow.SaveChangesAsync();

        var items = await _uow.Repository<OrderItem>().FindAsync(i => i.OrderId == order.Id);
        return MapOrder(order, items);
    }

    public decimal CalculateDeliveryCharge(decimal subtotal) => subtotal >= 499 ? 0 : 49;

    private static OrderDto MapOrder(Order order, IEnumerable<OrderItem> items) => new(
        order.Id, order.OrderNumber, order.Status.ToString(), order.Subtotal, order.DeliveryCharge,
        order.Discount, order.Total, order.PaymentMethod.ToString(), order.PaymentStatus,
        order.CreatedAt,
        items.Select(i => new OrderItemDto(i.ProductId, i.ProductName, i.ProductImageUrl, i.Quantity, i.UnitPrice, i.TotalPrice)).ToList());
}
