using System.ComponentModel.DataAnnotations;
using RAAS.Domain.Common;

namespace RAAS.Domain.Entities;

public class Address : BaseEntity
{
    public Guid UserId { get; set; }
    
    [Required(ErrorMessage = "Label is required")]
    [StringLength(50, ErrorMessage = "Label cannot exceed 50 characters")]
    public string Label { get; set; } = "Home";
    
    [Required(ErrorMessage = "Address Line 1 is required")]
    [StringLength(200, ErrorMessage = "Address Line 1 cannot exceed 200 characters")]
    public string Line1 { get; set; } = string.Empty;
    
    [StringLength(200, ErrorMessage = "Address Line 2 cannot exceed 200 characters")]
    public string Line2 { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "City is required")]
    [StringLength(100, ErrorMessage = "City cannot exceed 100 characters")]
    public string City { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "State is required")]
    [StringLength(100, ErrorMessage = "State cannot exceed 100 characters")]
    public string State { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Pincode is required")]
    [RegularExpression(@"^\d{6}$", ErrorMessage = "Pincode must be exactly 6 digits")]
    public string Pincode { get; set; } = string.Empty;
    
    public bool IsDefault { get; set; }

    public User User { get; set; } = null!;
}
