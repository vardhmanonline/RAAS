using System.ComponentModel.DataAnnotations;
using RAAS.Domain.Common;
using RAAS.Domain.Enums;

namespace RAAS.Domain.Entities;

public class Order : BaseEntity
{
    [Required(ErrorMessage = "Order number is required")]
    public string OrderNumber { get; set; } = string.Empty;
    
    public Guid UserId { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public PaymentMethod PaymentMethod { get; set; }
    public string PaymentStatus { get; set; } = "Pending";
    public decimal Subtotal { get; set; }
    public decimal DeliveryCharge { get; set; }
    public decimal Discount { get; set; }
    public decimal Total { get; set; }
    public string? CouponCode { get; set; }
    
    [Required(ErrorMessage = "Shipping name is required")]
    [StringLength(100, ErrorMessage = "Shipping name cannot exceed 100 characters")]
    public string ShippingName { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Shipping phone is required")]
    [Phone(ErrorMessage = "Invalid phone number format")]
    [RegularExpression(@"^[6-9]\d{9}$", ErrorMessage = "Phone number must be 10 digits starting with 6-9")]
    [StringLength(10, ErrorMessage = "Phone number must be 10 digits")]
    public string ShippingPhone { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Shipping address is required")]
    [StringLength(200, ErrorMessage = "Shipping address cannot exceed 200 characters")]
    public string ShippingAddress { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Shipping city is required")]
    [StringLength(100, ErrorMessage = "Shipping city cannot exceed 100 characters")]
    public string ShippingCity { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Shipping state is required")]
    [StringLength(100, ErrorMessage = "Shipping state cannot exceed 100 characters")]
    public string ShippingState { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Shipping pincode is required")]
    [RegularExpression(@"^\d{6}$", ErrorMessage = "Pincode must be exactly 6 digits")]
    public string ShippingPincode { get; set; } = string.Empty;
    
    public DateTime? ShippedAt { get; set; }
    public DateTime? DeliveredAt { get; set; }
    public bool IsGuestOrder { get; set; } = false;
    public bool IsSampleOrder { get; set; } = false;
    
    [EmailAddress(ErrorMessage = "Invalid guest email format")]
    public string? GuestEmail { get; set; }

    public User User { get; set; } = null!;
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}
