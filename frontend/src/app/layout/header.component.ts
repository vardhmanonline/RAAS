import { Component, Input, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { CartService } from '../core/services/cart.service';
import { ApiService } from '../core/services/api.service';

interface StoreSettings {
  logoUrl: string;
  mainTagline: string;
  companyName: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule, CommonModule],
  template: `
    <header class="header">
      <div class="header-container">
        <!-- Logo + Location -->
        <div class="header-left">
          <a routerLink="/" class="logo">
            @if (settings?.logoUrl) {
              <img [src]="settings?.logoUrl" [alt]="settings?.companyName || 'RAAS'" class="logo-image" />
            } @else {
              <span class="logo-icon">🪷</span>
            }
            <span class="logo-text">{{ settings?.companyName || 'RAAS' }}</span>
          </a>
          <div class="location-tag">
            <span class="location-icon">📍</span>
            <span class="location-text">Jaipur, Rajasthan</span>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="search-container">
          <input 
            type="text" 
            class="search-input" 
            placeholder="Search for namkeen, papad, sweets..."
            [(ngModel)]="searchQuery"
            (keyup.enter)="onSearch()"
          />
          <button class="search-btn" (click)="onSearch()" title="Search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
        </div>

        <!-- Header Actions -->
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
          @if (auth.isLoggedIn()) {
            <a routerLink="/cart" class="cart-btn" title="Shopping Cart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              @if (cart.itemCount() > 0) {
                <span class="cart-badge">{{ cart.itemCount() }}</span>
              }
            </a>
            <a routerLink="/profile" class="btn btn-secondary btn-sm">{{ userName }}</a>
          } @else {
            <a routerLink="/login" class="btn btn-primary btn-sm">Login</a>
          }
        </div>
      </div>

      <!-- Tagline Bar -->
      @if (settings?.mainTagline) {
        <div class="tagline-bar">
          <span class="tagline-text">{{ settings?.mainTagline }}</span>
        </div>
      }

      <!-- WhatsApp Button (Floating) -->
      <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" class="whatsapp-btn" title="Order on WhatsApp">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-9.746 9.798c0 2.734.732 5.367 2.124 7.684L2.58 22.923l8.127-2.133a9.847 9.847 0 004.759 1.213h.004c5.428 0 9.835-4.41 9.835-9.85 0-2.631-.555-5.112-1.61-7.52a9.833 9.833 0 00-8.115-4.733zm0-2.382c3.15 0 6.083 1.229 8.301 3.447 2.218 2.219 3.44 5.165 3.44 8.283 0 6.441-5.243 11.683-11.685 11.683a11.82 11.82 0 01-5.637-1.436L.255 23.702c-.341.341-.341.893 0 1.234l1.41 1.409c.34.34.893.34 1.233 0l8.958-8.957a11.758 11.758 0 005.834-1.57c2.217-2.219 3.437-5.165 3.437-8.283 0-6.441-5.242-11.682-11.683-11.682-3.15 0-6.083 1.229-8.302 3.447-2.218 2.218-3.44 5.165-3.44 8.282 0 3.116 1.221 6.062 3.44 8.281z"/>
        </svg>
        <span class="whatsapp-text">Order on WhatsApp</span>
      </a>
    </header>
  `,
  styles: [`
    .header {
      background: var(--white);
      box-shadow: var(--shadow-sm);
      position: sticky;
      top: 0;
      z-index: 50;
      border-bottom: 1px solid rgba(200, 154, 43, 0.1);
    }

    .header-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.875rem 1.25rem;
      gap: 1rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
      min-width: 0;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: var(--font-display);
      font-size: 1.5rem;
      font-weight: 400;
      color: var(--deep-maroon);
      text-decoration: none;
      white-space: nowrap;
      transition: all 0.3s ease;
    }

    .logo:hover {
      transform: scale(1.02);
    }

    .logo-icon {
      font-size: 1.25rem;
    }

    .logo-image {
      height: 40px;
      width: auto;
      object-fit: contain;
    }

    .logo-text {
      color: var(--deep-maroon);
      letter-spacing: 1px;
    }

    .location-tag {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.4rem 0.8rem;
      background: rgba(232, 146, 42, 0.08);
      border-radius: 20px;
      font-size: 0.8rem;
      color: var(--text-primary);
      font-weight: 500;
      white-space: nowrap;
      border: 1px solid rgba(232, 146, 42, 0.2);
      transition: all 0.3s ease;
    }

    .location-tag:hover {
      background: rgba(232, 146, 42, 0.12);
      border-color: rgba(232, 146, 42, 0.4);
    }

    .location-icon {
      font-size: 0.9rem;
    }

    .location-text {
      color: var(--text-primary);
    }

    /* Search Bar */
    .search-container {
      display: flex;
      align-items: center;
      flex: 1;
      max-width: 400px;
      min-width: 0;
      background: var(--warm-cream);
      border: 2px solid var(--gold);
      border-radius: 50px;
      padding: 0.5rem 0.75rem;
      transition: all 0.3s ease;
    }

    .search-container:focus-within {
      box-shadow: 0 0 0 3px rgba(232, 146, 42, 0.1);
      border-color: var(--saffron);
    }

    .search-input {
      flex: 1;
      border: none;
      background: transparent;
      outline: none;
      font-family: var(--font-body);
      font-size: 0.9rem;
      color: var(--text-primary);
      padding: 0.4rem 0.5rem;
    }

    .search-input::placeholder {
      color: var(--text-muted);
    }

    .search-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0.4rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--saffron);
      transition: all 0.2s;
    }

    .search-btn:hover {
      color: var(--deep-maroon);
      transform: scale(1.1);
    }

    .search-btn:focus-visible,
    .search-input:focus-visible,
    .cart-btn:focus-visible,
    .whatsapp-btn:focus-visible {
      outline: 3px solid rgba(232, 146, 42, 0.9);
      outline-offset: 2px;
      border-radius: 10px;
    }

    .search-btn svg {
      width: 20px;
      height: 20px;
    }

    /* Navigation */
    .nav {
      display: flex;
      gap: 1.5rem;
    }

    .nav a {
      color: var(--text-muted);
      font-weight: 500;
      font-size: 0.95rem;
      transition: all 0.2s;
      position: relative;
    }

    .nav a:hover, .nav a.active {
      color: var(--deep-maroon);
    }

    .nav a.active::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--saffron);
      border-radius: 1px;
    }

    .admin-link {
      color: var(--saffron) !important;
      font-weight: 600;
    }

    /* Header Actions */
    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-shrink: 0;
    }

    .cart-btn {
      position: relative;
      font-size: 1.25rem;
      padding: 0.5rem;
      color: var(--deep-maroon);
      transition: all 0.2s;
      display: flex;
      align-items: center;
    }

    .cart-btn:hover {
      color: var(--saffron);
      transform: scale(1.1);
    }

    .cart-btn svg {
      width: 24px;
      height: 24px;
    }

    .cart-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      background: var(--saffron);
      color: white;
      font-size: 0.65rem;
      font-weight: 700;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.15); }
    }

    .btn-sm {
      padding: 0.5rem 1.25rem;
      font-size: 0.85rem;
    }

    .btn-sm:focus-visible {
      outline: 3px solid rgba(232, 146, 42, 0.9);
      outline-offset: 2px;
    }

    /* Tagline Bar */
    .tagline-bar {
      background: var(--deep-maroon);
      color: var(--warm-cream);
      text-align: center;
      padding: 0.5rem 0;
      font-size: 0.85rem;
    }

    .tagline-text {
      font-style: italic;
      letter-spacing: 0.5px;
    }

    /* WhatsApp Floating Button */
    .whatsapp-btn {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #25D366;
      color: white;
      padding: 0.75rem 1.25rem;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
      transition: all 0.3s ease;
      z-index: 99;
      animation: slideUpIn 0.5s ease-out;
    }

    .whatsapp-btn:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(37, 211, 102, 0.4);
      background: #1fa351;
    }

    .whatsapp-btn svg {
      width: 24px;
      height: 24px;
    }

    @keyframes slideUpIn {
      from {
        opacity: 0;
        transform: translateY(40px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .header-container {
        gap: 0.75rem;
      }
      .search-container {
        max-width: 300px;
      }
      .nav {
        gap: 1rem;
      }
    }

    @media (max-width: 768px) {
      .header-container {
        flex-wrap: wrap;
        gap: 0.75rem;
      }

      .header-left {
        flex: 1;
      }

      .nav {
        display: none;
      }

      .search-container {
        order: 3;
        flex: 1 1 100%;
        max-width: 100%;
      }

      .search-input {
        font-size: 0.85rem;
      }

      .header-actions {
        margin-left: auto;
      }

      .location-tag {
        display: none;
      }

      .whatsapp-btn {
        bottom: calc(80px + 1rem); /* clear mobile bottom navigation bar */
        right: 1rem;
        padding: 0.6rem 1rem;
        font-size: 0.8rem;
      }
    }

    @media (max-width: 480px) {
      .header-container {
        gap: 0.5rem;
        padding: 0.75rem 1rem;
      }

      .logo {
        font-size: 1.2rem;
      }

      .logo-text {
        display: none;
      }

      .search-container {
        padding: 0.35rem 0.5rem;
      }

      .search-input {
        font-size: 0.8rem;
      }

      .search-input::placeholder {
        font-size: 0.75rem;
      }

      .header-actions {
        gap: 0.35rem;
      }

      .btn-sm {
        padding: 0.38rem 0.7rem;
        font-size: 0.78rem;
      }

      .whatsapp-text {
        display: none;
      }

      .whatsapp-btn {
        width: 50px;
        height: 50px;
        padding: 0;
        justify-content: center;
      }
    }

    @media (max-width: 360px) {
      .header-container {
        padding: 0.625rem 0.75rem;
      }

      .search-container {
        padding: 0.3rem 0.45rem;
      }

      .header-actions .btn-sm {
        max-width: 84px;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .cart-btn {
        padding: 0.35rem;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  @Input() scrolled = false;
  auth = inject(AuthService);
  cart = inject(CartService);
  private api = inject(ApiService);
  settings: StoreSettings | null = null;
  searchQuery = '';

  ngOnInit() {
    this.api.get<StoreSettings>('/store/settings').subscribe({
      next: (settings) => this.settings = settings,
      error: () => {
        this.settings = {
          logoUrl: '',
          mainTagline: '',
          companyName: 'RAAS'
        };
      }
    });
  }

  get userName() {
    return this.auth.currentUser()?.fullName?.split(' ')[0] ?? 'Profile';
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      window.location.href = `/products?q=${encodeURIComponent(this.searchQuery)}`;
    }
  }
}
