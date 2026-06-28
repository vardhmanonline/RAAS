using RAAS.Application.DTOs.Products;
using RAAS.Domain.Entities;

namespace RAAS.Application.Interfaces;

public interface IProductService
{
    Task<IEnumerable<CategoryDto>> GetCategoriesAsync();
    Task<IEnumerable<ProductListDto>> GetProductsAsync(string? category, string? filter, string? search);
    Task<ProductDetailDto?> GetProductBySlugAsync(string slug, Guid? userId, string? sessionId);
    Task<Product?> CreateProductAsync(CreateProductRequest request);
    Task<Product?> UpdateProductAsync(Guid id, UpdateProductRequest request);
    Task<bool> DeleteProductAsync(Guid id);
}
