using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RAAS.Application.DTOs.Products;
using RAAS.Application.Interfaces;

namespace RAAS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _products;

    public ProductsController(IProductService products) => _products = products;

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories() => Ok(await _products.GetCategoriesAsync());

    [HttpGet]
    public async Task<IActionResult> GetProducts([FromQuery] string? category, [FromQuery] string? filter, [FromQuery] string? search) =>
        Ok(await _products.GetProductsAsync(category, filter, search));

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetProduct(string slug)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid? uid = userId != null ? Guid.Parse(userId) : null;
        var sessionId = Request.Headers["X-Session-Id"].FirstOrDefault();
        var product = await _products.GetProductBySlugAsync(slug, uid, sessionId);
        return product == null ? NotFound() : Ok(product);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductRequest request)
    {
        var product = await _products.CreateProductAsync(request);
        return CreatedAtAction(nameof(GetProduct), new { slug = product!.Slug }, product);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateProduct(Guid id, [FromBody] UpdateProductRequest request)
    {
        var product = await _products.UpdateProductAsync(id, request);
        return product == null ? NotFound() : Ok(product);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteProduct(Guid id) =>
        await _products.DeleteProductAsync(id) ? NoContent() : NotFound();
}
