using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using RAAS.Application.DTOs.Auth;
using RAAS.Application.Interfaces;
using RAAS.Domain.Entities;
using RAAS.Domain.Enums;

namespace RAAS.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _uow;
    private readonly IConfiguration _config;
    private readonly IEmailService _email;
    private readonly IAnalyticsService _analytics;

    public AuthService(IUnitOfWork uow, IConfiguration config, IEmailService email, IAnalyticsService analytics)
    {
        _uow = uow;
        _config = config;
        _email = email;
        _analytics = analytics;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        var users = _uow.Repository<User>();
        var existing = (await users.FindAsync(u => u.Email == request.Email.ToLower())).FirstOrDefault();
        if (existing != null)
            throw new InvalidOperationException("Email already registered");

        User? referrer = null;
        if (!string.IsNullOrWhiteSpace(request.ReferralCode))
        {
            referrer = (await users.FindAsync(u => u.ReferralCode == request.ReferralCode.ToUpper())).FirstOrDefault();
        }

        var user = new User
        {
            Email = request.Email.ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            FullName = request.FullName,
            Phone = request.Phone,
            ReferralCode = GenerateReferralCode(),
            ReferredByUserId = referrer?.Id,
            Role = UserRole.Customer
        };

        await users.AddAsync(user);

        if (referrer != null)
        {
            await _uow.Repository<Referral>().AddAsync(new Referral
            {
                ReferrerId = referrer.Id,
                ReferredUserId = user.Id,
                RewardAmount = 50
            });
        }

        await _uow.SaveChangesAsync();
        await _email.SendWelcomeEmailAsync(user.Email, user.FullName);
        await _analytics.TrackEventAsync(new DTOs.Analytics.TrackEventRequest("UserRegistered", null, null, null, null), user.Id, null, null);

        return new AuthResponse(GenerateToken(user), user.Id, user.Email, user.FullName, user.Role.ToString(), user.ReferralCode, user.LoyaltyPoints);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = (await _uow.Repository<User>().FindAsync(u => u.Email == request.Email.ToLower())).FirstOrDefault()
            ?? throw new UnauthorizedAccessException("Invalid credentials");

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid credentials");

        return new AuthResponse(GenerateToken(user), user.Id, user.Email, user.FullName, user.Role.ToString(), user.ReferralCode, user.LoyaltyPoints);
    }

    public string GenerateToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? "RAAS_SuperSecret_Key_Change_In_Production_32chars!"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim("name", user.FullName)
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"] ?? "RAAS",
            audience: _config["Jwt:Audience"] ?? "RAAS",
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string GenerateReferralCode()
    {
        const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        var random = new Random();
        return new string(Enumerable.Range(0, 8).Select(_ => chars[random.Next(chars.Length)]).ToArray());
    }
}
