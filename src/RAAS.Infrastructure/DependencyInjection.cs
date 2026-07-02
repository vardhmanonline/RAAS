using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using RAAS.Application.Interfaces;
using RAAS.Application.Services;
using RAAS.Infrastructure.Data;
using RAAS.Infrastructure.Email;
using RAAS.Infrastructure.Repositories;

namespace RAAS.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<RaasDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IProductService, ProductService>();
        services.AddScoped<IOrderService, OrderService>();
        services.AddScoped<IAnalyticsService, AnalyticsService>();
        services.AddScoped<IReferralService, ReferralService>();
        services.AddScoped<IAdminService, AdminService>();
        services.AddScoped<IInvestorCrmService, InvestorCrmService>();
        services.AddScoped<IStoreSettingsService, StoreSettingsService>();
        services.AddScoped<IUserService, UserService>();
        services.AddHttpClient<IEmailService, ResendEmailService>();

        return services;
    }
}
