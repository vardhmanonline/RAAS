namespace RAAS.Infrastructure.Email;

internal static class EmailTemplates
{
    private const string BrandColor = "#7B1E1E";
    private const string AccentColor = "#F57C00";
    private const string CreamBg = "#FAF3E0";

    public static string Wrap(string title, string body) => $@"
<!DOCTYPE html>
<html>
<head><meta charset=""utf-8""><meta name=""viewport"" content=""width=device-width""></head>
<body style=""margin:0;padding:0;background:{CreamBg};font-family:Inter,Arial,sans-serif;"">
  <table width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""background:{CreamBg};padding:32px 16px;"">
    <tr><td align=""center"">
      <table width=""600"" cellpadding=""0"" cellspacing=""0"" style=""background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(123,30,30,0.1);"">
        <tr><td style=""background:{BrandColor};padding:24px 32px;text-align:center;"">
          <h1 style=""margin:0;color:#fff;font-size:24px;"">🪷 RAAS</h1>
          <p style=""margin:8px 0 0;color:#D4A017;font-style:italic;font-size:14px;"">Taste the Roots of Rajasthan</p>
        </td></tr>
        <tr><td style=""padding:32px;"">
          <h2 style=""margin:0 0 16px;color:{BrandColor};font-size:20px;"">{title}</h2>
          {body}
        </td></tr>
        <tr><td style=""background:#f5f5f5;padding:16px 32px;text-align:center;font-size:12px;color:#666;"">
          © RAAS · Authentic Rajasthani Food · <a href=""mailto:support@raas.in"" style=""color:{AccentColor};"">support@raas.in</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>";

    public static string Welcome(string name) => Wrap("Namaste! Welcome to RAAS",
        $@"<p style=""color:#333;line-height:1.7;"">Dear <strong>{name}</strong>,</p>
        <p style=""color:#333;line-height:1.7;"">Welcome to RAAS! We're thrilled to bring authentic Rajasthani pickles, papads, masalas and chutneys to your doorstep.</p>
        <p style=""background:{CreamBg};padding:16px;border-radius:8px;text-align:center;margin:24px 0;"">
          Use code <strong style=""color:{BrandColor};font-size:18px;"">WELCOME10</strong> for 10% off your first order!
        </p>
        <p style=""text-align:center;""><a href=""https://raas.in/products"" style=""background:{BrandColor};color:#fff;padding:12px 32px;border-radius:50px;text-decoration:none;font-weight:bold;"">Start Shopping</a></p>");

    public static string OrderConfirmation(string name, string orderNumber, decimal total) => Wrap($"Order Confirmed — {orderNumber}",
        $@"<p style=""color:#333;line-height:1.7;"">Thank you, <strong>{name}</strong>!</p>
        <p style=""color:#333;line-height:1.7;"">Your order has been placed successfully.</p>
        <table width=""100%"" style=""background:{CreamBg};border-radius:8px;padding:16px;margin:16px 0;"">
          <tr><td><strong>Order #</strong></td><td align=""right"">{orderNumber}</td></tr>
          <tr><td><strong>Total</strong></td><td align=""right"" style=""color:{BrandColor};font-size:18px;font-weight:bold;"">₹{total:F2}</td></tr>
        </table>
        <p style=""color:#666;font-size:14px;"">We'll notify you when your order ships. Track it anytime in your RAAS account.</p>");

    public static string OrderShipped(string name, string orderNumber) => Wrap("Your order is on its way! 🚚",
        $@"<p style=""color:#333;line-height:1.7;"">Great news, <strong>{name}</strong>!</p>
        <p style=""color:#333;line-height:1.7;"">Order <strong>{orderNumber}</strong> has been packed and shipped. Your Rajasthani delicacies are heading to you!</p>
        <p style=""text-align:center;""><a href=""https://raas.in/orders"" style=""background:{AccentColor};color:#fff;padding:12px 32px;border-radius:50px;text-decoration:none;font-weight:bold;"">Track Order</a></p>");

    public static string OrderDelivered(string name, string orderNumber, string referralCode) => Wrap("Delivered! Enjoy your feast 🎉",
        $@"<p style=""color:#333;line-height:1.7;"">Hi <strong>{name}</strong>,</p>
        <p style=""color:#333;line-height:1.7;"">Order <strong>{orderNumber}</strong> has been delivered. We hope you love every bite!</p>
        <p style=""background:{CreamBg};padding:16px;border-radius:8px;margin:24px 0;"">
          <strong>Share RAAS & earn ₹50!</strong><br>
          Your referral code: <strong style=""color:{BrandColor};font-size:20px;"">{referralCode}</strong>
        </p>
        <p style=""text-align:center;""><a href=""https://raas.in/referrals"" style=""background:{BrandColor};color:#fff;padding:12px 32px;border-radius:50px;text-decoration:none;font-weight:bold;"">Share & Earn</a></p>");

    public static string LowStock(string productName, int stock) => Wrap($"⚠️ Low Stock: {productName}",
        $@"<p style=""color:#333;line-height:1.7;"">Product <strong>{productName}</strong> has only <strong style=""color:{AccentColor};"">{stock}</strong> units remaining.</p>
        <p style=""color:#666;"">Please restock soon to avoid out-of-stock on the storefront.</p>");

    public static string AdminNewOrder(string orderNumber, decimal total, string customerName) => Wrap($"🛒 New Order: {orderNumber}",
        $@"<p style=""color:#333;line-height:1.7;"">A new order has been placed.</p>
        <table width=""100%"" style=""background:{CreamBg};border-radius:8px;padding:16px;margin:16px 0;"">
          <tr><td><strong>Customer</strong></td><td align=""right"">{customerName}</td></tr>
          <tr><td><strong>Order #</strong></td><td align=""right"">{orderNumber}</td></tr>
          <tr><td><strong>Total</strong></td><td align=""right"" style=""color:{BrandColor};font-weight:bold;"">₹{total:F2}</td></tr>
        </table>
        <p style=""text-align:center;""><a href=""https://raas.in/admin/orders"" style=""background:{BrandColor};color:#fff;padding:12px 32px;border-radius:50px;text-decoration:none;font-weight:bold;"">View in Admin</a></p>");
}
