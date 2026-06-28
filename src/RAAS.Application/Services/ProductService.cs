using RAAS.Application.DTOs.Products;
using RAAS.Application.Interfaces;
using RAAS.Domain.Entities;
using RAAS.Domain.Enums;

namespace RAAS.Application.Services;

public class ProductService : IProductService
{
    private readonly IUnitOfWork _uow;
    private readonly IAnalyticsService _analytics;

    public ProductService(IUnitOfWork uow, IAnalyticsService analytics)
    {
        _uow = uow;
        _analytics = analytics;
    }

    public async Task<IEnumerable<CategoryDto>> GetCategoriesAsync()
    {
        var categories = await _uow.Repository<Category>().FindAsync(c => c.IsActive);
        var products = await _uow.Repository<Product>().FindAsync(p => p.IsActive);

        return categories.OrderBy(c => c.DisplayOrder).Select(c => new CategoryDto(
            c.Id, c.Name, c.Slug, c.Description, c.ImageUrl,
            products.Count(p => p.CategoryId == c.Id)));
    }

    public async Task<IEnumerable<ProductListDto>> GetProductsAsync(string? category, string? filter, string? search)
    {
        var products = await _uow.Repository<Product>().FindAsync(p => p.IsActive);
        var categories = await _uow.Repository<Category>().GetAllAsync();
        var catMap = categories.ToDictionary(c => c.Id);

        var query = products.AsEnumerable();

        if (!string.IsNullOrEmpty(category))
            query = query.Where(p => catMap.TryGetValue(p.CategoryId, out var c) && c.Slug == category);

        if (filter == "bestseller")
            query = query.Where(p => p.IsBestseller);
        else if (filter == "spicy")
            query = query.Where(p => p.SpiceLevel == SpiceLevel.Spicy);
        else if (filter == "mild")
            query = query.Where(p => p.SpiceLevel == SpiceLevel.Mild);

        if (!string.IsNullOrEmpty(search))
            query = query.Where(p => p.Name.Contains(search, StringComparison.OrdinalIgnoreCase));

        return query.Select(p => new ProductListDto(
            p.Id, p.Name, p.Slug, p.Price, p.CompareAtPrice, p.Rating, p.ReviewCount,
            p.ImageUrl, p.IsBestseller,
            catMap.TryGetValue(p.CategoryId, out var cat) ? cat.Name : "",
            p.SpiceLevel.ToString(), p.Stock));
    }

    public async Task<ProductDetailDto?> GetProductBySlugAsync(string slug, Guid? userId, string? sessionId)
    {
        var product = (await _uow.Repository<Product>().FindAsync(p => p.Slug == slug && p.IsActive)).FirstOrDefault();
        if (product == null) return null;

        var category = await _uow.Repository<Category>().GetByIdAsync(product.CategoryId);

        product.ViewCount++;
        product.UpdatedAt = DateTime.UtcNow;
        await _uow.Repository<Product>().UpdateAsync(product);

        await _uow.Repository<ProductView>().AddAsync(new ProductView
        {
            ProductId = product.Id,
            UserId = userId,
            SessionId = sessionId
        });

        await _uow.SaveChangesAsync();

        await _analytics.TrackEventAsync(
            new DTOs.Analytics.TrackEventRequest("ProductViewed", product.Id, null, sessionId, null),
            userId, null, null);

        return new ProductDetailDto(
            product.Id, product.Name, product.Slug, product.Description, product.Story,
            product.HealthBenefits, product.UsageSuggestions, product.Ingredients,
            product.Price, product.CompareAtPrice, product.Rating, product.ReviewCount,
            product.ImageUrl, product.GalleryUrls, product.IsBestseller,
            product.SpiceLevel.ToString(), product.Stock,
            category?.Name ?? "", product.CategoryId);
    }

    public async Task<Product?> CreateProductAsync(CreateProductRequest request)
    {
        var slug = Slugify(request.Name);
        var product = new Product
        {
            CategoryId = request.CategoryId,
            Name = request.Name,
            Slug = slug,
            Description = request.Description,
            Story = request.Story,
            HealthBenefits = request.HealthBenefits,
            UsageSuggestions = request.UsageSuggestions,
            Ingredients = request.Ingredients,
            Price = request.Price,
            CompareAtPrice = request.CompareAtPrice,
            Stock = request.Stock,
            SpiceLevel = Enum.Parse<SpiceLevel>(request.SpiceLevel, true),
            IsBestseller = request.IsBestseller,
            ImageUrl = request.ImageUrl,
            GalleryUrls = request.GalleryUrls ?? Array.Empty<string>()
        };

        await _uow.Repository<Product>().AddAsync(product);
        await _uow.SaveChangesAsync();
        return product;
    }

    public async Task<Product?> UpdateProductAsync(Guid id, UpdateProductRequest request)
    {
        var product = await _uow.Repository<Product>().GetByIdAsync(id);
        if (product == null) return null;

        product.CategoryId = request.CategoryId;
        product.Name = request.Name;
        product.Slug = Slugify(request.Name);
        product.Description = request.Description;
        product.Story = request.Story;
        product.HealthBenefits = request.HealthBenefits;
        product.UsageSuggestions = request.UsageSuggestions;
        product.Ingredients = request.Ingredients;
        product.Price = request.Price;
        product.CompareAtPrice = request.CompareAtPrice;
        product.Stock = request.Stock;
        product.SpiceLevel = Enum.Parse<SpiceLevel>(request.SpiceLevel, true);
        product.IsBestseller = request.IsBestseller;
        product.IsActive = request.IsActive;
        product.ImageUrl = request.ImageUrl;
        product.GalleryUrls = request.GalleryUrls ?? product.GalleryUrls;
        product.UpdatedAt = DateTime.UtcNow;

        await _uow.Repository<Product>().UpdateAsync(product);
        await _uow.SaveChangesAsync();
        return product;
    }

    public async Task<bool> DeleteProductAsync(Guid id)
    {
        var product = await _uow.Repository<Product>().GetByIdAsync(id);
        if (product == null) return false;
        product.IsActive = false;
        product.UpdatedAt = DateTime.UtcNow;
        await _uow.Repository<Product>().UpdateAsync(product);
        await _uow.SaveChangesAsync();
        return true;
    }

    private static string Slugify(string name) =>
        name.ToLower().Replace(" ", "-").Replace("'", "");
}
