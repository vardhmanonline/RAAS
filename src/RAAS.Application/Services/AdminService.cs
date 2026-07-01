using RAAS.Application.DTOs.Admin;
using RAAS.Application.DTOs.Users;
using RAAS.Application.Interfaces;
using RAAS.Domain.Entities;
using RAAS.Domain.Enums;

namespace RAAS.Application.Services;

public class AdminService : IAdminService
{
    private readonly IUnitOfWork _uow;

    public AdminService(IUnitOfWork uow) => _uow = uow;

    public async Task<IEnumerable<AdminUserDto>> GetCustomersAsync()
    {
        var users = await _uow.Repository<User>().FindAsync(u => u.Role == UserRole.Customer);
        var orders = await _uow.Repository<Order>().GetAllAsync();

        return users.OrderByDescending(u => u.CreatedAt).Select(u => new AdminUserDto(
            u.Id, u.Email, u.FullName, u.Phone,
            orders.Count(o => o.UserId == u.Id),
            orders.Where(o => o.UserId == u.Id).Sum(o => o.Total),
            u.CreatedAt));
    }

    public async Task<CouponDto> CreateCouponAsync(CreateCouponRequest request)
    {
        var coupon = new Coupon
        {
            Code = request.Code.ToUpper(),
            Description = request.Description,
            DiscountPercent = request.DiscountPercent,
            MaxDiscountAmount = request.MaxDiscountAmount,
            MinOrderAmount = request.MinOrderAmount,
            ValidFrom = request.ValidFrom,
            ValidUntil = request.ValidUntil,
            UsageLimit = request.UsageLimit
        };

        await _uow.Repository<Coupon>().AddAsync(coupon);
        await _uow.SaveChangesAsync();

        return new CouponDto(coupon.Id, coupon.Code, coupon.Description, coupon.DiscountPercent,
            coupon.MinOrderAmount, coupon.ValidUntil, coupon.UsageCount, coupon.UsageLimit, coupon.IsActive);
    }

    public async Task<IEnumerable<CouponDto>> GetCouponsAsync()
    {
        var coupons = await _uow.Repository<Coupon>().GetAllAsync();
        return coupons.Select(c => new CouponDto(c.Id, c.Code, c.Description, c.DiscountPercent,
            c.MinOrderAmount, c.ValidUntil, c.UsageCount, c.UsageLimit, c.IsActive));
    }

    public async Task<bool> DeactivateCouponAsync(Guid id)
    {
        var coupon = await _uow.Repository<Coupon>().GetByIdAsync(id);
        if (coupon == null) return false;
        coupon.IsActive = false;
        coupon.UpdatedAt = DateTime.UtcNow;
        await _uow.Repository<Coupon>().UpdateAsync(coupon);
        await _uow.SaveChangesAsync();
        return true;
    }
}

public class StoreSettingsService : IStoreSettingsService
{
    private const string KeySampleEnabled = "SampleOrderEnabled";
    private const string KeyFreeDelivery = "FreeDeliveryThreshold";
    private const string KeySupportEmail = "SupportEmail";
    private const string KeySupportPhone = "SupportPhone";
    private const string KeyCompanyName = "CompanyName";
    private const string KeyCompanyTagline = "CompanyTagline";
    private const string KeyCompanyDescription = "CompanyDescription";
    private const string KeyLogoUrl = "LogoUrl";
    private const string KeyMainTagline = "MainTagline";
    private const string KeySecondaryTagline = "SecondaryTagline";
    private const string KeyWebsiteUrl = "WebsiteUrl";
    private const string KeyFssaiStatus = "FssaiStatus";
    private const string KeyGstStatus = "GstStatus";
    private const string KeyManufacturingLocation = "ManufacturingLocation";

    private readonly IUnitOfWork _uow;
    public StoreSettingsService(IUnitOfWork uow) => _uow = uow;

