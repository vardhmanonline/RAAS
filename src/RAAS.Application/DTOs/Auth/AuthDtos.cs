namespace RAAS.Application.DTOs.Auth;

public record RegisterRequest(string Email, string Password, string FullName, string? Phone, string? ReferralCode);
public record LoginRequest(string Email, string Password);
public record AuthResponse(string Token, Guid UserId, string Email, string FullName, string Role, string ReferralCode, int LoyaltyPoints);
