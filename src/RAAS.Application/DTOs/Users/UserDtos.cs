namespace RAAS.Application.DTOs.Users;

public record UserProfileDto(
    Guid Id, string Email, string FullName, string? Phone, int LoyaltyPoints,
    string ReferralCode, List<AddressDto> Addresses);

public record AddressDto(Guid Id, string Label, string Line1, string Line2, string City, string State, string Pincode, bool IsDefault);
public record CreateAddressRequest(string Label, string Line1, string Line2, string City, string State, string Pincode, bool IsDefault);
