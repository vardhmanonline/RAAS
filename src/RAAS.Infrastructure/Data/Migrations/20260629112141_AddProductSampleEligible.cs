using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RAAS.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddProductSampleEligible : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsSampleEligible",
                table: "Products",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111101"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 29, 11, 21, 40, 984, DateTimeKind.Utc).AddTicks(9937), new DateTime(2026, 6, 29, 11, 21, 40, 984, DateTimeKind.Utc).AddTicks(9939) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111102"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 29, 11, 21, 40, 984, DateTimeKind.Utc).AddTicks(9946), new DateTime(2026, 6, 29, 11, 21, 40, 984, DateTimeKind.Utc).AddTicks(9946) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111103"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 29, 11, 21, 40, 984, DateTimeKind.Utc).AddTicks(9948), new DateTime(2026, 6, 29, 11, 21, 40, 984, DateTimeKind.Utc).AddTicks(9949) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111104"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 29, 11, 21, 40, 984, DateTimeKind.Utc).AddTicks(9964), new DateTime(2026, 6, 29, 11, 21, 40, 984, DateTimeKind.Utc).AddTicks(9964) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111105"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 29, 11, 21, 40, 984, DateTimeKind.Utc).AddTicks(9966), new DateTime(2026, 6, 29, 11, 21, 40, 984, DateTimeKind.Utc).AddTicks(9966) });

            migrationBuilder.UpdateData(
                table: "Coupons",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444401"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 29, 11, 21, 40, 985, DateTimeKind.Utc).AddTicks(244), new DateTime(2026, 6, 29, 11, 21, 40, 985, DateTimeKind.Utc).AddTicks(245) });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333301"),
                columns: new[] { "CreatedAt", "IsSampleEligible", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 29, 11, 21, 40, 985, DateTimeKind.Utc).AddTicks(197), false, new DateTime(2026, 6, 29, 11, 21, 40, 985, DateTimeKind.Utc).AddTicks(198) });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333302"),
                columns: new[] { "CreatedAt", "IsSampleEligible", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 29, 11, 21, 40, 985, DateTimeKind.Utc).AddTicks(213), false, new DateTime(2026, 6, 29, 11, 21, 40, 985, DateTimeKind.Utc).AddTicks(213) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsSampleEligible",
                table: "Products");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111101"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 29, 9, 43, 53, 806, DateTimeKind.Utc).AddTicks(2799), new DateTime(2026, 6, 29, 9, 43, 53, 806, DateTimeKind.Utc).AddTicks(2802) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111102"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 29, 9, 43, 53, 806, DateTimeKind.Utc).AddTicks(2808), new DateTime(2026, 6, 29, 9, 43, 53, 806, DateTimeKind.Utc).AddTicks(2808) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111103"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 29, 9, 43, 53, 806, DateTimeKind.Utc).AddTicks(2821), new DateTime(2026, 6, 29, 9, 43, 53, 806, DateTimeKind.Utc).AddTicks(2821) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111104"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 29, 9, 43, 53, 806, DateTimeKind.Utc).AddTicks(2823), new DateTime(2026, 6, 29, 9, 43, 53, 806, DateTimeKind.Utc).AddTicks(2823) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111105"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 29, 9, 43, 53, 806, DateTimeKind.Utc).AddTicks(2825), new DateTime(2026, 6, 29, 9, 43, 53, 806, DateTimeKind.Utc).AddTicks(2825) });

            migrationBuilder.UpdateData(
                table: "Coupons",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444401"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 29, 9, 43, 53, 806, DateTimeKind.Utc).AddTicks(3041), new DateTime(2026, 6, 29, 9, 43, 53, 806, DateTimeKind.Utc).AddTicks(3042) });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333301"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 29, 9, 43, 53, 806, DateTimeKind.Utc).AddTicks(2999), new DateTime(2026, 6, 29, 9, 43, 53, 806, DateTimeKind.Utc).AddTicks(2999) });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333302"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 29, 9, 43, 53, 806, DateTimeKind.Utc).AddTicks(3013), new DateTime(2026, 6, 29, 9, 43, 53, 806, DateTimeKind.Utc).AddTicks(3013) });
        }
    }
}
