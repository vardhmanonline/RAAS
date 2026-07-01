import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Category, Product, UserProfile, Address } from '../../core/models';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { SidebarComponent } from '../../layout/sidebar.component';

interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  badgeText: string;
  buttonText: string;
  buttonLink: string;
  backgroundColor: string;
  textColor: string;
  badgeColor: string;
  buttonColor: string;
  displayOrder: number;
  isActive: boolean;
}

interface StoreSettings {
  logoUrl: string;
  mainTagline: string;
  secondaryTagline: string;
  companyName: string;
  companyTagline: string;
  companyDescription: string;
  websiteUrl: string;
  fssaiStatus: string;
  gstStatus: string;
  manufacturingLocation: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, SidebarComponent],
  template: `
    <div class="premium-layout">
      <!-- Subtle Background Pattern -->
      <div class="background-pattern"></div>
      
      <!-- Sidebar Component -->
      <app-sidebar></app-sidebar>

      <!-- Main Content -->
      <main class="main-content">

        <!-- Hero Section -->
        <section class="hero-section">
          <div class="hero-content">
            <div class="hero-text">
              <!-- Made in Rajasthan Wax Seal -->
              <div class="wax-seal">
                <svg viewBox="0 0 100 100" class="wax-seal-svg">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#C9A860" stroke-width="2"/>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#7B1818" stroke-width="1"/>
                  <text x="50" y="35" text-anchor="middle" font-size="6" fill="#7B1818" font-family="Playfair Display, serif">Since 2024</text>
                  <text x="50" y="50" text-anchor="middle" font-size="5" fill="#C9A860" font-family="Noto Sans Devanagari, sans-serif">जयपुर, राजस्थान</text>
                  <text x="50" y="65" text-anchor="middle" font-size="5" fill="#7B1818" font-family="Georgia, serif">Handcrafted</text>
                </svg>
              </div>
              
              <p class="hero-greeting">नमस्ते — from our kitchen in Jaipur, Rajasthan</p>
              <h2 class="hero-hindi">घर का स्वाद, सीधे राजस्थान से।</h2>
              <h1 class="hero-title">Pure.<br>Authentic.<br>Made with Love.</h1>
              <p class="hero-description">Made in small batches every Monday morning in Jaipur, shipped to your doorstep by Thursday. No preservatives. No shortcuts.</p>
              
              <div class="hero-cta-group">
                <a routerLink="/products" class="cta-primary">Shop Now</a>
                <a routerLink="/products" class="cta-secondary">Explore Products →</a>
              </div>
              
              <!-- Social Proof -->
              <div class="social-proof">
                <span class="rating">⭐ 4.8</span>
                <span class="divider">·</span>
                <span class="trust-text">Trusted by 2,400+ families across India</span>
              </div>
              
              <!-- Freshness Urgency -->
              <div class="freshness-indicator">
                <span class="status-dot">🟢</span>
                <span class="urgency-text">Next batch ships Friday · Only 12 packs left</span>
              </div>
              
              <!-- Illustrated Trust Badges -->
              <div class="trust-badges">
                <div class="trust-badge">
                  <svg viewBox="0 0 24 24" class="badge-icon">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2"/>
                  </svg>
                  <div class="badge-content">
                    <span class="badge-label">Small Batch</span>
                    <span class="badge-desc">Made fresh every week</span>
                  </div>
                </div>
                <div class="trust-badge">
                  <svg viewBox="0 0 24 24" class="badge-icon">
                    <path d="M12 2C7 2 3 6 3 11c0 5 4 9 9 11 5-2 9-6 9-11 0-5-4-9-9-9z"/>
                    <path d="M12 6c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z"/>
                  </svg>
                  <div class="badge-content">
                    <span class="badge-label">No Preservatives</span>
                    <span class="badge-desc">Pure ingredients only</span>
                  </div>
                </div>
                <div class="trust-badge">
                  <svg viewBox="0 0 24 24" class="badge-icon">
                    <path d="M20 8h-3V4H3v16h18v-8zM5 18v-7h2v7H5zm4 0v-7h2v7H9zm4 0v-7h2v7h-2zm4 0v-7h2v7h-2z"/>
                  </svg>
                  <div class="badge-content">
                    <span class="badge-label">Ship-ready</span>
                    <span class="badge-desc">Packed on order</span>
                  </div>
                </div>
                <div class="trust-badge">
                  <svg viewBox="0 0 24 24" class="badge-icon">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  <div class="badge-content">
                    <span class="badge-label">Handmade</span>
                    <span class="badge-desc">Traditional family recipes</span>
                  </div>
                </div>
                <div class="trust-badge">
                  <svg viewBox="0 0 24 24" class="badge-icon">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <div class="badge-content">
                    <span class="badge-label">From Jaipur</span>
                    <span class="badge-desc">Direct from Rajasthan</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="hero-image">
              <img src="https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&h=600&fit=crop" alt="Rajasthani kitchen with traditional snacks" />
            </div>
          </div>
        </section>

        <!-- Bottom Section Grid -->
        <section class="bottom-section">
          <!-- Product Menu Section (Left) -->
          <div class="products-menu-section">
            <div class="section-header">
              <h2 class="section-title">Our Categories</h2>
              <a routerLink="/products" class="view-all-link">View All →</a>
            </div>
            <div class="products-menu-grid">
              @for (category of categories; track category.id) {
                <a [routerLink]="['/products']" [queryParams]="{category: category.name}" class="category-menu-card">
                  <div class="category-menu-image">
                    @if (category.svgIcon) {
                      <div class="category-svg" [innerHTML]="category.svgIcon"></div>
                    } @else if (category.imageUrl) {
                      <img [src]="category.imageUrl" [alt]="category.name" />
                    } @else {
                      <div class="category-placeholder">{{ category.name.charAt(0) }}</div>
                    }
                  </div>
                  <div class="category-menu-info">
                    <h3>{{ category.name }}</h3>
                  </div>
                </a>
              }
            </div>
          </div>

          <!-- Why Choose Us (Right) -->
          <div class="why-choose-right">
            <div class="why-choose-background">
              <!-- Amber Fort Silhouette SVG -->
              <svg class="fort-silhouette" viewBox="0 0 400 200" preserveAspectRatio="xMidYMax slice">
                <path d="M0 200 L0 120 L30 100 L60 110 L90 90 L120 100 L150 80 L180 95 L210 75 L240 90 L270 70 L300 85 L330 65 L360 80 L400 60 L400 200 Z" fill="rgba(182, 90, 42, 0.15)"/>
                <path d="M50 200 L50 140 L80 130 L110 145 L140 125 L170 140 L200 120 L230 135 L260 115 L290 130 L320 110 L350 125 L400 100 L400 200 Z" fill="rgba(110, 31, 31, 0.1)"/>
              </svg>
              
              <!-- Camel Silhouette SVG -->
              <svg class="camel-silhouette" viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet">
                <path d="M10 50 Q15 45 20 50 L25 40 Q30 35 35 40 L40 30 Q45 25 50 30 L55 20 Q60 15 65 20 L70 25 Q75 20 80 25 L85 30 Q90 35 85 40 L80 45 Q75 50 70 45 L65 50 Q60 55 55 50 L50 55 Q45 60 40 55 L35 50 Q30 55 25 50 L20 55 Q15 60 10 55 Z" fill="rgba(200, 154, 43, 0.2)"/>
              </svg>
              
              <!-- Decorative Elements -->
              <div class="sand-dunes"></div>
            </div>
            
            <div class="why-choose-content">
              <h2 class="section-title">Why Choose Rajasthani Ras</h2>
              <div class="why-choose-list">
                <div class="why-item">
                  <svg class="why-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2"/>
                  </svg>
                  <span>Homemade Taste</span>
                </div>
                <div class="why-item">
                  <svg class="why-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                    <line x1="7" y1="7" x2="7.01" y2="7"/>
                  </svg>
                  <span>Freshly Packed</span>
                </div>
                <div class="why-item">
                  <svg class="why-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>Direct from Rajasthan</span>
                </div>
                <div class="why-item">
                  <svg class="why-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span>Hygienically Prepared</span>
                </div>
                <div class="why-item">
                  <svg class="why-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2"/>
                  </svg>
                  <span>Premium Ingredients</span>
                </div>
                <div class="why-item">
                  <svg class="why-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6h18"/>
                    <path d="M3 12h18"/>
                    <path d="M3 18h18"/>
                  </svg>
                  <span>Authentic Recipes</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Footer -->
        <footer class="footer">
          <div class="footer-container">
            <div class="footer-item">
              <div class="icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2C7 2 3 6 3 11c0 5 4 9 9 11 5-2 9-6 9-11 0-5-4-9-9-9zm-1 16c-3-2-5-5-5-8 0-3 3-6 6-6 3 0 6 3 6 6 0 3-2 6-7 8z"/>
                </svg>
              </div>
              <h4>Freshly Prepared</h4>
              <p>Made in small batches for freshness</p>
            </div>

            <div class="footer-item">
              <div class="icon">
                <svg viewBox="0 0 24 24">
                  <path d="M21 8l-9-5-9 5 9 5 9-5zm-9 7l-9-5v7l9 5 9-5v-7l-9 5z"/>
                </svg>
              </div>
              <h4>Shipped with Care</h4>
              <p>Secure packaging, keep it fresh</p>
            </div>

            <div class="footer-item">
              <div class="icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 3l10 9h-3v9h-5v-6H10v6H5v-9H2l10-9z"/>
                </svg>
              </div>
              <h4>Bringing Rajasthan To Your Home</h4>
              <p>Traditional taste, timeless love</p>
            </div>

            <div class="footer-item">
              <div class="icon">
                <svg viewBox="0 0 24 24">
                  <path d="M7 11V4h2v7H7zm4 0V2h2v9h-2zm4 0V6h2v5h-2zM5 13h14l-2 8H7l-2-8z"/>
                </svg>
              </div>
              <h4>Support Local Artisans</h4>
              <p>Empowering local communities & traditions</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  `,
  styles: [`
    /* Ultra-Premium Luxury Design */
    :host {
      --warm-cream: #FBF5E6;
      --deep-maroon: #7B1818;
      --saffron: #E8922A;
      --gold: #C9A860;
      --text-primary: #2C1A0E;
      --soft-shadow: 0 8px 32px rgba(123, 24, 24, 0.08);
      --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .premium-layout {
      display: flex;
      min-height: 100vh;
      background: var(--warm-cream);
      font-family: 'Noto Sans Devanagari', 'Playfair Display', 'Georgia', serif;
      position: relative;
      border-top: 3px solid var(--saffron);
    }

    /* Subtle Background Pattern */
    .background-pattern {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: 
        radial-gradient(circle at 20% 30%, rgba(232, 146, 42, 0.03) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(123, 24, 24, 0.03) 0%, transparent 50%),
        url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30L30 0z' fill='none' stroke='%23C9A860' stroke-opacity='0.03'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 0;
    }

    /* Main Content */
    .main-content {
      flex: 1;
      margin-left: 260px;
      overflow-y: auto;
      position: relative;
      z-index: 1;
      padding-top: 20px;
    }

    /* Hero Section - Editorial Luxury */
    .hero-section {
      padding: 2rem 3rem 4rem;
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, var(--ivory) 0%, var(--warm-cream) 100%);
    }

    .hero-content {
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: 3rem;
      align-items: center;
      max-width: 1400px;
      margin: 0 auto;
    }

    .hero-text {
      z-index: 2;
    }

    .hero-greeting {
      color: var(--terracotta);
      font-size: 1.2rem;
      margin-bottom: 1rem;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .hero-title {
      font-size: clamp(2.5rem, 5vw, 3.5rem);
      color: var(--deep-maroon);
      margin-bottom: 1rem;
      font-family: 'Playfair Display', Georgia, serif;
      line-height: 1.15;
      font-weight: 400;
      letter-spacing: -0.5px;
    }

    .hero-description {
      color: var(--dark-brown);
      font-size: 1.05rem;
      margin-bottom: 2rem;
      max-width: 480px;
      line-height: 1.7;
      font-weight: 400;
      opacity: 0.85;
    }

    .hero-cta-group {
      display: flex;
      gap: 1rem;
      margin-bottom: 2.5rem;
    }

    .cta-primary {
      display: inline-block;
      background: linear-gradient(135deg, var(--deep-maroon) 0%, #4A1515 100%);
      color: #fff;
      padding: 0.9rem 2.2rem;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.95rem;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 8px 24px rgba(110, 31, 31, 0.25);
      letter-spacing: 0.5px;
    }

    .cta-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 32px rgba(110, 31, 31, 0.35);
    }

    .cta-secondary {
      display: inline-block;
      background: transparent;
      color: var(--deep-maroon);
      padding: 0.9rem 2.2rem;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.95rem;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      border: 2px solid var(--deep-maroon);
      letter-spacing: 0.5px;
    }

    .cta-secondary:hover {
      background: var(--deep-maroon);
      color: #fff;
      transform: translateY(-3px);
    }

    .hero-features {
      display: flex;
      flex-wrap: wrap;
      gap: 1.25rem;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: var(--dark-brown);
      font-weight: 500;
    }

    .check-icon {
      color: var(--royal-gold);
      font-weight: 700;
      font-size: 1rem;
    }

    .hero-image {
      position: relative;
    }

    .hero-image img {
      width: 100%;
      height: 500px;
      object-fit: cover;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(110, 31, 31, 0.12);
    }

    /* Products Menu Section (Left) */
    .products-menu-section {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(40px);
      border-radius: 24px;
      padding: 3rem;
      box-shadow: 0 20px 60px rgba(110, 31, 31, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.5);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2.5rem;
    }

    .section-title {
      font-size: 2rem;
      color: var(--deep-maroon);
      margin: 0;
      font-family: 'Playfair Display', Georgia, serif;
      font-weight: 400;
      letter-spacing: -0.5px;
    }

    .view-all-link {
      color: var(--terracotta);
      text-decoration: none;
      font-weight: 600;
      font-size: 1rem;
      transition: color 0.3s;
    }

    .view-all-link:hover {
      color: var(--deep-maroon);
    }

    .products-menu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 2rem;
    }

    .category-menu-card {
      text-decoration: none;
      color: inherit;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 1.5rem;
      box-shadow: var(--soft-shadow);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(200, 154, 43, 0.1);
    }

    .category-menu-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 16px 40px rgba(110, 31, 31, 0.15);
    }

    .category-menu-image {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      overflow: hidden;
      margin-bottom: 1rem;
      background: var(--warm-cream);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .category-menu-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s;
    }

    .category-svg {
      width: 60px;
      height: 60px;
    }

    .category-svg svg {
      width: 100%;
      height: 100%;
      fill: var(--royal-gold);
    }

    .category-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 700;
      color: var(--deep-maroon);
      background: linear-gradient(135deg, var(--warm-cream) 0%, var(--ivory) 100%);
    }

    .category-menu-card:hover .category-menu-image img {
      transform: scale(1.1);
    }

    .category-menu-info {
      text-align: center;
    }

    .category-menu-info h3 {
      color: var(--deep-maroon);
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
    }

    /* Bottom Section */
    .bottom-section {
      padding: 4rem 3rem;
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      align-items: start;
    }

    /* Why Choose Us - Right Bottom */
    .why-choose-right {
      position: relative;
      background: linear-gradient(135deg, rgba(255, 248, 240, 0.9) 0%, rgba(247, 233, 215, 0.9) 100%);
      backdrop-filter: blur(40px);
      border-radius: 24px;
      padding: 2rem;
      box-shadow: 0 20px 60px rgba(110, 31, 31, 0.15);
      border: 2px solid rgba(200, 154, 43, 0.2);
      overflow: hidden;
      animation: fadeInUp 0.8s ease-out;
    }

    .why-choose-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;
    }

    .fort-silhouette {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 100%;
      height: 50%;
      animation: fortFloat 8s ease-in-out infinite;
    }

    .camel-silhouette {
      position: absolute;
      bottom: 10%;
      right: 5%;
      width: 60px;
      height: 36px;
      animation: camelWalk 12s linear infinite;
    }

    .sand-dunes {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 25%;
      background: linear-gradient(to top, rgba(182, 90, 42, 0.1) 0%, transparent 100%);
      border-radius: 0 0 24px 24px;
    }

    .why-choose-content {
      position: relative;
      z-index: 1;
    }

    .why-choose-right .section-title {
      margin-bottom: 1.5rem;
      position: relative;
      z-index: 1;
      font-size: 1.5rem;
    }

    .why-choose-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
      position: relative;
      z-index: 1;
    }

    .why-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: var(--dark-brown);
      font-weight: 500;
      padding: 0.5rem;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 10px;
      transition: all 0.3s ease;
      animation: slideIn 0.5s ease-out forwards;
      opacity: 0;
    }

    .why-item:nth-child(1) { animation-delay: 0.1s; }
    .why-item:nth-child(2) { animation-delay: 0.2s; }
    .why-item:nth-child(3) { animation-delay: 0.3s; }
    .why-item:nth-child(4) { animation-delay: 0.4s; }
    .why-item:nth-child(5) { animation-delay: 0.5s; }
    .why-item:nth-child(6) { animation-delay: 0.6s; }

    .why-item:hover {
      background: rgba(200, 154, 43, 0.15);
      transform: translateX(5px);
      box-shadow: 0 4px 12px rgba(110, 31, 31, 0.1);
    }

    .why-svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      stroke: var(--royal-gold);
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fortFloat {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    @keyframes camelWalk {
      0% {
        transform: translateX(-100px);
      }
      100% {
        transform: translateX(calc(100% + 100px));
      }
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
    }

    /* Footer */
    .footer {
      background: #f7e7d3;
      padding: 40px 20px;
      border-top: 1px solid rgba(0,0,0,0.05);
      font-family: system-ui, sans-serif;
    }

    .footer-container {
      display: flex;
      justify-content: space-between;
      align-items: stretch;
      max-width: 1200px;
      margin: auto;
      gap: 15px;
      padding: 0 20px;
    }

    .footer-item {
      flex: 1;
      min-width: 200px;
      background: rgba(255, 255, 255, 0.65);
      border-radius: 16px;
      padding: 20px;
      text-align: center;
      backdrop-filter: blur(8px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.06);
      transition: 0.25s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .footer-item:hover {
      transform: translateY(-6px);
    }

    .icon {
      width: 44px;
      height: 44px;
      margin: 0 auto 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .icon svg {
      width: 28px;
      height: 28px;
      fill: #7a3e2c;
    }

    .footer-item h4 {
      font-size: 15px;
      color: #5a2a1a;
      margin-bottom: 6px;
      font-weight: 600;
    }

    .footer-item p {
      font-size: 13px;
      color: #7a5a4a;
      line-height: 1.4;
    }

    @media (max-width: 1200px) {
      .hero-content { grid-template-columns: 1fr 1fr; gap: 2.5rem; }
      .hero-image img { height: 480px; }
    }

    @media (max-width: 1024px) {
      .main-content { margin-left: 220px; }
      .hero-content { grid-template-columns: 1fr; gap: 2.5rem; }
      .hero-image { order: -1; }
      .hero-image img { height: 400px; }
      .why-choose-list { grid-template-columns: 1fr; }
      .footer-container { gap: 15px; }
      .footer-item { min-width: 180px; }
      .hero-description { max-width: 100%; }
    }

    @media (max-width: 768px) {
      .main-content { margin-left: 0; }
      .hero-section { padding: 3rem 1.5rem 4rem; }
      .hero-content { gap: 2rem; }
      .hero-image img { height: 350px; }
      .hero-features { flex-direction: column; gap: 0.75rem; }
      .footer-container { flex-direction: column; }
      .footer-item { min-width: 100%; }
      .products-menu-grid { grid-template-columns: repeat(2, 1fr); }
      .why-choose-right { padding: 2rem; }
      .hero-title { font-size: 2rem; }
    }

    @media (max-width: 480px) {
      .hero-section { padding: 2rem 1rem 3rem; }
      .hero-image img { height: 300px; }
      .hero-cta-group { flex-direction: column; }
      .cta-primary, .cta-secondary { width: 100%; text-align: center; }
      .products-menu-grid { grid-template-columns: 1fr; }
      .why-choose-list { grid-template-columns: 1fr; }
    }
  `]
})
export class HomeComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  cart = inject(CartService);
  categories: Category[] = [];
  bestsellers: Product[] = [];
  specialOffers: SpecialOffer[] = [];
  settings: StoreSettings | null = null;
  userProfile: UserProfile | null = null;
  userAddress: Address | null = null;

  ngOnInit() {
    this.api.get<Category[]>('/products/categories').subscribe(c => this.categories = c);
    this.api.get<Product[]>('/products?filter=bestseller').subscribe(p => this.bestsellers = p);
    this.api.get<SpecialOffer[]>('/store/special-offers').subscribe(offers => this.specialOffers = offers);
    this.api.get<StoreSettings>('/store/settings').subscribe(settings => this.settings = settings);
    
    // Fetch user profile if logged in
    if (this.auth.isLoggedIn()) {
      this.api.get<UserProfile>('/user/profile').subscribe(profile => {
        this.userProfile = profile;
        // Get default address or first address
        this.userAddress = profile.addresses?.find(addr => addr.isDefault) || profile.addresses?.[0] || null;
      });
    }
  }

  get deliveryLocation(): string {
    if (this.userAddress) {
      return `${this.userAddress.city}, ${this.userAddress.state}`;
    }
    return 'Set your delivery location';
  }

  categoryIcon(slug: string): string {
    const icons: Record<string, string> = { pickles: '🥭', papad: '🫓', masalas: '🌶️', chutneys: '🍯', combos: '🎁' };
    return icons[slug] ?? '🍽️';
  }

  discountPercent(p: Product): number {
    if (!p.compareAtPrice || p.compareAtPrice <= p.price) return 0;
    return Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100);
  }
}
