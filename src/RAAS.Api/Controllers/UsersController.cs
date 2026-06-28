using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RAAS.Application.DTOs.Users;
using RAAS.Application.Interfaces;

namespace RAAS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _users;
    private readonly IReferralService _referrals;

    public UsersController(IUserService users, IReferralService referrals)
    {
        _users = users;
        _referrals = referrals;
    }

    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var profile = await _users.GetProfileAsync(UserId);
        return profile == null ? NotFound() : Ok(profile);
    }

    [HttpPost("addresses")]
    public async Task<IActionResult> AddAddress([FromBody] CreateAddressRequest request) =>
        Ok(await _users.AddAddressAsync(UserId, request));

    [HttpGet("referrals")]
    public async Task<IActionResult> GetReferralDashboard() =>
        Ok(await _referrals.GetDashboardAsync(UserId));

    [HttpGet("referrals/history")]
    public async Task<IActionResult> GetReferralHistory() =>
        Ok(await _referrals.GetReferralHistoryAsync(UserId));
}
