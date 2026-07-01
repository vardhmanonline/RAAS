import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <nav class="sidebar-nav">
        <!-- Always Visible for Guests & Logged-in -->
        <a routerLink="/" routerLinkActive="active" class="nav-item" title="Home">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span class="nav-text">Home</span>
        </a>
        
        <a routerLink="/products" routerLinkActive="active" class="nav-item" title="Shop">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span class="nav-text">Shop</span>
        </a>
        
        <a routerLink="/products" routerLinkActive="active" class="nav-item" title="Categories">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span class="nav-text">Categories</span>
        </a>

        <a routerLink="/offers" routerLinkActive="active" class="nav-item" title="Offers">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
            <line x1="7" y1="7" x2="7.01" y2="7"></line>
          </svg>
          <span class="nav-text">Offers</span>
        </a>

        <!-- Only visible when logged in -->
        @if (auth.isLoggedIn()) {
          <div class="nav-divider"></div>
          
          <a routerLink="/orders" routerLinkActive="active" class="nav-item" title="My Orders">
            <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"></path>
              <rect x="9" y="3" width="6" height="4" rx="2"></rect>
              <path d="M9 14l2 2 4-4"></path>
            </svg>
            <span class="nav-text">My Orders</span>
          </a>
          
          <a routerLink="/favorites" routerLinkActive="active" class="nav-item" title="Favorites">
            <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span class="nav-text">Favorites</span>
          </a>
          
          <a routerLink="/referrals" routerLinkActive="active" class="nav-item" title="Refer & Earn">
            <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span class="nav-text">Refer & Earn</span>
          </a>

          <a routerLink="/profile" routerLinkActive="active" class="nav-item" title="My Account">
            <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span class="nav-text">My Account</span>
          </a>

          @if (auth.isAdmin()) {
            <a routerLink="/admin" routerLinkActive="active" class="nav-item admin-nav-item" title="Admin Dashboard">
              <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 3v1m6.053 0a9.001 9.001 0 0 1 0 12.94M3 12a9 9 0 0 1 12.943-8.957M1 12a9 9 0 0 0 12.943 8.944M12 3a9 9 0 0 0-8.943 11.023"></path>
              </svg>
              <span class="nav-text">Admin</span>
            </a>
          }
        }
      </nav>

      <!-- Trust Badges (Guest View) -->
      @if (!auth.isLoggedIn()) {
        <div class="sidebar-tiles">
          <div class="sidebar-tile">
            <svg class="tile-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span class="tile-text">100% Pure Ingredients</span>
          </div>
          <div class="sidebar-tile">
            <svg class="tile-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
            </svg>
            <span class="tile-text">Fresh Every Week</span>
          </div>
          <div class="sidebar-tile">
            <svg class="tile-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span class="tile-text">Direct from Jaipur</span>
          </div>
        </div>
      }

      <!-- Login CTA (Guest Only) -->
      @if (!auth.isLoggedIn()) {
        <a routerLink="/login" class="sidebar-login-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
            <polyline points="10 17 15 12 10 7"></polyline>
            <line x1="15" y1="12" x2="3" y2="12"></line>
          </svg>
          <span>Login to Unlock</span>
        </a>
      }
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      background: #FBF5E6;
      padding: 1.5rem 1.5rem 2rem;
      display: flex;
      flex-direction: column;
      position: fixed;
      height: calc(100vh - 90px);
      overflow-y: auto;
      z-index: 100;
      box-shadow: 4px 0 24px rgba(0, 0, 0, 0.1);
      top: 90px;
      border-right: 1px solid rgba(201, 168, 96, 0.1);
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
    }

    .nav-item {
      padding: 0.6rem 1rem;
      border-radius: 12px;
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
      cursor: pointer;
    }

    .nav-svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      stroke: currentColor;
    }

    .nav-text {
      flex: 1;
    }

    .nav-item:hover {
      background: rgba(232, 146, 42, 0.08);
      color: #7B1818;
      transform: translateX(4px);
    }

    .nav-item:hover .nav-svg {
      stroke: #7B1818;
    }

    .nav-item.active {
      background: linear-gradient(135deg, rgba(232, 146, 42, 0.15) 0%, rgba(201, 168, 96, 0.1) 100%);
      color: #7B1818;
      font-weight: 600;
      box-shadow: inset 0 0 8px rgba(232, 146, 42, 0.1);
    }

    .nav-item.active .nav-svg {
      stroke: #7B1818;
    }

    .admin-nav-item {
      color: #E8922A !important;
      font-weight: 600;
    }

    .admin-nav-item:hover {
      background: rgba(232, 146, 42, 0.15);
    }

    .admin-nav-item.active {
      background: linear-gradient(135deg, rgba(232, 146, 42, 0.2) 0%, rgba(232, 146, 42, 0.1) 100%);
    }

    /* Divider for logged-in sections */
    .nav-divider {
      height: 1px;
      background: linear-gradient(90deg, transparent 0%, #C9A860 50%, transparent 100%);
      margin: 0.5rem 0;
      opacity: 0.3;
    }

    /* Trust Badges (Guest View) */
    .sidebar-tiles {
      margin-top: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(201, 168, 96, 0.2);
    }

    .sidebar-tile {
      background: rgba(232, 146, 42, 0.08);
      border-radius: 12px;
      padding: 0.75rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      transition: all 0.3s ease;
      border: 1px solid rgba(232, 146, 42, 0.15);
    }

    .sidebar-tile:hover {
      background: rgba(232, 146, 42, 0.15);
      transform: translateX(4px);
      border-color: rgba(232, 146, 42, 0.3);
    }

    .tile-svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      stroke: #E8922A;
    }

    .tile-text {
      font-size: 0.8rem;
      color: #4A2A18;
      font-weight: 600;
    }

    /* Login Button (Guest Only) */
    .sidebar-login-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
      padding: 0.75rem 1rem;
      margin-top: auto;
      background: linear-gradient(135deg, #7B1818 0%, #4A1515 100%);
      color: white;
      border: none;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(123, 24, 24, 0.2);
    }

    .sidebar-login-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(123, 24, 24, 0.3);
      background: linear-gradient(135deg, #4A1515 0%, #2A0E0E 100%);
    }

    .sidebar-login-btn svg {
      width: 20px;
      height: 20px;
      stroke: currentColor;
    }

    /* Scrollbar Styling */
    .sidebar::-webkit-scrollbar {
      width: 6px;
    }

    .sidebar::-webkit-scrollbar-track {
      background: rgba(201, 168, 96, 0.05);
    }

    .sidebar::-webkit-scrollbar-thumb {
      background: #C9A860;
      border-radius: 3px;
    }

    .sidebar::-webkit-scrollbar-thumb:hover {
      background: #E8922A;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .sidebar {
        width: 220px;
      }
      .nav-text {
        display: none;
      }
      .nav-item {
        justify-content: center;
        padding: 0.6rem;
      }
      .sidebar-login-btn span {
        display: none;
      }
      .sidebar-login-btn {
        justify-content: center;
        width: 100%;
      }
    }

    @media (max-width: 768px) {
      .sidebar {
        display: none;
      }
    }

    /* Mobile Bottom Tab Bar (Fallback for smaller devices) */
    @media (max-width: 480px) {
      .sidebar {
        display: none;
      }
    }
  `]
})
export class SidebarComponent implements OnInit {
  auth = inject(AuthService);

  ngOnInit() {
    // Sidebar initialization if needed
  }
}
