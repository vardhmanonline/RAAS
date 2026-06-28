using RAAS.Domain.Common;

namespace RAAS.Domain.Entities;

public class Address : BaseEntity
{
    public Guid UserId { get; set; }
    public string Label { get; set; } = "Home";
    public string Line1 { get; set; } = string.Empty;
    public string Line2 { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Pincode { get; set; } = string.Empty;
    public bool IsDefault { get; set; }

    public User User { get; set; } = null!;
}
