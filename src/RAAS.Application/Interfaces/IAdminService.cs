using RAAS.Application.DTOs.Admin;
using RAAS.Application.DTOs.Users;

namespace RAAS.Application.Interfaces;

public interface IAdminService
{
    Task<IEnumerable<AdminUserDto>> GetCustomersAsync();
    Task<CouponDto> CreateCouponAsync(CreateCouponRequest request);
    Task<IEnumerable<CouponDto>> GetCouponsAsync();
    Task<bool> DeactivateCouponAsync(Guid id);
}

public interface ISpecialOfferService
{
    Task<IEnumerable<SpecialOfferDto>> GetActiveOffersAsync();
    Task<IEnumerable<SpecialOfferDto>> GetAllOffersAsync();
    Task<SpecialOfferDto> CreateOfferAsync(CreateSpecialOfferRequest request);
    Task<SpecialOfferDto?> UpdateOfferAsync(Guid id, UpdateSpecialOfferRequest request);
    Task<bool> DeleteOfferAsync(Guid id);
}

public interface IStoreSettingsService
{
    Task<StoreSettingsDto> GetSettingsAsync();
    Task<StoreSettingsDto> UpdateSettingsAsync(UpdateStoreSettingsRequest request);
}

public interface IUserService
{
    Task<UserProfileDto?> GetProfileAsync(Guid userId);
    Task<AddressDto> AddAddressAsync(Guid userId, CreateAddressRequest request);
}
