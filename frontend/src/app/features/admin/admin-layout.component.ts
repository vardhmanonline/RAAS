import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="admin-layout">
      <aside class="admin-sidebar">
        <h2 class="admin-logo">🪷 RAAS Admin</h2>
        <nav>
          <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Dashboard</a>
          <a routerLink="/admin/products" routerLinkActive="active">Products</a>
          <a routerLink="/admin/orders" routerLinkActive="active">Orders</a>
          <a routerLink="/admin/coupons" routerLinkActive="active">Coupons</a>
          <a routerLink="/admin/offers" routerLinkActive="active">Special Offers</a>
          <a routerLink="/admin/customers" routerLinkActive="active">Customers</a>
          <a routerLink="/admin/analytics" routerLinkActive="active">Analytics</a>
          <a routerLink="/admin/investor-crm" routerLinkActive="active">Investor CRM</a>
          <a routerLink="/admin/settings" routerLinkActive="active">⚙️ Settings</a>
          <a routerLink="/" class="back-link">← Back to Store</a>
        </nav>
      </aside>
      <main class="admin-main">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .admin-layout { display: flex; min-height: calc(100vh - 60px); }
    .admin-sidebar { width: 240px; background: var(--maroon); color: var(--cream); padding: 1.5rem; flex-shrink: 0; }
    .admin-logo { font-family: var(--font-display); margin-bottom: 2rem; font-size: 1.25rem; }
    nav { display: flex; flex-direction: column; gap: 0.25rem; }
    nav a { color: rgba(255,255,255,0.8); padding: 0.75rem 1rem; border-radius: var(--radius-sm); font-weight: 500; transition: all 0.2s; }
    nav a:hover, nav a.active { background: rgba(255,255,255,0.15); color: white; }
    .back-link { margin-top: 2rem; opacity: 0.7; }
    .admin-main { flex: 1; padding: 2rem; background: var(--cream); overflow: auto; }
    @media (max-width: 768px) { .admin-sidebar { display: none; } }
  `]
})
export class AdminLayoutComponent {}
