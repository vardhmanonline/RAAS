# Email Configuration Guide

## Overview
The RAAS application uses **Resend** to send transactional emails (order confirmations, shipping notifications, etc.). Emails will NOT be sent unless the Resend API is properly configured.

## Why Emails Aren't Being Sent

If you're not receiving order confirmation emails or admin alerts, it's likely because:

1. **Missing Resend API Key** - The `Resend:ApiKey` is not set in the environment
2. **Invalid From Email** - The sender email must be verified with Resend
3. **Email Service Disabled** - `Resend:Enabled` is set to `false`

## Quick Setup

### Step 1: Get a Resend API Key
1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Add your domain and verify ownership
4. Create an API key from the dashboard

### Step 2: Configure Environment Variables

Create a `.env` file in the repository root:

```bash
# Email Configuration (Resend)
Resend__ApiKey=re_xxxxxxxxxxxxxxxxxxxx
Resend__FromEmail=orders@yourdomain.com
Resend__AdminEmail=admin@yourdomain.com
Resend__Enabled=true
```

### Step 3: Run the Application

The application will automatically read from the `.env` file (development) or environment variables (production).

## Configuration Details

### Local Development
Copy `.env.example` to `.env` and fill in the values:
```bash
cp .env.example .env
# Edit .env with your actual values
```

### Production (Docker/Cloud)
Set environment variables on your hosting platform:
- **Render.com**: Add to Environment variables in dashboard
- **Docker**: Use `-e` flag or environment section in docker-compose
- **Kubernetes**: Use ConfigMap and Secrets

### Configuration Options

| Variable | Example | Required | Notes |
|----------|---------|----------|-------|
| `Resend:ApiKey` | `re_xxxx...` | ✅ Yes | Get from resend.com dashboard |
| `Resend:FromEmail` | `orders@domain.com` | ✅ Yes | Must be verified with Resend |
| `Resend:AdminEmail` | `admin@domain.com` | ✅ Yes | Where admin alerts are sent |
| `Resend:Enabled` | `true` | No | Set to `false` to disable all emails (dev mode) |

## Email Types

The application sends the following emails:

### Customer Emails
- **Welcome Email** - Sent when user registers
- **Order Confirmation** - Sent when order is placed
- **Order Shipped** - Sent when order status changes to "Shipped"
- **Order Delivered** - Sent when order is delivered (includes referral code)

### Admin Emails
- **New Order Alert** - Notifies admin of new orders
- **Low Stock Alert** - Notifies when product stock falls below 10 units

## Troubleshooting

### Emails not being sent?

1. **Check the logs** for messages like:
   ```
   Resend API key not set. Email (dev mode — not sent)
   ```

2. **Verify API key**:
   - Ensure `Resend:ApiKey` is set and valid
   - Check that the key starts with `re_`

3. **Verify From Email**:
   - Must be verified in Resend dashboard
   - Cannot use test domain `onboarding@resend.dev` in production

4. **Check Email Service Status**:
   - Make sure `Resend:Enabled` is `true`
   - Check that Resend API is responding (visit resend.com status)

### Test Email Sending

You can test manually by:
1. Creating an order in the application
2. Checking application logs for success/failure messages
3. Verifying the email address is correct

## Code Implementation

The email service is implemented in:
- **Service**: `src/RAAS.Infrastructure/Email/ResendEmailService.cs`
- **Interface**: `src/RAAS.Application/Interfaces/IEmailService.cs`
- **Templates**: `src/RAAS.Infrastructure/Email/EmailTemplates.cs`

The service is registered in `src/RAAS.Infrastructure/DependencyInjection.cs`.

## Security Notes

⚠️ **NEVER commit `.env` file or API keys to git**
- The `.env` file is in `.gitignore` and should remain there
- Environment variables should be set via platform-specific means
- Always use secrets management for production deployments
