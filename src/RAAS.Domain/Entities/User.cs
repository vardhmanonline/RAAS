using RAAS.Domain.Common;
using RAAS.Domain.Enums;

namespace RAAS.Domain.Entities;

public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public UserRole Role { get; set; } = UserRole.Customer;
    public string ReferralCode { get; set; } = string.Empty;
    public Guid? ReferredByUserId { get; set; }
    public int LoyaltyPoints { get; set; }
    public decimal ReferralEarnings { get; set; }

    public User? ReferredBy { get; set; }
    public ICollection<User> Referrals { get; set; } = new List<User>();
    public ICollection<Address> Addresses { get; set; } = new List<Address>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<Referral> ReferralRecords { get; set; } = new List<Referral>();
}