    public async Task<StoreSettingsDto> GetSettingsAsync()
    {
        var all = await _uow.Repository<StoreSettings>().GetAllAsync();
        var map = all.ToDictionary(s => s.Key, s => s.Value);
        return new StoreSettingsDto(
            SampleOrderEnabled: map.TryGetValue(KeySampleEnabled, out var se) ? bool.Parse(se) : true,
            FreeDeliveryThreshold: map.TryGetValue(KeyFreeDelivery, out var fd) ? decimal.Parse(fd) : 499m,
            SupportEmail: map.TryGetValue(KeySupportEmail, out var email) ? email : "support.rajasthan@gmail.com",
            SupportPhone: map.TryGetValue(KeySupportPhone, out var phone) ? phone : "+91 84277 67533",
            CompanyName: map.TryGetValue(KeyCompanyName, out var name) ? name : "RAAS",
            CompanyTagline: map.TryGetValue(KeyCompanyTagline, out var tagline) ? tagline : "Taste the Roots of Rajasthan",
            CompanyDescription: map.TryGetValue(KeyCompanyDescription, out var desc) ? desc : "Authentic pickles, papads, masalas & chutneys crafted with love from Rajasthani kitchens.",
            LogoUrl: map.TryGetValue(KeyLogoUrl, out var logo) ? logo : "",
            MainTagline: map.TryGetValue(KeyMainTagline, out var mainTag) ? mainTag : "राजस्थान का स्वाद, हर बाइट में खास!",
            SecondaryTagline: map.TryGetValue(KeySecondaryTagline, out var secTag) ? secTag : "देसी स्वाद, शुद्ध विश्वास",
            WebsiteUrl: map.TryGetValue(KeyWebsiteUrl, out var website) ? website : "rajasthaniras.com",
            FssaiStatus: map.TryGetValue(KeyFssaiStatus, out var fssai) ? fssai : "FSSAI Registered",
            GstStatus: map.TryGetValue(KeyGstStatus, out var gst) ? gst : "GST Registered",
            ManufacturingLocation: map.TryGetValue(KeyManufacturingLocation, out var location) ? location : "Made in India"
        );
    }

    public async Task<StoreSettingsDto> UpdateSettingsAsync(UpdateStoreSettingsRequest request)
    {
        await UpsertAsync(KeySampleEnabled, request.SampleOrderEnabled.ToString(), "Enable or disable free sample orders for new customers");
        await UpsertAsync(KeyFreeDelivery, request.FreeDeliveryThreshold.ToString(), "Minimum order subtotal to waive delivery charge");
        await UpsertAsync(KeySupportEmail, request.SupportEmail, "Customer support email address");
        await UpsertAsync(KeySupportPhone, request.SupportPhone, "Customer support phone number");
        await UpsertAsync(KeyCompanyName, request.CompanyName, "Company name displayed in footer and branding");
        await UpsertAsync(KeyCompanyTagline, request.CompanyTagline, "Company tagline/slogan");
        await UpsertAsync(KeyCompanyDescription, request.CompanyDescription, "Company description for about section");
        await UpsertAsync(KeyLogoUrl, request.LogoUrl, "Company logo URL");
        await UpsertAsync(KeyMainTagline, request.MainTagline, "Main tagline displayed in header and hero");
        await UpsertAsync(KeySecondaryTagline, request.SecondaryTagline, "Secondary tagline for branding");
        await UpsertAsync(KeyWebsiteUrl, request.WebsiteUrl, "Company website URL");
        await UpsertAsync(KeyFssaiStatus, request.FssaiStatus, "FSSAI registration status");
        await UpsertAsync(KeyGstStatus, request.GstStatus, "GST registration status");
        await UpsertAsync(KeyManufacturingLocation, request.ManufacturingLocation, "Manufacturing location/country");
        await _uow.SaveChangesAsync();
        return new StoreSettingsDto(
            request.SampleOrderEnabled, 
            request.FreeDeliveryThreshold,
            request.SupportEmail,
            request.SupportPhone,
            request.CompanyName,
            request.CompanyTagline,
            request.CompanyDescription,
            request.LogoUrl,
            request.MainTagline,
            request.SecondaryTagline,
            request.WebsiteUrl,
            request.FssaiStatus,
            request.GstStatus,
            request.ManufacturingLocation
        );
    }

    private async Task UpsertAsync(string key, string value, string description)
    {
        var repo = _uow.Repository<StoreSettings>();
        var existing = (await repo.FindAsync(s => s.Key == key)).FirstOrDefault();
        if (existing != null)
        {
            existing.Value = value;
            existing.UpdatedAt = DateTime.UtcNow;
            await repo.UpdateAsync(existing);
        }
        else
        {
            await repo.AddAsync(new StoreSettings { Key = key, Value = value, Description = description });
        }
    }
}

public class SpecialOfferService : ISpecialOfferService
{
    private readonly IUnitOfWork _uow;

    public SpecialOfferService(IUnitOfWork uow) => _uow = uow;

    public async Task<IEnumerable<SpecialOfferDto>> GetActiveOffersAsync()
    {
        var now = DateTime.UtcNow;
        var offers = await _uow.Repository<Domain.Entities.SpecialOffer>()
            .FindAsync(o => o.IsActive && 
                (o.ValidFrom == null || o.ValidFrom <= now) && 
                (o.ValidUntil == null || o.ValidUntil >= now));
        
        return offers.OrderBy(o => o.DisplayOrder).Select(MapToDto);
    }

    public async Task<IEnumerable<SpecialOfferDto>> GetAllOffersAsync()
    {
        var offers = await _uow.Repository<Domain.Entities.SpecialOffer>().GetAllAsync();
        return offers.OrderByDescending(o => o.DisplayOrder).Select(MapToDto);
    }

