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

      <!-- Header -->
      <header class="main-header">
        <div class="header-logo">
          <img src="/assets/images/rajasthani_ras_logo.png" alt="Rajasthani Ras" class="logo-image" />
        </div>
        <div class="location-info">
          <span class="location-icon">📍</span>
          <span>Delivering to {{ deliveryLocation }}</span>
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
        </div>
      </header>

      <!-- Main Content -->
      <main class="main-content">

        <!-- Hero Section -->
        <section class="hero-section">
          <div class="hero-content">
            <div class="hero-text">
              <p class="hero-greeting">Namaste 🙏</p>
              <h1 class="hero-title">Pure.<br>Authentic.<br>Made with Love.</h1>
              <p class="hero-description">Taste the authentic flavors of Rajasthan, prepared fresh in small batches, delivered straight from our kitchen.</p>
              
              <div class="hero-cta-group">
                <a routerLink="/products" class="cta-primary">Shop Now</a>
                <a routerLink="/products" class="cta-secondary">Explore Collection</a>
              </div>
              
              <div class="hero-features">
                <div class="feature-item">
                  <span class="check-icon">✓</span>
                  <span>Handmade</span>
                </div>
                <div class="feature-item">
                  <span class="check-icon">✓</span>
                  <span>Small Batch</span>
                </div>
                <div class="feature-item">
                  <span class="check-icon">✓</span>
                  <span>No Preservatives</span>
                </div>
                <div class="feature-item">
                  <span class="check-icon">✓</span>
                  <span>Freshly Prepared</span>
                </div>
                <div class="feature-item">
                  <span class="check-icon">✓</span>
                  <span>Traditional Recipes</span>
                </div>
              </div>
            </div>
            <div class="hero-image">
              <img src="/assets/images/hero-rajasthani-woman.jpeg" alt="Rajasthani woman preparing food" />
            </div>
          </div>
        </section>

        <!-- Product Menu Section (Center) -->
        <section class="products-menu-section">
          <div class="section-header">
            <h2 class="section-title">Our Categories</h2>
            <a routerLink="/products" class="view-all-link">View All →</a>
          </div>
          <div class="products-menu-grid">
            @for (category of categories; track category.id) {
              <a [routerLink]="['/products']" [queryParams]="{category: category.name}" class="category-menu-card">
                <div class="category-menu-image">
                  @if (category.imageUrl) {
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
        </section>

        <!-- Bottom Section Grid -->
        <section class="bottom-section">
          <!-- Why Choose Us - Right Bottom -->
          <div class="why-choose-right">
            <h2 class="section-title">Why Choose Rajasthani Ras</h2>
            <div class="why-choose-list">
              <div class="why-item">
                <span class="why-icon">✓</span>
                <span>Homemade Taste</span>
              </div>
              <div class="why-item">
                <span class="why-icon">✓</span>
                <span>Freshly Packed</span>
              </div>
              <div class="why-item">
                <span class="why-icon">✓</span>
                <span>Direct from Rajasthan</span>
              </div>
              <div class="why-item">
                <span class="why-icon">✓</span>
                <span>Hygienically Prepared</span>
              </div>
              <div class="why-item">
                <span class="why-icon">✓</span>
                <span>Premium Ingredients</span>
              </div>
              <div class="why-item">
                <span class="why-icon">✓</span>
                <span>Authentic Recipes</span>
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
      --ivory: #FFF8F0;
      --warm-cream: #F7E9D7;
      --deep-maroon: #6E1F1F;
      --royal-gold: #C89A2B;
      --terracotta: #B65A2A;
      --dark-brown: #4A2A18;
      --soft-shadow: 0 8px 32px rgba(110, 31, 31, 0.08);
      --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .premium-layout {
      display: flex;
      min-height: 100vh;
      background: var(--ivory);
      font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      position: relative;
    }

    /* Subtle Background Pattern */
    .background-pattern {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: 
        radial-gradient(circle at 20% 30%, rgba(200, 154, 43, 0.03) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(182, 90, 42, 0.03) 0%, transparent 50%),
        url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30L30 0z' fill='none' stroke='%23C89A2B' stroke-opacity='0.03'/%3E%3C/svg%3E");
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
      padding-top: 80px;
    }

    /* Header - Minimal Luxury */
    .main-header {
      background: rgba(255, 248, 240, 0.95);
      backdrop-filter: blur(20px);
      padding: 1rem 2.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 20px rgba(110, 31, 31, 0.05);
      position: fixed;
      top: 0;
      right: 0;
      left: 260px;
      z-index: 50;
      gap: 2rem;
    }

    .header-logo {
      display: flex;
      align-items: center;
    }

    .header-logo .logo-image {
      height: 55px;
      width: auto;
      object-fit: contain;
    }

    .location-info {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      color: var(--dark-brown);
      font-size: 0.75rem;
      font-weight: 500;
      background: rgba(255, 255, 255, 0.8);
      padding: 0.35rem 0.7rem;
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      margin-left: auto;
      margin-right: 1rem;
      max-width: 180px;
    }

    .location-icon {
      font-size: 1rem;
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
      background: var(--deep-maroon);
      color: #fff;
      font-size: 0.65rem;
      font-weight: 700;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(110, 31, 31, 0.3);
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

    /* Products Menu Section (Center) */
    .products-menu-section {
      padding: 4rem 3rem;
      max-width: 1400px;
      margin: 0 auto;
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
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    /* Why Choose Us - Right Bottom */
    .why-choose-right {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(40px);
      border-radius: 24px;
      padding: 3rem;
      box-shadow: var(--glass-shadow);
      border: 1px solid rgba(255, 255, 255, 0.5);
    }

    .why-choose-right .section-title {
      margin-bottom: 2rem;
    }

    .why-choose-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .why-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1rem;
      color: var(--dark-brown);
      font-weight: 500;
    }

    .why-icon {
      color: var(--royal-gold);
      font-weight: 700;
      font-size: 1.2rem;
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
      gap: 20px;
      flex-wrap: wrap;
    }

    .footer-item {
      flex: 1;
      min-width: 220px;
      background: rgba(255, 255, 255, 0.65);
      border-radius: 16px;
      padding: 22px;
      text-align: center;
      backdrop-filter: blur(8px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.06);
      transition: 0.25s ease;
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
