# RAAS — Rajasthani Desi Food Ecommerce Platform

Premium D2C ecommerce platform for traditional Rajasthani food products (pickles, papad, masalas, chutneys) with admin panel, analytics, referral system, and event-driven emails.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 19 (PWA), SCSS heritage design system |
| Backend | .NET 8 Web API, Clean Architecture |
| Database | PostgreSQL (Supabase / Neon) |
| Email | Resend API |
| Storage | Supabase Storage (product images) |
| Hosting | Vercel (frontend), Azure / Render (backend) |

## Project Structure

```
RAAS/
├── frontend/                 # Angular customer + admin UI
│   ├── src/app/
│   │   ├── core/             # Services, models, guards
│   │   ├── features/       # Home, products, cart, checkout, admin, analytics
│   │   └── layout/           # Header, footer
│   └── vercel.json
├── src/
│   ├── RAAS.Api/             # Controllers, Program.cs
│   ├── RAAS.Application/     # Services, DTOs, interfaces
│   ├── RAAS.Domain/          # Entities, enums
│   └── RAAS.Infrastructure/  # EF Core, repositories, Resend email
├── database/
│   └── schema.sql            # PostgreSQL schema + seed data
└── RAAS.sln
```

## Quick Start (Local)

### Prerequisites
- .NET 8 SDK
- Node.js 20+
- PostgreSQL (local, Supabase, or Neon)

### 1. Database
```bash
# Option A: Run schema.sql in Supabase/Neon SQL editor
# Option B: EF migrations auto-apply on API startup
```

Update connection string in `src/RAAS.Api/appsettings.json`:
```json
"ConnectionStrings": {
  "DefaultConnection": "Host=YOUR_HOST;Port=5432;Database=raas_db;Username=postgres;Password=YOUR_PASSWORD"
}
```

### 2. Backend API
```bash
cd src/RAAS.Api
dotnet run
# API: http://localhost:7095
# Swagger: http://localhost:7095/swagger
```

**Default admin:** `admin@raas.in` / `Admin@123`

### 3. Frontend
```bash
cd frontend
npm install
npm start
# App: http://localhost:4200
```

## API Endpoints

| Group | Endpoints |
|-------|-----------|
| Auth | `POST /api/auth/register`, `POST /api/auth/login` |
| Products | `GET /api/products`, `GET /api/products/{slug}` |
| Orders | `POST /api/orders/checkout`, `GET /api/orders/my` |
| Users | `GET /api/users/profile`, `GET /api/users/referrals` |
| Analytics | `POST /api/analytics/track`, `GET /api/analytics/dashboard` |
| Admin | `GET /api/admin/orders`, `PUT /api/admin/orders/{id}/status` |
| Investor CRM | `GET /api/investorcrm/overview`, `GET /api/investorcrm/revenue-report`, `POST /api/investorcrm/investors`, `POST /api/investorcrm/deals`, `POST /api/investorcrm/investment-flows`, `POST /api/investorcrm/investor-payouts`, `POST /api/investorcrm/compliance-cases` |

## Features

### Customer App
- Heritage luxury UI (maroon, saffron, cream palette)
- Product listing with filters (spicy, mild, bestseller)
- High-conversion product detail pages with story, health benefits
- Cart + 2-step checkout (UPI / COD / Card)
- WhatsApp-style order tracking timeline
- Referral system with ₹50 rewards
- User profile, addresses, loyalty points

### Admin Panel (`/admin`)
- Product CRUD with image URLs
- Order management + status updates + CSV export
- Coupon creation
- Customer segmentation view

### Analytics Dashboard (`/admin/analytics`)
- Sales: revenue, AOV, daily/weekly/monthly
- Customer: repeat rate, new vs returning
- Products: top sellers, category performance
- Referrals: conversion rate, top referrers
- Funnel: visit → view → cart → checkout → purchase

### Investor CRM Scaffold (`/admin/investor-crm`)
- Multi-investor account registry with pricing tier assignment
- Land deal pipeline with registration state and area coverage
- Investment flow tracking by **white** and **black** fund channels
- Compliance monitoring queue with severity and due dates
- Revenue reports by deal, land area, and time range (earnings, payouts, net revenue)
- Modular pricing plans: Basic CRM, Advanced Investment Tracking, Compliance Dashboard Suite

### Email Triggers (Resend)
| Event | Email |
|-------|-------|
| User Registered | Welcome + WELCOME10 coupon |
| Order Placed | Confirmation + admin alert |
| Order Shipped | Tracking notification |
| Order Delivered | Review + referral prompt |
| Low Stock | Admin alert |

Set in `appsettings.json`:
```json
"Resend": {
  "ApiKey": "re_xxxx",
  "FromEmail": "orders@raas.in",
  "AdminEmail": "admin@raas.in"
}
```

## Deployment

**Full step-by-step guide:** see [DEPLOYMENT.md](DEPLOYMENT.md)

Quick summary:

| Component | Platform | Key config |
|-----------|----------|------------|
| Frontend | **Vercel** | Root: `frontend`, env `API_URL` |
| Backend | **Render** or **Azure** | `Dockerfile` / `render.yaml` |
| Database | **Neon** or **Supabase** | `ConnectionStrings__DefaultConnection` |
| Email | **Resend** | `Resend__ApiKey`, `Resend__FromEmail` |

## Design System

| Token | Value |
|-------|-------|
| Deep Maroon | `#7B1E1E` |
| Saffron | `#F57C00` |
| Clay Brown | `#A66A3F` |
| Gold Accent | `#D4A017` |
| Cream BG | `#FAF3E0` |
| Display Font | Playfair Display |
| Body Font | Inter |

## License

Proprietary — RAAS Platform
