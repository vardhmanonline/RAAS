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
          <a routerLink="/admin/settings" routerLinkActive="active">⚙️ Settings</a>
          <a routerLink="/" class="back-link">← Back to Store</a>
        </nav>
      </aside>
      <main class="admin-main">
        <nav class="admin-mobile-nav" aria-label="Admin sections">
          <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Dashboard</a>
          <a routerLink="/admin/products" routerLinkActive="active">Products</a>
          <a routerLink="/admin/orders" routerLinkActive="active">Orders</a>
          <a routerLink="/admin/coupons" routerLinkActive="active">Coupons</a>
          <a routerLink="/admin/offers" routerLinkActive="active">Offers</a>
          <a routerLink="/admin/customers" routerLinkActive="active">Customers</a>
          <a routerLink="/admin/analytics" routerLinkActive="active">Analytics</a>
          <a routerLink="/admin/settings" routerLinkActive="active">Settings</a>
        </nav>
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
    .admin-mobile-nav { display: none; }
    @media (max-width: 768px) {
      .admin-sidebar { display: none; }
      .admin-main { padding: 1rem; }
      .admin-mobile-nav {
        display: flex;
        gap: 0.5rem;
        overflow-x: auto;
        margin-bottom: 1rem;
        padding-bottom: 0.25rem;
        position: sticky;
        top: 0;
        z-index: 5;
        background: var(--cream);
      }
      .admin-mobile-nav a {
        white-space: nowrap;
        color: var(--maroon);
        background: var(--white);
        border: 1px solid var(--cream-dark);
        padding: 0.45rem 0.75rem;
        border-radius: 999px;
        font-size: 0.85rem;
        font-weight: 600;
        min-height: 40px;
        display: inline-flex;
        align-items: center;
      }
      .admin-mobile-nav a.active {
        background: var(--maroon);
        color: var(--white);
        border-color: var(--maroon);
      }

      .admin-mobile-nav a:focus-visible {
        outline: 3px solid rgba(232, 146, 42, 0.9);
        outline-offset: 2px;
      }
    }
  `]
})
export class AdminLayoutComponent {}
