using RAAS.Application.DTOs.Auth;
using RAAS.Domain.Entities;

namespace RAAS.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    string GenerateToken(User user);
}
