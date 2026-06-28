namespace RAAS.Application.DTOs.Products;

public record ProductListDto(
    Guid Id, string Name, string Slug, decimal Price, decimal? CompareAtPrice,
    double Rating, int ReviewCount, string ImageUrl, bool IsBestseller,
    string CategoryName, string SpiceLevel, int Stock);

public record ProductDetailDto(
    Guid Id, string Name, string Slug, string Description, string Story,
    string HealthBenefits, string UsageSuggestions, string Ingredients,
    decimal Price, decimal? CompareAtPrice, double Rating, int ReviewCount,
    string ImageUrl, string[] GalleryUrls, bool IsBestseller, string SpiceLevel,
    int Stock, string CategoryName, Guid CategoryId);

public record CreateProductRequest(
    Guid CategoryId, string Name, string Description, string Story,
    string HealthBenefits, string UsageSuggestions, string Ingredients,
    decimal Price, decimal? CompareAtPrice, int Stock, string SpiceLevel,
    bool IsBestseller, string ImageUrl, string[]? GalleryUrls);

public record UpdateProductRequest(
    Guid CategoryId, string Name, string Description, string Story,
    string HealthBenefits, string UsageSuggestions, string Ingredients,
    decimal Price, decimal? CompareAtPrice, int Stock, string SpiceLevel,
    bool IsBestseller, bool IsActive, string ImageUrl, string[]? GalleryUrls);

public record CategoryDto(Guid Id, string Name, string Slug, string Description, string ImageUrl, int ProductCount);
