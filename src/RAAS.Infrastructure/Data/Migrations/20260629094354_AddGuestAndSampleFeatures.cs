using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RAAS.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddGuestAndSampleFeatures : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Add new columns to Orders
            migrationBuilder.AddColumn<bool>(name: "IsGuestOrder", table: "Orders", type: "boolean", nullable: false, defaultValue: false);
            migrationBuilder.AddColumn<bool>(name: "IsSampleOrder", table: "Orders", type: "boolean", nullable: false, defaultValue: false);
            migrationBuilder.AddColumn<string>(name: "GuestEmail", table: "Orders", type: "text", nullable: true);

            // Add new columns to Users
            migrationBuilder.AddColumn<bool>(name: "HasClaimedSample", table: "Users", type: "boolean", nullable: false, defaultValue: false);
            migrationBuilder.AddColumn<bool>(name: "IsGuest", table: "Users", type: "boolean", nullable: false, defaultValue: false);
            migrationBuilder.AddColumn<string>(name: "GuestEmail", table: "Users", type: "text", nullable: true);

            // Create StoreSettings table
            migrationBuilder.CreateTable(
                name: "StoreSettings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Key = table.Column<string>(type: "text", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table => table.PrimaryKey("PK_StoreSettings", x => x.Id));

            migrationBuilder.CreateIndex(name: "IX_StoreSettings_Key", table: "StoreSettings", column: "Key", unique: true);

            // Update seed timestamps
            migrationBuilder.UpdateData(table: "Categories", keyColumn: "Id", keyValue: new Guid("11111111-1111-1111-1111-111111111101"), columns: new[] { "CreatedAt", "UpdatedAt" }, values: new object[] { new DateTime(2026, 6, 29, 9, 43, 53, 806, DateTimeKind.Utc).AddTicks(2799), new DateTime(2026, 6, 29, 9, 43, 53, 806, DateTimeKind.Utc).AddTicks(2802) });
            migrationBuilder.UpdateData(table: "Categories", keyColumn: "Id", keyValue: new Guid("11111111-1111-1111-1111-111111111102"), columns: new[] { "CreatedAt", "UpdatedAt" }, values: new object[] { new DateTime(2026, 6, 29, 9, 43, 53, 806, DateTimeKind.Utc).AddTicks(2808), new DateTime(2026, 6, 29, 9, 43, 53, 806, DateTimeKind.Utc).AddTicks(2808) });
            migrationBuilder.UpdateData(table: "Categories", keyColumn: "Id", keyValue: new Guid("11111111-1111-1111-1111-111111111103"), columns: new[] { "CreatedAt", "UpdatedAt" }, values: new object[] { new DateTime(2026, 6, 29, 9, 43, 53, 806, DateTimeKind.Utc).AddTicks(2821), new DateTime(2026, 6, 29, 9, 43, 53, 806, DateTimeKind.Utc).AddTicks(2821) });
            migrationBuilder.UpdateData(table: "Categories", keyColumn: "Id", keyValue: new Guid("11111111-1111-1111-1111-111111111104"), columns: new[] { "CreatedAt", "UpdatedAt" }, values: new object[] { new DateTime(2026, 6, 29, 9, 43, 53, 806, DateTimeKind.Utc).AddTicks(2823), new DateTime(2026, 6, 29, 9, 43, 53, 806, DateTimeKind.Utc).AddTicks(2823) });
            migrationBuilder.UpdateData(table: "Categories", keyColumn: "Id", keyValue: new Guid("11111111-1111-1111-1111-111111111105"), columns: new[] { "CreatedAt", "UpdatedAt" }, values: new object[] { new DateTime(2026, 6, 29, 9, 43, 53, 806, DateTimeKind.Utc).AddTicks(2825), new DateTime(2026, 6, 29, 9, 43, 53, 806, DateTimeKind.Utc).AddTicks(2825) });
            migrationBuilder.UpdateData(table: "Coupons", keyColumn: "Id", keyValue: new Guid("44444444-4444-4444-4444-444444444401"), columns: new[] { "CreatedAt", "UpdatedAt" }, values: new object[] { new DateTime(2026, 6, 29, 9, 43, 53, 806, DateTimeKind.Utc).AddTicks(3041), new DateTime(2026, 6, 29, 9, 43, 53, 806, DateTimeKind.Utc).AddTicks(3042) });
            migrationBuilder.UpdateData(table: "Products", keyColumn: "Id", keyValue: new Guid("33333333-3333-3333-3333-333333333301"), columns: new[] { "CreatedAt", "UpdatedAt" }, values: new object[] { new DateTime(2026, 6, 29, 9, 43, 53, 806, DateTimeKind.Utc).AddTicks(2999), new DateTime(2026, 6, 29, 9, 43, 53, 806, DateTimeKind.Utc).AddTicks(2999) });
            migrationBuilder.UpdateData(table: "Products", keyColumn: "Id", keyValue: new Guid("33333333-3333-3333-3333-333333333302"), columns: new[] { "CreatedAt", "UpdatedAt" }, values: new object[] { new DateTime(2026, 6, 29, 9, 43, 53, 806, DateTimeKind.Utc).AddTicks(3013), new DateTime(2026, 6, 29, 9, 43, 53, 806, DateTimeKind.Utc).AddTicks(3013) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "IsSampleOrder",
                table: "Orders",
                type: "boolean",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "boolean");

            migrationBuilder.AlterColumn<bool>(
                name: "IsGuestOrder",
                table: "Orders",
                type: "boolean",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "boolean");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111101"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 28, 8, 4, 43, 200, DateTimeKind.Utc).AddTicks(9684), new DateTime(2026, 6, 28, 8, 4, 43, 200, DateTimeKind.Utc).AddTicks(9690) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111102"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 28, 8, 4, 43, 200, DateTimeKind.Utc).AddTicks(9705), new DateTime(2026, 6, 28, 8, 4, 43, 200, DateTimeKind.Utc).AddTicks(9706) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111103"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 28, 8, 4, 43, 200, DateTimeKind.Utc).AddTicks(9713), new DateTime(2026, 6, 28, 8, 4, 43, 200, DateTimeKind.Utc).AddTicks(9714) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111104"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 28, 8, 4, 43, 200, DateTimeKind.Utc).AddTicks(9719), new DateTime(2026, 6, 28, 8, 4, 43, 200, DateTimeKind.Utc).AddTicks(9720) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111105"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 28, 8, 4, 43, 200, DateTimeKind.Utc).AddTicks(9726), new DateTime(2026, 6, 28, 8, 4, 43, 200, DateTimeKind.Utc).AddTicks(9726) });

            migrationBuilder.UpdateData(
                table: "Coupons",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444401"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 28, 8, 4, 43, 201, DateTimeKind.Utc).AddTicks(430), new DateTime(2026, 6, 28, 8, 4, 43, 201, DateTimeKind.Utc).AddTicks(431) });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333301"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 28, 8, 4, 43, 201, DateTimeKind.Utc).AddTicks(301), new DateTime(2026, 6, 28, 8, 4, 43, 201, DateTimeKind.Utc).AddTicks(302) });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333302"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 28, 8, 4, 43, 201, DateTimeKind.Utc).AddTicks(359), new DateTime(2026, 6, 28, 8, 4, 43, 201, DateTimeKind.Utc).AddTicks(360) });
        }
    }
}
