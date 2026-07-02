using Microsoft.EntityFrameworkCore;
using RAAS.Domain.Entities;

namespace RAAS.Infrastructure.Data;

public class RaasDbContext : DbContext
{
    public RaasDbContext(DbContextOptions<RaasDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Address> Addresses => Set<Address>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Coupon> Coupons => Set<Coupon>();
    public DbSet<Referral> Referrals => Set<Referral>();
    public DbSet<Event> Events => Set<Event>();
    public DbSet<ProductView> ProductViews => Set<ProductView>();
    public DbSet<StoreSettings> StoreSettings => Set<StoreSettings>();
    public DbSet<SpecialOffer> SpecialOffers => Set<SpecialOffer>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
            e.HasIndex(u => u.ReferralCode).IsUnique();
            e.Property(u => u.ReferralEarnings).HasPrecision(10, 2);
            e.Property(u => u.HasClaimedSample).HasDefaultValue(false);
            e.Property(u => u.IsGuest).HasDefaultValue(false);
            e.HasOne(u => u.ReferredBy).WithMany(u => u.Referrals).HasForeignKey(u => u.ReferredByUserId).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Referral>(e =>
        {
            e.Property(r => r.RewardAmount).HasPrecision(10, 2);
            e.HasOne(r => r.Referrer).WithMany(u => u.ReferralRecords).HasForeignKey(r => r.ReferrerId).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(r => r.ReferredUser).WithMany().HasForeignKey(r => r.ReferredUserId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Product>(e =>
        {
            e.HasIndex(p => p.Slug).IsUnique();
            e.Property(p => p.Price).HasPrecision(10, 2);
            e.Property(p => p.CompareAtPrice).HasPrecision(10, 2);
            e.Property(p => p.GalleryUrls).HasColumnType("text[]");
        });

        modelBuilder.Entity<Category>(e => e.HasIndex(c => c.Slug).IsUnique());

        modelBuilder.Entity<Order>(e =>
        {
            e.HasIndex(o => o.OrderNumber).IsUnique();
            e.Property(o => o.Subtotal).HasPrecision(10, 2);
            e.Property(o => o.DeliveryCharge).HasPrecision(10, 2);
            e.Property(o => o.Discount).HasPrecision(10, 2);
            e.Property(o => o.Total).HasPrecision(10, 2);
        });

        modelBuilder.Entity<OrderItem>(e =>
        {
            e.Property(i => i.UnitPrice).HasPrecision(10, 2);
            e.Property(i => i.TotalPrice).HasPrecision(10, 2);
        });

        modelBuilder.Entity<Coupon>(e =>
        {
            e.HasIndex(c => c.Code).IsUnique();
            e.Property(c => c.DiscountPercent).HasPrecision(5, 2);
            e.Property(c => c.MaxDiscountAmount).HasPrecision(10, 2);
            e.Property(c => c.MinOrderAmount).HasPrecision(10, 2);
        });

        modelBuilder.Entity<StoreSettings>(e => e.HasIndex(s => s.Key).IsUnique());

        SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        var pickleCatId = Guid.Parse("11111111-1111-1111-1111-111111111101");
        var papadCatId = Guid.Parse("11111111-1111-1111-1111-111111111102");
        var masalaCatId = Guid.Parse("11111111-1111-1111-1111-111111111103");
        var chutneyCatId = Guid.Parse("11111111-1111-1111-1111-111111111104");
        var comboCatId = Guid.Parse("11111111-1111-1111-1111-111111111105");
        var product1Id = Guid.Parse("33333333-3333-3333-3333-333333333301");
        var product2Id = Guid.Parse("33333333-3333-3333-3333-333333333302");

        modelBuilder.Entity<Category>().HasData(
            new Category { Id = pickleCatId, Name = "Pickles", Slug = "pickles", Description = "Traditional Rajasthani achar", DisplayOrder = 1 },
            new Category { Id = papadCatId, Name = "Papad", Slug = "papad", Description = "Crispy handmade papads", DisplayOrder = 2 },
            new Category { Id = masalaCatId, Name = "Masalas", Slug = "masalas", Description = "Authentic spice blends", DisplayOrder = 3 },
            new Category { Id = chutneyCatId, Name = "Chutneys", Slug = "chutneys", Description = "Tangy homemade chutneys", DisplayOrder = 4 },
            new Category { Id = comboCatId, Name = "Combos", Slug = "combos", Description = "Curated gift packs", DisplayOrder = 5 }
        );

        modelBuilder.Entity<Product>().HasData(
            new Product
            {
                Id = product1Id,
                CategoryId = pickleCatId,
                Name = "Rajasthani Mango Pickle",
                Slug = "rajasthani-mango-pickle",
                Description = "Sun-dried raw mangoes in mustard oil with traditional spices",
                Story = "From the kitchens of Jodhpur, this pickle carries generations of family recipes.",
                HealthBenefits = "Rich in probiotics, aids digestion, boosts immunity.",
                UsageSuggestions = "Perfect with dal-rice, parathas, or Rajasthani thali.",
                Ingredients = "Raw mango, mustard oil, fenugreek, fennel, red chili, turmeric, salt",
                Price = 249,
                CompareAtPrice = 299,
                Stock = 150,
                SpiceLevel = Domain.Enums.SpiceLevel.Spicy,
                IsBestseller = true,
                ImageUrl = "https://images.unsplash.com/photo-1609501676725-7186f017a9fe?w=800",
                GalleryUrls = new[] { "https://images.unsplash.com/photo-1609501676725-7186f017a9fe?w=800" }
            },
            new Product
            {
                Id = product2Id,
                CategoryId = papadCatId,
                Name = "Masala Papad",
                Slug = "masala-papad",
                Description = "Crispy urad dal papad with black pepper and cumin",
                Story = "Hand-rolled under the desert sun of Bikaner.",
                HealthBenefits = "High protein, low fat snack. Cumin aids digestion.",
                UsageSuggestions = "Roast over flame or microwave.",
                Ingredients = "Urad dal, black pepper, cumin, salt",
                Price = 89,
                Stock = 200,
                SpiceLevel = Domain.Enums.SpiceLevel.Mild,
                IsBestseller = true,
                ImageUrl = "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800"
            }
        );

        modelBuilder.Entity<Coupon>().HasData(new Coupon
        {
            Id = Guid.Parse("44444444-4444-4444-4444-444444444401"),
            Code = "WELCOME10",
            Description = "10% off on first order",
            DiscountPercent = 10,
            MaxDiscountAmount = 100,
            MinOrderAmount = 299,
            ValidFrom = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            ValidUntil = new DateTime(2027, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            UsageLimit = 1000
        });
    }
}
