import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AnalyticsTracker } from './core/services/analytics-tracker.service';
import { CartService } from './core/services/cart.service';
import { HeaderComponent } from './layout/header.component';
import { SidebarComponent } from './layout/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, CommonModule],
  template: `
    <!-- Scroll Progress Bar -->
    <div class="scroll-progress-bar" [style.width.%]="scrollProgress()"></div>

    <!-- Header Component -->
    <app-header [scrolled]="isHeaderScrolled()"></app-header>

    <!-- Main Layout -->
    <div class="app-layout">
      <!-- Sidebar (Desktop) -->
      <app-sidebar></app-sidebar>

      <!-- Main Content -->
      <main class="app-main" (scroll)="onScroll($event)">
        <router-outlet></router-outlet>
        
        <!-- Floating CTA (appears after hero) -->
        @if (showFloatingCTA()) {
          <div class="floating-cta">
            <a href="/products" class="floating-btn" title="Shop Now">
              <span class="btn-icon">🛍️</span>
              <span class="btn-text">Shop Now</span>
            </a>
          </div>
        }
      </main>
    </div>
  `,
  styles: [`
    /* Scroll Progress Bar */
    .scroll-progress-bar {
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, #E8922A 0%, #7B1818 50%, #E8922A 100%);
      z-index: 1000;
      transition: width 0.1s ease;
      box-shadow: 0 0 8px rgba(232, 146, 42, 0.5);
      width: 0%;
    }

    /* App Layout */
    .app-layout {
      display: flex;
      min-height: 100vh;
      background: #FBF5E6;
      overflow-x: clip;
    }

    .app-main {
      flex: 1;
      min-width: 0;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      scroll-behavior: smooth;
      margin-left: 260px;
      margin-top: 0;
      margin-bottom: 0;
      position: relative;
      padding-top: 0;
    }

    /* Floating CTA Button */
    .floating-cta {
      position: fixed;
      bottom: 8rem;
      right: 2rem;
      z-index: 98;
      animation: slideInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    }

    .floating-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      background: linear-gradient(135deg, #7B1818 0%, #4A1515 100%);
      color: white;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.95rem;
      box-shadow: 0 8px 24px rgba(123, 24, 24, 0.3);
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      cursor: pointer;
      border: none;
      white-space: nowrap;
    }

    .floating-btn:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(123, 24, 24, 0.4);
      background: linear-gradient(135deg, #4A1515 0%, #2A0E0E 100%);
    }

    .floating-btn:active {
      transform: translateY(-2px);
    }

    .btn-icon {
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    @keyframes slideInUp {
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
      .app-main {
        margin-left: 220px;
      }
    }

    @media (max-width: 768px) {
      .app-layout {
        display: block;
      }

      .app-main {
        margin-left: 0;
        margin-bottom: 0;
        padding-bottom: 80px;
      }
      .floating-cta {
        bottom: 7.5rem;
        right: 1rem;
      }
    }

    @media (max-width: 480px) {
      .floating-cta {
        bottom: 7rem;
        right: 0.75rem;
      }
      .floating-btn {
        padding: 0.75rem;
        font-size: 0;
        width: 56px;
        height: 56px;
      }
      .btn-text {
        display: none;
      }
      .btn-icon {
        font-size: 1.5rem;
      }
    }

    @media (max-width: 420px) {
      .floating-cta {
        display: none;
      }
    }

    /* Prefer reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .scroll-progress-bar,
      .floating-cta,
      .floating-btn {
        animation: none;
        transition: none;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  cart = inject(CartService);
  private analytics = inject(AnalyticsTracker);
  
  scrollProgress = signal(0);
  isHeaderScrolled = signal(false);
  showFloatingCTA = signal(false);

  ngOnInit() {
    this.analytics.pageVisit();
  }

  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight - target.clientHeight;
    const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    
    this.scrollProgress.set(scrollPercent);
    this.isHeaderScrolled.set(scrollTop > 100);
    this.showFloatingCTA.set(scrollTop > 500);
  }
}
