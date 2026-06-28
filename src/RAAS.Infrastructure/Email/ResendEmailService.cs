using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using RAAS.Application.Interfaces;

namespace RAAS.Infrastructure.Email;

public class ResendEmailService : IEmailService
{
    private readonly HttpClient _http;
    private readonly IConfiguration _config;
    private readonly ILogger<ResendEmailService> _logger;
    private readonly bool _enabled;

    public ResendEmailService(HttpClient http, IConfiguration config, ILogger<ResendEmailService> logger)
    {
        _http = http;
        _config = config;
        _logger = logger;
        _enabled = config.GetValue("Resend:Enabled", true);

        var apiKey = config["Resend:ApiKey"];
        if (!string.IsNullOrEmpty(apiKey))
            _http.DefaultRequestHeaders.TryAddWithoutValidation("Authorization", $"Bearer {apiKey}");
    }

    public Task SendWelcomeEmailAsync(string to, string name) =>
        SendAsync(to, "Welcome to RAAS — Taste the Roots of Rajasthan", EmailTemplates.Welcome(name), "UserRegistered");

    public Task SendOrderConfirmationAsync(string to, string name, string orderNumber, decimal total) =>
        SendAsync(to, $"Order Confirmed — {orderNumber}", EmailTemplates.OrderConfirmation(name, orderNumber, total), "OrderPlaced");

    public Task SendOrderShippedAsync(string to, string name, string orderNumber) =>
        SendAsync(to, $"Your order {orderNumber} has shipped!", EmailTemplates.OrderShipped(name, orderNumber), "OrderShipped");

    public Task SendOrderDeliveredAsync(string to, string name, string orderNumber, string referralCode) =>
        SendAsync(to, "Delivered! Share RAAS & earn ₹50", EmailTemplates.OrderDelivered(name, orderNumber, referralCode), "OrderDelivered");

    public Task SendLowStockAlertAsync(string productName, int stock) =>
        SendAsync(
            _config["Resend:AdminEmail"] ?? "admin@raas.in",
            $"Low Stock Alert: {productName}",
            EmailTemplates.LowStock(productName, stock),
            "LowStock");

    public Task SendAdminOrderAlertAsync(string orderNumber, decimal total, string customerName) =>
        SendAsync(
            _config["Resend:AdminEmail"] ?? "admin@raas.in",
            $"New Order: {orderNumber}",
            EmailTemplates.AdminNewOrder(orderNumber, total, customerName),
            "AdminOrderAlert");

    private async Task SendAsync(string to, string subject, string html, string eventType)
    {
        if (!_enabled)
        {
            _logger.LogInformation("Email disabled. Skipped {Event} to {To}", eventType, to);
            return;
        }

        var apiKey = _config["Resend:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            _logger.LogWarning("Resend API key not set. Email [{Event}] to {To}: {Subject} (dev mode — not sent)", eventType, to, subject);
            return;
        }

        var from = _config["Resend:FromEmail"] ?? "RAAS <onboarding@resend.dev>";

        try
        {
            var payload = new { from, to = new[] { to }, subject, html };
            var response = await _http.PostAsync(
                "https://api.resend.com/emails",
                new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json"));

            var body = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
                _logger.LogInformation("Email sent [{Event}] to {To}", eventType, to);
            else
                _logger.LogError("Resend failed [{Event}] to {To}: {Status} — {Body}", eventType, to, response.StatusCode, body);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Email exception [{Event}] to {To}", eventType, to);
        }
    }
}
