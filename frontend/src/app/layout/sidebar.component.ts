import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <nav class="sidebar-nav">
        <a routerLink="/" routerLinkActive="active" class="nav-item">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span class="nav-text">Home</span>
        </a>
        <a routerLink="/products" routerLinkActive="active" class="nav-item">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span class="nav-text">Shop</span>
        </a>
        <a routerLink="/products" routerLinkActive="active" class="nav-item">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span class="nav-text">Categories</span>
        </a>
        <a routerLink="/orders" routerLinkActive="active" class="nav-item">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"></path>
            <rect x="9" y="3" width="6" height="4" rx="2"></rect>
            <path d="M9 14l2 2 4-4"></path>
          </svg>
          <span class="nav-text">Orders</span>
        </a>
        <a routerLink="/favorites" routerLinkActive="active" class="nav-item">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <span class="nav-text">Favorites</span>
        </a>
        <a routerLink="/offers" routerLinkActive="active" class="nav-item">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
            <line x1="7" y1="7" x2="7.01" y2="7"></line>
          </svg>
          <span class="nav-text">Offers</span>
        </a>
        <a routerLink="/profile" routerLinkActive="active" class="nav-item">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span class="nav-text">Account</span>
        </a>
      </nav>

      <div class="sidebar-tiles">
        <div class="sidebar-tile">
          <svg class="tile-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
          </svg>
          <span class="tile-text">Order Freshness</span>
        </div>
        <div class="sidebar-tile">
          <svg class="tile-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span class="tile-text">100% Pure Ingredients</span>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      background: #FFF8E7;
      padding: 1.5rem 1.5rem 2rem;
      display: flex;
      flex-direction: column;
      position: fixed;
      height: 100vh;
      overflow-y: auto;
      z-index: 100;
      box-shadow: 4px 0 24px rgba(0, 0, 0, 0.1);
      top: 0;
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
    }

    .nav-item {
      padding: 0.6rem 1rem;
      border-radius: 8px;
      color: #4A2A18;
      text-decoration: none;
      transition: all 0.3s ease;
      font-size: 0.85rem;
      font-weight: 500;
      background: transparent;
      border: none;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .nav-svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .nav-text {
      flex: 1;
    }

    .nav-item:hover {
      background: rgba(196, 30, 58, 0.08);
      color: #6E1F1F;
    }

    .nav-item:hover .nav-svg {
      stroke: #6E1F1F;
    }

    .nav-item.active {
      background: rgba(196, 30, 58, 0.12);
      color: #6E1F1F;
      font-weight: 600;
    }

    .nav-item.active .nav-svg {
      stroke: #6E1F1F;
    }

    .sidebar-tiles {
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .sidebar-tile {
      background: rgba(196, 30, 58, 0.08);
      border-radius: 12px;
      padding: 0.75rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      transition: all 0.3s ease;
    }

    .sidebar-tile:hover {
      background: rgba(196, 30, 58, 0.15);
      transform: translateX(4px);
    }

    .tile-svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .tile-text {
      font-size: 0.8rem;
      color: #4A2A18;
      font-weight: 600;
    }

    @media (max-width: 1024px) {
      .sidebar { width: 220px; }
    }

    @media (max-width: 768px) {
      .sidebar { display: none; }
    }
  `]
})
export class SidebarComponent {}
