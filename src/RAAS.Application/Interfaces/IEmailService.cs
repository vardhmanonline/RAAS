namespace RAAS.Application.Interfaces;

public interface IEmailService
{
    Task SendWelcomeEmailAsync(string to, string name);
    Task SendOrderConfirmationAsync(string to, string name, string orderNumber, decimal total);
    Task SendOrderShippedAsync(string to, string name, string orderNumber);
    Task SendOrderDeliveredAsync(string to, string name, string orderNumber, string referralCode);
    Task SendLowStockAlertAsync(string productName, int stock);
    Task SendAdminOrderAlertAsync(string orderNumber, decimal total, string customerName);
    Task SendGuestOrderConfirmationAsync(string to, string orderNumber, decimal total);
    Task SendSampleOrderConfirmationAsync(string to, string name, string orderNumber);
}