    public async Task<SpecialOfferDto> CreateOfferAsync(CreateSpecialOfferRequest request)
    {
        var offer = new Domain.Entities.SpecialOffer
        {
            Title = request.Title,
            Description = request.Description,
            BadgeText = request.BadgeText,
            ButtonText = request.ButtonText,
            ButtonLink = request.ButtonLink,
            BackgroundColor = request.BackgroundColor,
            TextColor = request.TextColor,
            BadgeColor = request.BadgeColor,
            ButtonColor = request.ButtonColor,
            DisplayOrder = request.DisplayOrder,
            IsActive = request.IsActive,
            ValidFrom = request.ValidFrom,
            ValidUntil = request.ValidUntil
        };

        await _uow.Repository<Domain.Entities.SpecialOffer>().AddAsync(offer);
        await _uow.SaveChangesAsync();

        return MapToDto(offer);
    }

    public async Task<SpecialOfferDto?> UpdateOfferAsync(Guid id, UpdateSpecialOfferRequest request)
    {
        var offer = await _uow.Repository<Domain.Entities.SpecialOffer>().GetByIdAsync(id);
        if (offer == null) return null;

        offer.Title = request.Title;
        offer.Description = request.Description;
        offer.BadgeText = request.BadgeText;
        offer.ButtonText = request.ButtonText;
        offer.ButtonLink = request.ButtonLink;
        offer.BackgroundColor = request.BackgroundColor;
        offer.TextColor = request.TextColor;
        offer.BadgeColor = request.BadgeColor;
        offer.ButtonColor = request.ButtonColor;
        offer.DisplayOrder = request.DisplayOrder;
        offer.IsActive = request.IsActive;
        offer.ValidFrom = request.ValidFrom;
        offer.ValidUntil = request.ValidUntil;
        offer.UpdatedAt = DateTime.UtcNow;

        await _uow.Repository<Domain.Entities.SpecialOffer>().UpdateAsync(offer);
        await _uow.SaveChangesAsync();

        return MapToDto(offer);
    }

    public async Task<bool> DeleteOfferAsync(Guid id)
    {
        var offer = await _uow.Repository<Domain.Entities.SpecialOffer>().GetByIdAsync(id);
        if (offer == null) return false;

        await _uow.Repository<Domain.Entities.SpecialOffer>().DeleteAsync(offer);
        await _uow.SaveChangesAsync();
        return true;
    }

    private static SpecialOfferDto MapToDto(Domain.Entities.SpecialOffer offer) => new(
        offer.Id,
        offer.Title,
        offer.Description,
        offer.BadgeText,
        offer.ButtonText,
        offer.ButtonLink,
        offer.BackgroundColor,
        offer.TextColor,
        offer.BadgeColor,
        offer.ButtonColor,
        offer.DisplayOrder,
        offer.IsActive,
        offer.ValidFrom,
        offer.ValidUntil
    );
}

public class UserService : IUserService
{
    private readonly IUnitOfWork _uow;

    public UserService(IUnitOfWork uow) => _uow = uow;

    public async Task<UserProfileDto?> GetProfileAsync(Guid userId)
    {
        var user = await _uow.Repository<User>().GetByIdAsync(userId);
        if (user == null) return null;

        var addresses = await _uow.Repository<Address>().FindAsync(a => a.UserId == userId);

        return new UserProfileDto(user.Id, user.Email, user.FullName, user.Phone, user.LoyaltyPoints,
            user.ReferralCode,
            addresses.Select(a => new AddressDto(a.Id, a.Label, a.Line1, a.Line2, a.City, a.State, a.Pincode, a.IsDefault)).ToList());
    }

    public async Task<AddressDto> AddAddressAsync(Guid userId, CreateAddressRequest request)
    {
        var context = new System.ComponentModel.DataAnnotations.ValidationContext(request);
        var validationResults = new List<System.ComponentModel.DataAnnotations.ValidationResult>();
        bool isValid = System.ComponentModel.DataAnnotations.Validator.TryValidateObject(request, context, validationResults, true);
        
        if (!isValid)
        {
            var errors = string.Join(", ", validationResults.Select(v => v.ErrorMessage));
            throw new ArgumentException($"Validation failed: {errors}");
        }

        if (request.IsDefault)
        {
            var existing = await _uow.Repository<Address>().FindAsync(a => a.UserId == userId);
            foreach (var addr in existing)
            {
                addr.IsDefault = false;
                await _uow.Repository<Address>().UpdateAsync(addr);
            }
        }

        var address = new Address
        {
            UserId = userId,
            Label = request.Label,
            Line1 = request.Line1,
            Line2 = request.Line2,
            City = request.City,
            State = request.State,
            Pincode = request.Pincode,
            IsDefault = request.IsDefault
        };

        await _uow.Repository<Address>().AddAsync(address);
        await _uow.SaveChangesAsync();

        return new AddressDto(address.Id, address.Label, address.Line1, address.Line2,
            address.City, address.State, address.Pincode, address.IsDefault);
    }
}
