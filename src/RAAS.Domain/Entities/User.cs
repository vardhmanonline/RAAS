using System.ComponentModel.DataAnnotations;
using RAAS.Domain.Common;
using RAAS.Domain.Enums;

namespace RAAS.Domain.Entities;

public class User : BaseEntity
{
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    [StringLength(256, ErrorMessage = "Email cannot exceed 256 characters")]
    public string Email { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Password is required")]
    public string PasswordHash { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Full name is required")]
    [StringLength(100, ErrorMessage = "Full name cannot exceed 100 characters")]
    public string FullName { get; set; } = string.Empty;
    
    [Phone(ErrorMessage = "Invalid phone number format")]
    [RegularExpression(@"^[6-9]\d{9}$", ErrorMessage = "Phone number must be 10 digits starting with 6-9")]
    [StringLength(10, ErrorMessage = "Phone number must be 10 digits")]
    public string? Phone { get; set; }
    
    public UserRole Role { get; set; } = UserRole.Customer;
    public string ReferralCode { get; set; } = string.Empty;
    public Guid? ReferredByUserId { get; set; }
    public int LoyaltyPoints { get; set; }
    public decimal ReferralEarnings { get; set; }
    public bool HasClaimedSample { get; set; } = false;
    public bool IsGuest { get; set; } = false;
    
    [EmailAddress(ErrorMessage = "Invalid guest email format")]
    public string? GuestEmail { get; set; }

    public User? ReferredBy { get; set; }
    public ICollection<User> Referrals { get; set; } = new List<User>();
    public ICollection<Address> Addresses { get; set; } = new List<Address>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<Referral> ReferralRecords { get; set; } = new List<Referral>();
}
