using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace RAAS.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddInvestorCrmScaffold : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Phone",
                table: "Users",
                type: "character varying(10)",
                maxLength: 10,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "FullName",
                table: "Users",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Users",
                type: "character varying(256)",
                maxLength: 256,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "ShippingState",
                table: "Orders",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "ShippingPhone",
                table: "Orders",
                type: "character varying(10)",
                maxLength: 10,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "ShippingName",
                table: "Orders",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "ShippingCity",
                table: "Orders",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "ShippingAddress",
                table: "Orders",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "State",
                table: "Addresses",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Line2",
                table: "Addresses",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Line1",
                table: "Addresses",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Label",
                table: "Addresses",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "City",
                table: "Addresses",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.CreateTable(
                name: "InvestorAccounts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AccountCode = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    FullName = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Phone = table.Column<string>(type: "character varying(15)", maxLength: 15, nullable: true),
                    PanNumber = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    KycCompleted = table.Column<bool>(type: "boolean", nullable: false),
                    TotalCommittedCapital = table.Column<decimal>(type: "numeric(14,2)", precision: 14, scale: 2, nullable: false),
                    PricingTierCode = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvestorAccounts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LandDeals",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    DealCode = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    Title = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    Location = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    AreaInAcres = table.Column<decimal>(type: "numeric(14,2)", precision: 14, scale: 2, nullable: false),
                    AcquisitionCost = table.Column<decimal>(type: "numeric(14,2)", precision: 14, scale: 2, nullable: false),
                    ExpectedRevenue = table.Column<decimal>(type: "numeric(14,2)", precision: 14, scale: 2, nullable: false),
                    RegistrationCompleted = table.Column<bool>(type: "boolean", nullable: false),
                    RegisteredOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LandDeals", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PricingPlans",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Name = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    MonthlyPrice = table.Column<decimal>(type: "numeric(14,2)", precision: 14, scale: 2, nullable: false),
                    IncludesBasicCrm = table.Column<bool>(type: "boolean", nullable: false),
                    IncludesAdvancedTracking = table.Column<bool>(type: "boolean", nullable: false),
                    IncludesComplianceDashboard = table.Column<bool>(type: "boolean", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PricingPlans", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ComplianceCases",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    InvestorAccountId = table.Column<Guid>(type: "uuid", nullable: true),
                    LandDealId = table.Column<Guid>(type: "uuid", nullable: true),
                    AlertType = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    Severity = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    DueDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ComplianceCases", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ComplianceCases_InvestorAccounts_InvestorAccountId",
                        column: x => x.InvestorAccountId,
                        principalTable: "InvestorAccounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_ComplianceCases_LandDeals_LandDealId",
                        column: x => x.LandDealId,
                        principalTable: "LandDeals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "InvestmentFlows",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    InvestorAccountId = table.Column<Guid>(type: "uuid", nullable: false),
                    LandDealId = table.Column<Guid>(type: "uuid", nullable: false),
                    FundSource = table.Column<int>(type: "integer", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric(14,2)", precision: 14, scale: 2, nullable: false),
                    FlowDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvestmentFlows", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InvestmentFlows_InvestorAccounts_InvestorAccountId",
                        column: x => x.InvestorAccountId,
                        principalTable: "InvestorAccounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_InvestmentFlows_LandDeals_LandDealId",
                        column: x => x.LandDealId,
                        principalTable: "LandDeals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "InvestorPayouts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    InvestorAccountId = table.Column<Guid>(type: "uuid", nullable: false),
                    LandDealId = table.Column<Guid>(type: "uuid", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric(14,2)", precision: 14, scale: 2, nullable: false),
                    PaidOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvestorPayouts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InvestorPayouts_InvestorAccounts_InvestorAccountId",
                        column: x => x.InvestorAccountId,
                        principalTable: "InvestorAccounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_InvestorPayouts_LandDeals_LandDealId",
                        column: x => x.LandDealId,
                        principalTable: "LandDeals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111101"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 7, 2, 4, 22, 43, 644, DateTimeKind.Utc).AddTicks(3234), new DateTime(2026, 7, 2, 4, 22, 43, 644, DateTimeKind.Utc).AddTicks(3234) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111102"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 7, 2, 4, 22, 43, 644, DateTimeKind.Utc).AddTicks(3249), new DateTime(2026, 7, 2, 4, 22, 43, 644, DateTimeKind.Utc).AddTicks(3250) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111103"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 7, 2, 4, 22, 43, 644, DateTimeKind.Utc).AddTicks(3259), new DateTime(2026, 7, 2, 4, 22, 43, 644, DateTimeKind.Utc).AddTicks(3259) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111104"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 7, 2, 4, 22, 43, 644, DateTimeKind.Utc).AddTicks(3268), new DateTime(2026, 7, 2, 4, 22, 43, 644, DateTimeKind.Utc).AddTicks(3269) });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111105"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 7, 2, 4, 22, 43, 644, DateTimeKind.Utc).AddTicks(3277), new DateTime(2026, 7, 2, 4, 22, 43, 644, DateTimeKind.Utc).AddTicks(3278) });

            migrationBuilder.UpdateData(
                table: "Coupons",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444401"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 7, 2, 4, 22, 43, 644, DateTimeKind.Utc).AddTicks(3594), new DateTime(2026, 7, 2, 4, 22, 43, 644, DateTimeKind.Utc).AddTicks(3595) });

            migrationBuilder.InsertData(
                table: "PricingPlans",
                columns: new[] { "Id", "Code", "CreatedAt", "IncludesAdvancedTracking", "IncludesBasicCrm", "IncludesComplianceDashboard", "IsActive", "MonthlyPrice", "Name", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("55555555-5555-5555-5555-555555555501"), "BASIC_CRM", new DateTime(2026, 7, 2, 4, 22, 43, 644, DateTimeKind.Utc).AddTicks(3527), false, true, false, true, 14999m, "Basic CRM", new DateTime(2026, 7, 2, 4, 22, 43, 644, DateTimeKind.Utc).AddTicks(3528) },
                    { new Guid("55555555-5555-5555-5555-555555555502"), "ADVANCED_INVESTMENT", new DateTime(2026, 7, 2, 4, 22, 43, 644, DateTimeKind.Utc).AddTicks(3543), true, true, false, true, 29999m, "Advanced Investment Tracking", new DateTime(2026, 7, 2, 4, 22, 43, 644, DateTimeKind.Utc).AddTicks(3544) },
                    { new Guid("55555555-5555-5555-5555-555555555503"), "COMPLIANCE_DASHBOARD", new DateTime(2026, 7, 2, 4, 22, 43, 644, DateTimeKind.Utc).AddTicks(3555), true, true, true, true, 44999m, "Compliance Dashboard Suite", new DateTime(2026, 7, 2, 4, 22, 43, 644, DateTimeKind.Utc).AddTicks(3555) }
                });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333301"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 7, 2, 4, 22, 43, 644, DateTimeKind.Utc).AddTicks(3462), new DateTime(2026, 7, 2, 4, 22, 43, 644, DateTimeKind.Utc).AddTicks(3462) });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333302"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 7, 2, 4, 22, 43, 644, DateTimeKind.Utc).AddTicks(3486), new DateTime(2026, 7, 2, 4, 22, 43, 644, DateTimeKind.Utc).AddTicks(3486) });

            migrationBuilder.CreateIndex(
                name: "IX_ComplianceCases_InvestorAccountId",
                table: "ComplianceCases",
                column: "InvestorAccountId");

            migrationBuilder.CreateIndex(
                name: "IX_ComplianceCases_LandDealId",
                table: "ComplianceCases",
                column: "LandDealId");

            migrationBuilder.CreateIndex(
                name: "IX_InvestmentFlows_InvestorAccountId",
                table: "InvestmentFlows",
                column: "InvestorAccountId");

            migrationBuilder.CreateIndex(
                name: "IX_InvestmentFlows_LandDealId",
                table: "InvestmentFlows",
                column: "LandDealId");

            migrationBuilder.CreateIndex(
                name: "IX_InvestorAccounts_AccountCode",
                table: "InvestorAccounts",
                column: "AccountCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_InvestorPayouts_InvestorAccountId",
                table: "InvestorPayouts",
                column: "InvestorAccountId");

            migrationBuilder.CreateIndex(
                name: "IX_InvestorPayouts_LandDealId",
                table: "InvestorPayouts",
                column: "LandDealId");

            migrationBuilder.CreateIndex(
                name: "IX_LandDeals_DealCode",
                table: "LandDeals",
                column: "DealCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PricingPlans_Code",
                table: "PricingPlans",
                column: "Code",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ComplianceCases");

            migrationBuilder.DropTable(
                name: "InvestmentFlows");

            migrationBuilder.DropTable(
                name: "InvestorPayouts");

            migrationBuilder.DropTable(
                name: "PricingPlans");

            migrationBuilder.DropTable(
                name: "InvestorAccounts");

            migrationBuilder.DropTable(
                name: "LandDeals");

            migrationBuilder.AlterColumn<string>(
                name: "Phone",
                table: "Users",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(10)",
                oldMaxLength: 10,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "FullName",
                table: "Users",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Users",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(256)",
                oldMaxLength: 256);

            migrationBuilder.AlterColumn<string>(
                name: "ShippingState",
                table: "Orders",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "ShippingPhone",
                table: "Orders",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(10)",
                oldMaxLength: 10);

            migrationBuilder.AlterColumn<string>(
                name: "ShippingName",
                table: "Orders",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "ShippingCity",
                table: "Orders",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "ShippingAddress",
                table: "Orders",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<string>(
                name: "State",
                table: "Addresses",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "Line2",
                table: "Addresses",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<string>(
                name: "Line1",
                table: "Addresses",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<string>(
                name: "Label",
                table: "Addresses",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<string>(
                name: "City",
                table: "Addresses",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

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
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 29, 11, 21, 40, 985, DateTimeKind.Utc).AddTicks(197), new DateTime(2026, 6, 29, 11, 21, 40, 985, DateTimeKind.Utc).AddTicks(198) });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333302"),
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 29, 11, 21, 40, 985, DateTimeKind.Utc).AddTicks(213), new DateTime(2026, 6, 29, 11, 21, 40, 985, DateTimeKind.Utc).AddTicks(213) });
        }
    }
}
