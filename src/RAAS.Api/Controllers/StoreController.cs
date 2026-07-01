using Microsoft.AspNetCore.Mvc;
using RAAS.Application.DTOs.Admin;
using RAAS.Application.Interfaces;

namespace RAAS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StoreController : ControllerBase
{
    private readonly IStoreSettingsService _settings;
    private readonly ISpecialOfferService _specialOffers;

    public StoreController(IStoreSettingsService settings, ISpecialOfferService specialOffers)
    {
        _settings = settings;
        _specialOffers = specialOffers;
    }

    [HttpGet("settings")]
    public async Task<IActionResult> GetPublicSettings() => Ok(await _settings.GetSettingsAsync());

    [HttpGet("special-offers")]
    public async Task<IActionResult> GetActiveSpecialOffers() => Ok(await _specialOffers.GetActiveOffersAsync());
}
