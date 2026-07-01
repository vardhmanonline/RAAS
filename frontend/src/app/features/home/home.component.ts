import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Category, Product } from '../../core/models';
import { CartService } from '../../core/services/cart.service';

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
  imports: [RouterLink, CurrencyPipe],
  template: `
    <div class="dashboard-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-logo">
          <img src="/assets/images/rajasthani_ras_logo.png" alt="Rajasthani Ras" class="logo-image" />
          <span class="logo-text">Rajasthani Ras</span>
        </div>
        
        <nav class="sidebar-nav">
         <a routerLink="/" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">🏠</span>
            <span>Home</span>
          </a>
          <a routerLink="/products" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">🛒</span>
            <span>Shop</span>
          </a>
          <a routerLink="/products" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">📂</span>
            <span>Categories</span>
          </a>
          <a routerLink="/orders" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">📦</span>
            <span>Orders</span>
          </a>
          <a routerLink="/favorites" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">❤️</span>
            <span>Favorites</span>
          </a>
          <a routerLink="/offers" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">🎁</span>
            <span>Offers</span>
          </a>
          <a routerLink="/profile" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">👤</span>
            <span>Account</span>
          </a>
        </nav>

        <div class="sidebar-promos">
          <div class="promo-card">
            <div class="promo-icon">🌟</div>
            <h4>Order Freshness</h4>
            <p>We prepare your order fresh & pack with care</p>
          </div>
          <div class="promo-card">
            <div class="promo-icon">✨</div>
            <h4>100% Pure Ingredients</h4>
            <p>No Preservatives, No Artificial Flavours</p>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Header -->
        <header class="main-header">
          <div class="location-info">
            <span class="location-icon">📍</span>
            <span>Delivering to Jaipur, Rajasthan</span>
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

        <!-- Hero Section -->
        <section class="hero-section">
          <div class="hero-content">
            <div class="hero-text">
              <p class="hero-greeting">Namaste! Welcome to Rajasthani Ras</p>
              <p class="hero-tagline">Authentic Flavors from Rajasthan's Kitchen to Yours</p>
              <h1 class="hero-title">Pure. Authentic. Made with Love.</h1>
              <p class="hero-description">Taste the tradition of Rajasthan, made fresh in small batches.</p>
              
              <div class="hero-features">
                <div class="feature-item">
                  <span class="feature-icon">🏵️</span>
                  <span>Made in Rajasthan</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">👵</span>
                  <span>Traditional Recipes</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">🥘</span>
                  <span>Small Batch Freshness</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">🧤</span>
                  <span>Hygienic & Handmade</span>
                </div>
              </div>

              <a routerLink="/products" class="hero-cta">Shop Now</a>
            </div>
            <div class="hero-image">
              <img src="https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800" alt="Rajasthani woman preparing food" />
              <div class="hero-overlay">
                <span>From our Kitchen to your Home</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Bestsellers Section -->
        <section class="bestsellers-section">
          <div class="section-header">
            <h2 class="section-title">Shop Our Bestsellers</h2>
            <a routerLink="/products" class="view-all-link">View All →</a>
          </div>
          <div class="products-scroll">
            @for (p of bestsellers; track p.id) {
              <a [routerLink]="['/products', p.slug]" class="product-card-mini">
                <div class="product-image">
                  <img [src]="p.imageUrl" [alt]="p.name" />
                </div>
                <div class="product-name">{{ p.name }}</div>
                <div class="product-price">{{ p.price | currency:'INR':'symbol':'1.0-0' }}</div>
              </a>
            }
          </div>
        </section>

        <!-- Why Choose Section -->
        <section class="why-choose-section">
          <h2 class="section-title">Why Choose Rajasthani Ras?</h2>
          <div class="features-grid">
            <div class="feature-card">
              <span class="feature-card-icon">🎯</span>
              <h3>100% Authentic Rajasthani Taste</h3>
            </div>
            <div class="feature-card">
              <span class="feature-card-icon">🌿</span>
              <h3>No Preservatives or Chemicals</h3>
            </div>
            <div class="feature-card">
              <span class="feature-card-icon">🥣</span>
              <h3>Prepared in Small Batches</h3>
            </div>
            <div class="feature-card">
              <span class="feature-card-icon">✅</span>
              <h3>Hygienic & Quality Assured</h3>
            </div>
            <div class="feature-card">
              <span class="feature-card-icon">🚚</span>
              <h3>Direct from Rajasthan</h3>
            </div>
          </div>
        </section>

        <!-- Bottom Promotional Strip -->
        <section class="promo-strip">
          <div class="promo-item">
            <span class="promo-item-icon">🍽️</span>
            <div class="promo-item-text">
              <strong>Freshly Prepared</strong>
              <span>Made in small batches just for you</span>
            </div>
          </div>
          <div class="promo-item">
            <span class="promo-item-icon">📦</span>
            <div class="promo-item-text">
              <strong>Shipped with Care</strong>
              <span>Secure packaging to keep it fresh</span>
            </div>
          </div>
          <div class="promo-item">
            <span class="promo-item-icon">🏠</span>
            <div class="promo-item-text">
              <strong>Bringing Rajasthan To Your Home</strong>
              <span>Traditional taste, Timeless love</span>
            </div>
          </div>
          <div class="promo-item">
            <span class="promo-item-icon">🤝</span>
            <div class="promo-item-text">
              <strong>Support Local Artisans</strong>
              <span>Empowering local communities & preserving traditions</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-layout { display: flex; min-height: 100vh; background: #f8f5f0; }
    
    /* Sidebar */
    .sidebar { width: 280px; background: linear-gradient(180deg, #8B4513 0%, #654321 100%); padding: 1.5rem; display: flex; flex-direction: column; position: fixed; height: 100vh; overflow-y: auto; }
    .sidebar-logo { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.2); }
    .logo-image { height: 50px; width: auto; object-fit: contain; }
    .logo-text { font-size: 1.25rem; font-weight: 700; color: #FFD700; font-family: Georgia, serif; }
    
    .sidebar-nav { display: flex; flex-direction: column; gap: 0.5rem; flex: 1; }
    .nav-item { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.25rem; border-radius: 12px; color: rgba(255,255,255,0.85); text-decoration: none; transition: all 0.3s; font-size: 0.95rem; }
    .nav-item:hover { background: rgba(255,255,255,0.15); color: #fff; }
    .nav-item.active { background: #FFD700; color: #654321; font-weight: 600; }
    .nav-icon { font-size: 1.25rem; }
    
    .sidebar-promos { margin-top: 2rem; display: flex; flex-direction: column; gap: 1rem; }
    .promo-card { background: rgba(255,255,255,0.1); padding: 1.25rem; border-radius: 12px; backdrop-filter: blur(10px); }
    .promo-icon { font-size: 1.5rem; margin-bottom: 0.5rem; }
    .promo-card h4 { color: #FFD700; margin: 0 0 0.5rem; font-size: 0.95rem; }
    .promo-card p { color: rgba(255,255,255,0.8); margin: 0; font-size: 0.8rem; line-height: 1.4; }
    
    /* Main Content */
    .main-content { flex: 1; margin-left: 280px; overflow-y: auto; }
    
    /* Header */
    .main-header { background: #fff; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.08); position: sticky; top: 0; z-index: 100; }
    .location-info { display: flex; align-items: center; gap: 0.5rem; color: #654321; font-size: 0.9rem; }
    .location-icon { font-size: 1.1rem; }
    .header-actions { display: flex; gap: 1rem; align-items: center; }
    .icon-btn { position: relative; padding: 0.5rem; border: none; background: none; cursor: pointer; font-size: 1.25rem; text-decoration: none; }
    .cart-btn { position: relative; }
    .cart-count { position: absolute; top: -2px; right: -2px; background: #FFD700; color: #654321; font-size: 0.7rem; font-weight: 700; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    
    /* Hero Section */
    .hero-section { background: linear-gradient(135deg, #FFF8DC 0%, #F5DEB3 100%); padding: 3rem 2rem; position: relative; overflow: hidden; }
    .hero-content { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; max-width: 1400px; margin: 0 auto; }
    .hero-text { z-index: 2; }
    .hero-greeting { color: #8B4513; font-size: 1.1rem; margin-bottom: 0.5rem; font-weight: 500; }
    .hero-tagline { color: #654321; font-size: 1rem; margin-bottom: 1rem; font-style: italic; }
    .hero-title { font-size: clamp(2rem, 4vw, 3rem); color: #8B4513; margin-bottom: 1rem; font-family: Georgia, serif; line-height: 1.2; }
    .hero-description { color: #654321; font-size: 1.1rem; margin-bottom: 2rem; max-width: 500px; line-height: 1.6; }
    
    .hero-features { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 2rem; }
    .feature-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: #654321; }
    .feature-icon { font-size: 1.1rem; }
    
    .hero-cta { display: inline-block; background: #8B4513; color: #fff; padding: 1rem 2.5rem; border-radius: 30px; text-decoration: none; font-weight: 600; font-size: 1rem; transition: all 0.3s; box-shadow: 0 4px 15px rgba(139, 69, 19, 0.3); }
    .hero-cta:hover { background: #654321; transform: translateY(-2px); }
    
    .hero-image { position: relative; }
    .hero-image img { width: 100%; height: 400px; object-fit: cover; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.15); }
    .hero-overlay { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(139, 69, 19, 0.9); color: #FFD700; padding: 0.75rem 1.5rem; border-radius: 25px; font-size: 0.9rem; font-weight: 600; backdrop-filter: blur(5px); }
    
    /* Bestsellers Section */
    .bestsellers-section { padding: 3rem 2rem; max-width: 1400px; margin: 0 auto; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .section-title { font-size: 1.75rem; color: #8B4513; margin: 0; font-family: Georgia, serif; }
    .view-all-link { color: #8B4513; text-decoration: none; font-weight: 600; font-size: 1rem; }
    .view-all-link:hover { color: #654321; }
    
    .products-scroll { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1.5rem; }
    .product-card-mini { text-decoration: none; color: inherit; display: block; }
    .product-image { aspect-ratio: 1; overflow: hidden; border-radius: 12px; background: #fff; margin-bottom: 0.75rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .product-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
    .product-card-mini:hover .product-image img { transform: scale(1.05); }
    .product-name { font-size: 0.9rem; color: #654321; margin-bottom: 0.25rem; font-weight: 500; }
    .product-price { font-size: 1rem; color: #8B4513; font-weight: 700; }
    
    /* Why Choose Section */
    .why-choose-section { padding: 3rem 2rem; background: #fff; }
    .why-choose-section .section-title { text-align: center; margin-bottom: 2rem; }
    .features-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1.5rem; max-width: 1400px; margin: 0 auto; }
    .feature-card { text-align: center; padding: 1.5rem; background: linear-gradient(135deg, #FFF8DC 0%, #F5DEB3 100%); border-radius: 16px; transition: transform 0.3s; }
    .feature-card:hover { transform: translateY(-5px); }
    .feature-card-icon { font-size: 2rem; margin-bottom: 1rem; }
    .feature-card h3 { font-size: 0.95rem; color: #8B4513; margin: 0; line-height: 1.4; font-weight: 600; }
    
    /* Promo Strip */
    .promo-strip { background: linear-gradient(90deg, #8B4513 0%, #654321 100%); padding: 2rem; display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; }
    .promo-item { display: flex; align-items: center; gap: 1rem; color: #fff; }
    .promo-item-icon { font-size: 2rem; }
    .promo-item-text { display: flex; flex-direction: column; }
    .promo-item-text strong { font-size: 0.95rem; margin-bottom: 0.25rem; color: #FFD700; }
    .promo-item-text span { font-size: 0.8rem; opacity: 0.9; }
    
    @media (max-width: 1024px) {
      .sidebar { width: 240px; }
      .main-content { margin-left: 240px; }
      .hero-content { grid-template-columns: 1fr; gap: 2rem; }
      .hero-image { order: -1; }
      .features-grid { grid-template-columns: repeat(3, 1fr); }
      .promo-strip { grid-template-columns: repeat(2, 1fr); }
    }
    
    @media (max-width: 768px) {
      .sidebar { display: none; }
      .main-content { margin-left: 0; }
      .hero-section { padding: 2rem 1rem; }
      .hero-features { grid-template-columns: 1fr; }
      .features-grid { grid-template-columns: repeat(2, 1fr); }
      .promo-strip { grid-template-columns: 1fr; }
      .products-scroll { grid-template-columns: repeat(2, 1fr); }
    }
  `]
})
export class HomeComponent implements OnInit {
  private api = inject(ApiService);
  cart = inject(CartService);
  categories: Category[] = [];
  bestsellers: Product[] = [];
  specialOffers: SpecialOffer[] = [];
  settings: StoreSettings | null = null;

  ngOnInit() {
    this.api.get<Category[]>('/products/categories').subscribe(c => this.categories = c);
    this.api.get<Product[]>('/products?filter=bestseller').subscribe(p => this.bestsellers = p);
    this.api.get<SpecialOffer[]>('/store/special-offers').subscribe(offers => this.specialOffers = offers);
    this.api.get<StoreSettings>('/store/settings').subscribe(settings => this.settings = settings);
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
