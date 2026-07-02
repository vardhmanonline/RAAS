import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Category, Product, UserProfile, Address } from '../../core/models';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';

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
  imports: [RouterLink, CommonModule],
  template: `
    <div class="premium-layout">
      <!-- Subtle Background Pattern -->
      <div class="background-pattern"></div>

      <!-- Main Content -->
      <main class="main-content">

        <!-- Hero Section -->
        <section class="hero-section">
          <div class="hero-content">
            <div class="hero-text">
              <!-- Made in Rajasthan Wax Seal -->
              <div class="wax-seal">
                <svg viewBox="0 0 100 100" class="wax-seal-svg">
                  <defs>
                    <filter id="waxShadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
                    </filter>
                  </defs>
                  <circle cx="50" cy="50" r="48" fill="#C9A860" opacity="0.2" filter="url(#waxShadow)"/>
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#C9A860" stroke-width="2.5"/>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#7B1818" stroke-width="1.5" opacity="0.8"/>
                  <text x="50" y="35" text-anchor="middle" font-size="7" fill="#7B1818" font-family="Playfair Display, serif" font-weight="600">Since 2024</text>
                  <text x="50" y="50" text-anchor="middle" font-size="5.5" fill="#C9A860" font-family="Noto Sans Devanagari, sans-serif" font-weight="500">जयपुर, राजस्थान</text>
                  <text x="50" y="65" text-anchor="middle" font-size="5.5" fill="#7B1818" font-family="Georgia, serif" font-weight="400">Handcrafted</text>
                </svg>
              </div>
              
              <!-- Hero Greeting (Lowercase, warm) -->
              <p class="hero-greeting">नमस्ते — from our kitchen in Jaipur, Rajasthan</p>
              
              <!-- Hindi Headline -->
              <h2 class="hero-hindi">घर का स्वाद, सीधे राजस्थान से।</h2>
              
              <!-- Main Headline -->
              <h1 class="hero-title">Pure. Authentic. Made with Love.</h1>
              
              <!-- Description -->
              <p class="hero-description">Made in small batches every Monday morning in Jaipur, shipped to your doorstep by Thursday. No preservatives. No shortcuts.</p>
              
              <!-- CTA Buttons -->
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
                  <div class="badge-icon">🏺</div>
                  <div class="badge-content">
                    <span class="badge-label">Small Batch</span>
                    <span class="badge-desc">Made fresh every week</span>
                  </div>
                </div>
                <div class="trust-badge">
                  <div class="badge-icon">🌿</div>
                  <div class="badge-content">
                    <span class="badge-label">No Preservatives</span>
                    <span class="badge-desc">Pure ingredients only</span>
                  </div>
                </div>
                <div class="trust-badge">
                  <div class="badge-icon">📦</div>
                  <div class="badge-content">
                    <span class="badge-label">Ship-ready</span>
                    <span class="badge-desc">Packed on order</span>
                  </div>
                </div>
                <div class="trust-badge">
                  <div class="badge-icon">👩‍🍳</div>
                  <div class="badge-content">
                    <span class="badge-label">Handmade</span>
                    <span class="badge-desc">Traditional family recipes</span>
                  </div>
                </div>
                <div class="trust-badge">
                  <div class="badge-icon">📍</div>
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
              
              <!-- Decorative Elements -->
              <div class="sand-dunes"></div>
            </div>
            
            <div class="why-choose-content">
              <h2 class="section-title">Why Choose Rajasthani Ras</h2>
              <div class="why-choose-cards">
                <div class="why-card">
                  <div class="why-card-icon">100%</div>
                  <span class="why-card-title">Authentic Rajasthani Taste</span>
                </div>
                <div class="why-card">
                  <div class="why-card-icon">✓</div>
                  <span class="why-card-title">No Preservatives or Chemicals</span>
                </div>
                <div class="why-card">
                  <div class="why-card-icon">🏺</div>
                  <span class="why-card-title">Prepared in Small Batches</span>
                </div>
                <div class="why-card">
                  <div class="why-card-icon">🚚</div>
                  <span class="why-card-title">Direct from Kitchen to Home</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Free Delivery Banner -->
        <section class="delivery-banner">
          <div class="banner-content">
            <span class="banner-item">Free delivery on orders above ₹499</span>
            <span class="banner-divider">·</span>
            <span class="banner-item">Cash on Delivery available</span>
            <span class="banner-divider">·</span>
            <span class="banner-item">100% secure checkout</span>
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
        radial-gradient(circle at 80% 70%, rgba(123, 24, 24, 0.03) 0%, transparent 50%);
      pointer-events: none;
      z-index: 0;
    }

    /* Main Content */
    .main-content {
      position: relative;
      z-index: 1;
      padding-top: 20px;
    }

    /* Hero Section */
    .hero-section {
      padding: 2rem 3rem 4rem;
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, #FBF5E6 0%, var(--warm-cream) 100%);
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

    /* Wax Seal */
    .wax-seal {
      width: 100px;
      height: 100px;
      margin-bottom: 1.5rem;
      animation: rotateIn 0.8s ease-out;
    }

    .wax-seal-svg {
      width: 100%;
      height: 100%;;
      filter: drop-shadow(0 4px 8px rgba(123, 24, 24, 0.15));
    }

    @keyframes rotateIn {
      from {
        opacity: 0;
        transform: rotate(-180deg) scale(0.5);
      }
      to {
        opacity: 1;
        transform: rotate(0) scale(1);
      }
    }

    /* Hero Greeting */
    .hero-greeting {
      color: var(--text-primary);
      font-size: 1.1rem;
      margin-bottom: 0.8rem;
      font-weight: 500;
      letter-spacing: 0.05em;
      text-transform: lowercase;
    }

    /* Hindi Headline */
    .hero-hindi {
      font-size: 1.8rem;
      color: var(--deep-maroon);
      margin-bottom: 0.5rem;
      font-family: 'Noto Sans Devanagari', Georgia, serif;
      font-weight: 600;
      line-height: 1.3;
      letter-spacing: 0.02em;
    }

    /* Main Title */
    .hero-title {
      font-size: clamp(2.5rem, 5vw, 3.5rem);
      color: var(--deep-maroon);
      margin-bottom: 1rem;
      font-family: 'Playfair Display', Georgia, serif;
      line-height: 1.15;
      font-weight: 400;
      letter-spacing: -0.5px;
    }

    /* Description */
    .hero-description {
      color: var(--text-primary);
      font-size: 1.05rem;
      margin-bottom: 2rem;
      max-width: 480px;
      line-height: 1.7;
      font-weight: 400;
      opacity: 0.9;
    }

    /* CTA Buttons */
    .hero-cta-group {
      display: flex;
      gap: 1rem;
      margin-bottom: 2.5rem;
    }

    .cta-primary {
      display: inline-block;
      background: linear-gradient(135deg, var(--deep-maroon) 0%, #4A1515 100%);
      color: #fff;
      padding: 1rem 2.5rem;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.95rem;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 8px 24px rgba(123, 24, 24, 0.25);
      letter-spacing: 0.5px;
    }

    .cta-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 32px rgba(123, 24, 24, 0.35);
      background: linear-gradient(135deg, #4A1515 0%, #2A0E0E 100%);
    }

    .cta-secondary {
      display: inline-block;
      background: transparent;
      color: var(--deep-maroon);
      padding: 1rem 2.5rem;
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

    /* Social Proof */
    .social-proof {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      margin-bottom: 1rem;
      font-size: 0.95rem;
      color: var(--text-primary);
      font-weight: 500;
    }

    .rating {
      font-weight: 700;
      color: var(--deep-maroon);
    }

    .divider {
      color: var(--text-muted);
    }

    .trust-text {
      color: var(--text-primary);
    }

    /* Freshness Indicator */
    .freshness-indicator {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.75rem 1rem;
      background: rgba(232, 146, 42, 0.08);
      border-radius: 20px;
      font-size: 0.9rem;
      color: var(--text-primary);
      font-weight: 500;
      width: fit-content;
      margin-bottom: 2rem;
    }

    .status-dot {
      font-size: 0.8rem;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    /* Trust Badges */
    .trust-badges {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 1rem;
      margin-top: 2rem;
    }

    .trust-badge {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 12px;
      border: 1px solid rgba(201, 168, 96, 0.2);
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }

    .trust-badge:hover {
      transform: translateY(-4px);
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0 8px 20px rgba(123, 24, 24, 0.1);
    }

    .badge-icon {
      font-size: 1.8rem;
      flex-shrink: 0;
      animation: slideInLeft 0.5s ease-out forwards;
    }

    .trust-badge:nth-child(2) .badge-icon { animation-delay: 0.1s; }
    .trust-badge:nth-child(3) .badge-icon { animation-delay: 0.2s; }
    .trust-badge:nth-child(4) .badge-icon { animation-delay: 0.3s; }
    .trust-badge:nth-child(5) .badge-icon { animation-delay: 0.4s; }

    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .badge-content {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .badge-label {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--deep-maroon);
    }

    .badge-desc {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 400;
    }

    /* Hero Image */
    .hero-image {
      position: relative;
    }

    .hero-image img {
      width: 100%;
      height: 500px;
      object-fit: cover;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(123, 24, 24, 0.12);
      animation: fadeInRight 0.8s ease-out;
    }

    @keyframes fadeInRight {
      from {
        opacity: 0;
        transform: translateX(40px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
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

    /* Products Menu Section */
    .products-menu-section {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(40px);
      border-radius: 24px;
      padding: 3rem;
      box-shadow: 0 20px 60px rgba(123, 24, 24, 0.15);
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
      position: relative;
      padding-bottom: 0.75rem;
    }

    .section-title::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 60px;
      height: 3px;
      background: var(--gold);
    }

    .view-all-link {
      color: var(--saffron);
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
      border: 1px solid rgba(201, 168, 96, 0.1);
    }

    .category-menu-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 16px 40px rgba(123, 24, 24, 0.15);
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

    .category-menu-card:hover .category-menu-image img {
      transform: scale(1.1);
    }

    .category-menu-info h3 {
      color: var(--deep-maroon);
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      text-align: center;
    }

    /* Why Choose Us */
    .why-choose-right {
      position: relative;
      background: linear-gradient(135deg, rgba(255, 248, 240, 0.9) 0%, rgba(247, 233, 215, 0.9) 100%);
      backdrop-filter: blur(40px);
      border-radius: 24px;
      padding: 2rem;
      box-shadow: 0 20px 60px rgba(123, 24, 24, 0.15);
      border: 2px solid rgba(201, 168, 96, 0.2);
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
      font-size: 1.5rem;
    }

    .why-choose-cards {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .why-card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 12px;
      transition: all 0.3s ease;
      animation: slideIn 0.5s ease-out forwards;
      opacity: 0;
    }

    .why-card:nth-child(1) { animation-delay: 0.1s; }
    .why-card:nth-child(2) { animation-delay: 0.2s; }
    .why-card:nth-child(3) { animation-delay: 0.3s; }
    .why-card:nth-child(4) { animation-delay: 0.4s; }

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

    .why-card:hover {
      background: rgba(201, 168, 96, 0.15);
      transform: translateX(5px);
      box-shadow: 0 4px 12px rgba(123, 24, 24, 0.1);
    }

    .why-card-icon {
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--saffron);
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(232, 146, 42, 0.1);
      border-radius: 50%;
      flex-shrink: 0;
    }

    .why-card-title {
      font-size: 0.95rem;
      color: var(--deep-maroon);
      font-weight: 600;
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
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    /* Delivery Banner */
    .delivery-banner {
      background: linear-gradient(135deg, var(--deep-maroon) 0%, #4A1515 100%);
      color: var(--warm-cream);
      padding: 1.5rem;
      text-align: center;
      margin: 2rem 3rem 0;
      border-radius: 16px;
      font-size: 0.95rem;
      font-weight: 500;
    }

    .banner-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
      letter-spacing: 0.05em;
    }

    .banner-divider {
      color: var(--gold);
    }

    /* Footer */
    .footer {
      background: #f7e7d3;
      padding: 40px 20px;
      border-top: 1px solid rgba(0, 0, 0, 0.05);
      font-family: system-ui, sans-serif;
      margin-top: 2rem;
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
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
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

    /* Responsive */
    @media (max-width: 1200px) {
      .hero-content { grid-template-columns: 1fr 1fr; gap: 2.5rem; }
      .hero-image img { height: 480px; }
    }

    @media (max-width: 1024px) {
      .hero-content { grid-template-columns: 1fr; gap: 2.5rem; }
      .hero-image { order: -1; }
      .hero-image img { height: 400px; }
      .why-choose-cards { grid-template-columns: 1fr; }
      .trust-badges { grid-template-columns: repeat(3, 1fr); }
    }

    @media (max-width: 768px) {
      .hero-section { padding: 2rem 1.5rem 3rem; }
      .hero-content { gap: 2rem; }
      .hero-image img { height: 300px; }
      .footer-container { flex-direction: column; }
      .footer-item { min-width: 100%; }
      .products-menu-grid { grid-template-columns: repeat(2, 1fr); }
      .products-menu-section { padding: 1.5rem; }
      .why-choose-right { padding: 1.5rem; }
      .hero-title { font-size: 2rem; }
      .hero-hindi { font-size: 1.4rem; }
      .bottom-section { grid-template-columns: 1fr; padding: 2rem 1.5rem; }
      .trust-badges { grid-template-columns: repeat(2, 1fr); }
      .delivery-banner { margin: 1.5rem 1.5rem 0; }
      .wax-seal { width: 70px; height: 70px; }
    }

    @media (max-width: 480px) {
      .hero-section { padding: 1.5rem 1rem 2.5rem; }
      .hero-image img { height: 220px; }
      .hero-cta-group { flex-direction: column; }
      .cta-primary, .cta-secondary { width: 100%; text-align: center; }
      .products-menu-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
      .products-menu-section { padding: 1.25rem; }
      .why-choose-cards { grid-template-columns: 1fr; }
      .trust-badges { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
      .delivery-banner { margin: 1rem 0.75rem 0; font-size: 0.85rem; }
      .hero-title { font-size: 1.75rem; }
      .hero-hindi { font-size: 1.25rem; }
      .hero-greeting { font-size: 0.9rem; }
      .hero-description { font-size: 0.95rem; }
      .section-title { font-size: 1.5rem; }
      .banner-item { font-size: 0.85rem; }
      .banner-divider { display: none; }
      .banner-content { flex-direction: column; gap: 0.5rem; }
    }

    @media (max-width: 360px) {
      .trust-badges { grid-template-columns: 1fr; }
      .products-menu-grid { grid-template-columns: 1fr; }
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
