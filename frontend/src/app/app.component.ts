import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AnalyticsTracker } from './core/services/analytics-tracker.service';
import { CartService } from './core/services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="main-header">
      <div class="header-logo">
        <img src="/assets/images/rajasthani_ras_logo.png" alt="Rajasthani Ras" class="logo-image" />
      </div>
      <div class="header-actions">
        <button class="icon-btn">
          <span>🔔</span>
        </button>
        <a routerLink="/cart" class="icon-btn cart-btn">
          <span>🛒</span>
          @if (cart.itemCount() > 0) {
            <span class="cart-count">{{ cart.itemCount() }}</span>
          }
        </a>
        <a routerLink="/login" class="icon-btn login-btn">
          <span>Login</span>
        </a>
      </div>
    </header>
    <main class="main-content mandala-bg">
      <router-outlet />
    </main>
  `,
  styles: [`
    .main-header {
      background: rgba(255, 248, 240, 0.95);
      backdrop-filter: blur(20px);
      padding: 0.5rem 2.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 20px rgba(110, 31, 31, 0.05);
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      z-index: 50;
      gap: 2rem;
      height: 90px;
    }

    .header-logo {
      display: flex;
      align-items: center;
    }

    .header-logo .logo-image {
      height: 70px;
      width: auto;
      max-width: 200px;
      object-fit: contain;
    }

    .header-actions {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .icon-btn {
      position: relative;
      padding: 0.75rem;
      border: none;
      background: rgba(110, 31, 31, 0.05);
      cursor: pointer;
      font-size: 1.1rem;
      text-decoration: none;
      border-radius: 12px;
      transition: all 0.3s;
    }

    .icon-btn:hover {
      background: rgba(110, 31, 31, 0.1);
      transform: translateY(-2px);
    }

    .cart-btn {
      position: relative;
    }

    .cart-count {
      position: absolute;
      top: -4px;
      right: -4px;
      background: #6E1F1F;
      color: #fff;
      font-size: 0.65rem;
      font-weight: 700;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .login-btn {
      font-size: 0.85rem;
      font-weight: 600;
      padding: 0.6rem 1rem;
    }

    .main-content {
      min-height: calc(100vh - 140px);
      padding-bottom: 2rem;
      padding-top: 100px;
    }
  `]
})
export class AppComponent {
  cart = inject(CartService);
  constructor() {
    inject(AnalyticsTracker).pageVisit();
  }
}
