using Microsoft.EntityFrameworkCore;
using RAAS.Domain.Entities;
using RAAS.Domain.Enums;

namespace RAAS.Infrastructure.Data;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(RaasDbContext db)
    {
        await db.Database.MigrateAsync();

        if (!await db.Users.AnyAsync(u => u.Email == "admin@raas.in"))
        {
            await db.Users.AddAsync(new User
            {
                Email = "admin@raas.in",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                FullName = "RAAS Admin",
                Role = UserRole.Admin,
                ReferralCode = "RAASADMIN"
            });
            await db.SaveChangesAsync();
        }
        else
        {
            var admin = await db.Users.FirstAsync(u => u.Email == "admin@raas.in");
            if (!BCrypt.Net.BCrypt.Verify("Admin@123", admin.PasswordHash))
            {
                admin.PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123");
                await db.SaveChangesAsync();
            }
        }
    }
}
