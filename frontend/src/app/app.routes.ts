import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
  { path: 'products', loadComponent: () => import('./features/products/product-list.component').then(m => m.ProductListComponent) },
  { path: 'products/:slug', loadComponent: () => import('./features/products/product-detail.component').then(m => m.ProductDetailComponent) },
  { path: 'cart', loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent) },
  { path: 'checkout', loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent) },
  { path: 'orders', canActivate: [authGuard], loadComponent: () => import('./features/orders/orders.component').then(m => m.OrdersComponent) },
  { path: 'orders/:id', canActivate: [authGuard], loadComponent: () => import('./features/orders/order-tracking.component').then(m => m.OrderTrackingComponent) },
  { path: 'claim-sample', loadComponent: () => import('./features/orders/claim-sample.component').then(m => m.ClaimSampleComponent) },
  { path: 'profile', canActivate: [authGuard], loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'referrals', canActivate: [authGuard], loadComponent: () => import('./features/referral/referral.component').then(m => m.ReferralComponent) },
  { path: 'login', loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent) },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./features/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'products', loadComponent: () => import('./features/admin/admin-products.component').then(m => m.AdminProductsComponent) },
      { path: 'orders', loadComponent: () => import('./features/admin/admin-orders.component').then(m => m.AdminOrdersComponent) },
      { path: 'coupons', loadComponent: () => import('./features/admin/admin-coupons.component').then(m => m.AdminCouponsComponent) },
      { path: 'customers', loadComponent: () => import('./features/admin/admin-customers.component').then(m => m.AdminCustomersComponent) },
      { path: 'analytics', loadComponent: () => import('./features/analytics/analytics-dashboard.component').then(m => m.AnalyticsDashboardComponent) },
      { path: 'settings', loadComponent: () => import('./features/admin/admin-settings.component').then(m => m.AdminSettingsComponent) }
    ]
  },
  { path: '**', redirectTo: '' }
];
