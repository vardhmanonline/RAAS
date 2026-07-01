import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <!-- Logo / Brand -->
      <div class="sidebar-header">
        <div class="logo">RAAS</div>
        <p class="tagline">Rajasthan</p>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="nav-item">
          <span class="icon">🏠</span>
          <span class="label">Home</span>
        </a>
        <a routerLink="/products" routerLinkActive="active" class="nav-item">
          <span class="icon">🛍️</span>
          <span class="label">Products</span>
        </a>
        <a routerLink="/cart" routerLinkActive="active" class="nav-item">
          <span class="icon">🛒</span>
          <span class="label">Cart</span>
        </a>

        @if (auth.isLoggedIn()) {
          <a routerLink="/orders" routerLinkActive="active" class="nav-item">
            <span class="icon">📦</span>
            <span class="label">Orders</span>
          </a>
          <a routerLink="/referrals" routerLinkActive="active" class="nav-item">
            <span class="icon">🤝</span>
            <span class="label">Referrals</span>
          </a>
          <a routerLink="/profile" routerLinkActive="active" class="nav-item">
            <span class="icon">👤</span>
            <span class="label">Profile</span>
          </a>
          @if (auth.isAdmin()) {
            <a routerLink="/admin" routerLinkActive="active" class="nav-item admin">
              <span class="icon">⚙️</span>
              <span class="label">Admin</span>
            </a>
          }
        }
      </nav>

      <!-- Auth Links -->
      <div class="sidebar-footer">
        @if (!auth.isLoggedIn()) {
          <a routerLink="/login" class="btn-login">Login</a>
          <a routerLink="/register" class="btn-register">Register</a>
        } @else {
          <button (click)="logout()" class="btn-logout">Logout</button>
        }
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      left: 0;
      top: 0;
      width: 260px;
      height: 100vh;
      background: linear-gradient(135deg, #FBF5E6 0%, #F0E6CC 100%);
      display: flex;
      flex-direction: column;
      border-right: 1px solid rgba(123, 24, 24, 0.1);
      z-index: 100;
      overflow-y: auto;
    }

    .sidebar-header {
      padding: 2rem 1.5rem;
      text-align: center;
      border-bottom: 2px solid rgba(123, 24, 24, 0.1);
    }

    .logo {
      font-size: 1.8rem;
      font-weight: 700;
      color: #7B1818;
      font-family: 'Playfair Display', Georgia, serif;
      letter-spacing: 0.05em;
    }

    .tagline {
      font-size: 0.8rem;
      color: #E8922A;
      margin-top: 0.5rem;
      font-weight: 500;
    }

    .sidebar-nav {
      flex: 1;
      padding: 1.5rem 0;
      overflow-y: auto;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.875rem 1.5rem;
      color: #2C1A0E;
      text-decoration: none;
      transition: all 0.3s ease;
      border-left: 3px solid transparent;
      font-size: 0.95rem;
      font-weight: 500;
    }

    .nav-item:hover {
      background: rgba(123, 24, 24, 0.05);
      border-left-color: #E8922A;
      padding-left: calc(1.5rem + 4px);
    }

    .nav-item.active {
      background: rgba(232, 146, 42, 0.1);
      color: #7B1818;
      border-left-color: #E8922A;
      font-weight: 600;
    }

    .nav-item.admin {
      border-top: 1px solid rgba(123, 24, 24, 0.1);
      margin-top: 1rem;
      padding-top: 1.25rem;
    }

    .icon {
      font-size: 1.2rem;
    }

    .label {
      flex: 1;
    }

    .sidebar-footer {
      padding: 1.5rem;
      border-top: 1px solid rgba(123, 24, 24, 0.1);
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .btn-login, .btn-register, .btn-logout {
      padding: 0.75rem 1rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
      text-align: center;
    }

    .btn-login {
      color: #7B1818;
      background: transparent;
      border: 2px solid #7B1818;
    }

    .btn-login:hover {
      background: #7B1818;
      color: white;
    }

    .btn-register {
      background: linear-gradient(135deg, #7B1818, #4A1515);
      color: white;
    }

    .btn-register:hover {
      box-shadow: 0 4px 12px rgba(123, 24, 24, 0.3);
      transform: translateY(-2px);
    }

    .btn-logout {
      background: #E8922A;
      color: white;
    }

    .btn-logout:hover {
      background: #D17A1F;
      transform: translateY(-2px);
    }

    @media (max-width: 1024px) {
      .sidebar {
        width: 220px;
      }
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 100%;
        height: auto;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        border-right: none;
        border-top: 1px solid rgba(123, 24, 24, 0.1);
        flex-direction: row;
        align-items: center;
      }

      .sidebar-header {
        display: none;
      }

      .sidebar-nav {
        display: flex;
        gap: 0;
        padding: 0.5rem;
        overflow-x: auto;
      }

      .nav-item {
        padding: 0.75rem 1rem;
        flex-direction: column;
        gap: 0.3rem;
        border-left: none;
        border-bottom: 3px solid transparent;
      }

      .nav-item:hover {
        border-left: none;
        border-bottom-color: #E8922A;
      }

      .nav-item.active {
        border-left: none;
        border-bottom-color: #E8922A;
      }

      .sidebar-footer {
        display: none;
      }
    }
  `]
})
export class SidebarComponent {
  auth = inject(AuthService);

  logout() {
    this.auth.logout();
  }
}
