using RAAS.Domain.Common;
using RAAS.Domain.Enums;

namespace RAAS.Domain.Entities;

public class Product : BaseEntity
{
    public Guid CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Story { get; set; } = string.Empty;
    public string HealthBenefits { get; set; } = string.Empty;
    public string UsageSuggestions { get; set; } = string.Empty;
    public string Ingredients { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? CompareAtPrice { get; set; }
    public int Stock { get; set; }
    public SpiceLevel SpiceLevel { get; set; } = SpiceLevel.Mild;
    public bool IsBestseller { get; set; }
    public bool IsActive { get; set; } = true;
    public double Rating { get; set; } = 4.5;
    public int ReviewCount { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string[] GalleryUrls { get; set; } = Array.Empty<string>();
    public int ViewCount { get; set; }

    public Category Category { get; set; } = null!;
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public ICollection<ProductView> ProductViews { get; set; } = new List<ProductView>();
}
