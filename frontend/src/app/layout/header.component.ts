import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { CartService } from '../core/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="container header-inner">
        <a routerLink="/" class="logo">
          <span class="logo-icon">🪷</span>
          <span class="logo-text">RAAS</span>
        </a>
        <nav class="nav">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a routerLink="/products" routerLinkActive="active">Shop</a>
          @if (auth.isLoggedIn()) {
            <a routerLink="/orders" routerLinkActive="active">Orders</a>
            <a routerLink="/referrals" routerLinkActive="active">Refer & Earn</a>
          }
          @if (auth.isAdmin()) {
            <a routerLink="/admin" routerLinkActive="active" class="admin-link">Admin</a>
          }
        </nav>
        <div class="header-actions">
          <a routerLink="/cart" class="cart-btn">
            🛒
            @if (cart.itemCount() > 0) {
              <span class="cart-badge">{{ cart.itemCount() }}</span>
            }
          </a>
          @if (auth.isLoggedIn()) {
            <a routerLink="/profile" class="btn btn-secondary btn-sm">{{ userName }}</a>
          } @else {
            <a routerLink="/login" class="btn btn-primary btn-sm">Login</a>
          }
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header { background: var(--white); box-shadow: var(--shadow-sm); position: sticky; top: 0; z-index: 50; }
    .header-inner { display: flex; align-items: center; justify-content: space-between; padding: 0.875rem 1.25rem; gap: 1rem; }
    .logo { display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; color: var(--maroon); }
    .logo-icon { font-size: 1.25rem; }
    .nav { display: flex; gap: 1.5rem; }
    .nav a { color: var(--text-muted); font-weight: 500; font-size: 0.95rem; transition: color 0.2s; }
    .nav a:hover, .nav a.active { color: var(--maroon); }
    .admin-link { color: var(--saffron) !important; }
    .header-actions { display: flex; align-items: center; gap: 0.75rem; }
    .cart-btn { position: relative; font-size: 1.25rem; padding: 0.5rem; }
    .cart-badge { position: absolute; top: 0; right: 0; background: var(--saffron); color: white; font-size: 0.65rem; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; }
    .btn-sm { padding: 0.5rem 1.25rem; font-size: 0.85rem; }
    @media (max-width: 768px) { .nav { display: none; } }
  `]
})
export class HeaderComponent {
  auth = inject(AuthService);
  cart = inject(CartService);
  get userName() {
    return this.auth.currentUser()?.fullName?.split(' ')[0] ?? 'Profile';
  }
}
