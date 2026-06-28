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
