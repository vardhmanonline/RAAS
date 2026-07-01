using System.ComponentModel.DataAnnotations;

namespace RAAS.Application.DTOs.Users;

public record UserProfileDto(
    Guid Id, string Email, string FullName, string? Phone, int LoyaltyPoints,
    string ReferralCode, List<AddressDto> Addresses);

public record AddressDto(Guid Id, string Label, string Line1, string Line2, string City, string State, string Pincode, bool IsDefault);

public record CreateAddressRequest(
    [Required(ErrorMessage = "Label is required")]
    [StringLength(50, ErrorMessage = "Label cannot exceed 50 characters")]
    string Label,
    
    [Required(ErrorMessage = "Address Line 1 is required")]
    [StringLength(200, ErrorMessage = "Address Line 1 cannot exceed 200 characters")]
    string Line1,
    
    [StringLength(200, ErrorMessage = "Address Line 2 cannot exceed 200 characters")]
    string Line2,
    
    [Required(ErrorMessage = "City is required")]
    [StringLength(100, ErrorMessage = "City cannot exceed 100 characters")]
    string City,
    
    [Required(ErrorMessage = "State is required")]
    [StringLength(100, ErrorMessage = "State cannot exceed 100 characters")]
    string State,
    
    [Required(ErrorMessage = "Pincode is required")]
    [RegularExpression(@"^\d{6}$", ErrorMessage = "Pincode must be exactly 6 digits")]
    string Pincode,
    
    bool IsDefault);
