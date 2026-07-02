using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RAAS.Application.DTOs.InvestorCrm;
using RAAS.Application.Interfaces;

namespace RAAS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class InvestorCrmController : ControllerBase
{
    private readonly IInvestorCrmService _investorCrm;

    public InvestorCrmController(IInvestorCrmService investorCrm) => _investorCrm = investorCrm;

    [HttpGet("overview")]
    public async Task<IActionResult> GetOverview() => Ok(await _investorCrm.GetOverviewAsync());

    [HttpGet("investors")]
    public async Task<IActionResult> GetInvestors() => Ok(await _investorCrm.GetInvestorsAsync());

    [HttpGet("deals")]
    public async Task<IActionResult> GetDeals() => Ok(await _investorCrm.GetDealsAsync());

    [HttpGet("pricing-plans")]
    public async Task<IActionResult> GetPricingPlans() => Ok(await _investorCrm.GetPricingPlansAsync());

    [HttpGet("compliance-cases")]
    public async Task<IActionResult> GetComplianceCases([FromQuery] string? status) => Ok(await _investorCrm.GetComplianceCasesAsync(status));

    [HttpGet("revenue-report")]
    public async Task<IActionResult> GetRevenueReport([FromQuery] Guid? dealId, [FromQuery] decimal? minAreaInAcres, [FromQuery] DateTime? from, [FromQuery] DateTime? to) =>
        Ok(await _investorCrm.GetRevenueReportAsync(dealId, minAreaInAcres, from, to));

    [HttpPost("investors")]
    public async Task<IActionResult> CreateInvestor([FromBody] CreateInvestorAccountRequest request)
    {
        try
        {
            return Ok(new { id = await _investorCrm.CreateInvestorAsync(request) });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("deals")]
    public async Task<IActionResult> CreateDeal([FromBody] CreateLandDealRequest request)
    {
        try
        {
            return Ok(new { id = await _investorCrm.CreateLandDealAsync(request) });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("investment-flows")]
    public async Task<IActionResult> RecordInvestment([FromBody] CreateInvestmentFlowRequest request)
    {
        try
        {
            return Ok(new { id = await _investorCrm.RecordInvestmentFlowAsync(request) });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("investor-payouts")]
    public async Task<IActionResult> RecordPayout([FromBody] CreateInvestorPayoutRequest request)
    {
        try
        {
            return Ok(new { id = await _investorCrm.RecordInvestorPayoutAsync(request) });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("compliance-cases")]
    public async Task<IActionResult> CreateComplianceCase([FromBody] CreateComplianceCaseRequest request)
    {
        try
        {
            return Ok(new { id = await _investorCrm.CreateComplianceCaseAsync(request) });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
