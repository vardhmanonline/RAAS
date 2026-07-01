import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
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
  imports: [RouterLink, CurrencyPipe],
  template: `
    <div class="premium-layout">
      <!-- Subtle Background Pattern -->
      <div class="background-pattern"></div>
      
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-logo">
          <img src="/assets/images/rajasthani_ras_logo.png" alt="Rajasthani Ras" class="logo-image" />
        </div>
        
        <nav class="sidebar-nav">
          <a routerLink="/" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">Home</span>
          </a>
          <a routerLink="/products" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">Shop</span>
          </a>
          <a routerLink="/products" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">Categories</span>
          </a>
          <a routerLink="/orders" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">Orders</span>
          </a>
          <a routerLink="/favorites" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">Favorites</span>
          </a>
          <a routerLink="/offers" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">Offers</span>
          </a>
          <a routerLink="/profile" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">Account</span>
          </a>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Header -->
        <header class="main-header">
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

        <!-- Floating Trust Cards -->
        <section class="trust-cards-section">
          <div class="trust-cards-scroll">
            <div class="trust-card">
              <span class="trust-icon">✨</span>
              <span>100% Pure Ingredients</span>
            </div>
            <div class="trust-card">
              <span class="trust-icon">🎨</span>
              <span>No Artificial Colors</span>
            </div>
            <div class="trust-card">
              <span class="trust-icon">🌿</span>
              <span>No Preservatives</span>
            </div>
            <div class="trust-card">
              <span class="trust-icon">🍳</span>
              <span>Made Fresh Every Day</span>
            </div>
            <div class="trust-card">
              <span class="trust-icon">🏰</span>
              <span>Direct from Rajasthan</span>
            </div>
            <div class="trust-card">
              <span class="trust-icon">👵</span>
              <span>Traditional Family Recipes</span>
            </div>
          </div>
        </section>

        <!-- Categories Section -->
        <section class="categories-section">
          <div class="section-header">
            <h2 class="section-title">Shop by Category</h2>
            <a routerLink="/products" class="view-all-link">View All →</a>
          </div>
          <div class="categories-grid">
            @for (cat of categories; track cat.id) {
              <a [routerLink]="['/products']" [queryParams]="{category: cat.slug}" class="category-card">
                <div class="category-icon">{{ categoryIcon(cat.slug) }}</div>
                <h3>{{ cat.name }}</h3>
                <p>{{ cat.description }}</p>
                <span class="category-count">{{ cat.productCount }} products</span>
              </a>
            }
          </div>
        </section>

        <!-- Bestsellers Section -->
        <section class="bestsellers-section">
          <div class="section-header">
            <h2 class="section-title">Bestsellers</h2>
            <a routerLink="/products" class="view-all-link">View All →</a>
          </div>
          <div class="products-scroll">
            @for (p of bestsellers; track p.id) {
              <a [routerLink]="['/products', p.slug]" class="product-card-premium">
                <div class="product-image-round">
                  <img [src]="p.imageUrl" [alt]="p.name" />
                </div>
                <div class="product-info">
                  <h3>{{ p.name }}</h3>
                  <div class="product-meta">
                    <span class="product-price">{{ p.price | currency:'INR':'symbol':'1.0-0' }}</span>
                    <span class="product-rating">★ {{ p.rating }}</span>
                  </div>
                  <button class="quick-add-btn">+ Add</button>
                </div>
              </a>
            }
          </div>
        </section>

        <!-- Why Choose Us - Glassmorphism -->
        <section class="why-choose-section">
          <div class="glassmorphism-card">
            <h2 class="section-title">Why Choose Us</h2>
            <div class="features-list">
              <div class="feature-list-item">
                <span class="feature-check">✓</span>
                <span>Homemade Taste</span>
              </div>
              <div class="feature-list-item">
                <span class="feature-check">✓</span>
                <span>Freshly Packed</span>
              </div>
              <div class="feature-list-item">
                <span class="feature-check">✓</span>
                <span>Direct from Rajasthan</span>
              </div>
              <div class="feature-list-item">
                <span class="feature-check">✓</span>
                <span>Hygienically Prepared</span>
              </div>
              <div class="feature-list-item">
                <span class="feature-check">✓</span>
                <span>Premium Ingredients</span>
              </div>
              <div class="feature-list-item">
                <span class="feature-check">✓</span>
                <span>Authentic Recipes</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Features Strip -->
        <section class="features-strip">
          <div class="feature-strip-item">
            <span class="strip-icon">�</span>
            <span>Freshly Prepared</span>
          </div>
          <div class="feature-strip-item">
            <span class="strip-icon">📦</span>
            <span>Packed with Care</span>
          </div>
          <div class="feature-strip-item">
            <span class="strip-icon">🚚</span>
            <span>Delivered Fast</span>
          </div>
          <div class="feature-strip-item">
            <span class="strip-icon">👵</span>
            <span>Traditional Recipes</span>
          </div>
          <div class="feature-strip-item">
            <span class="strip-icon">👩</span>
            <span>Support Local Women</span>
          </div>
        </section>
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

    /* Sidebar - Ultra Premium */
    .sidebar {
      width: 260px;
      background: linear-gradient(180deg, var(--deep-maroon) 0%, #4A1515 100%);
      padding: 2rem 1.5rem;
      display: flex;
      flex-direction: column;
      position: fixed;
      height: 100vh;
      overflow-y: auto;
      z-index: 100;
      box-shadow: 4px 0 24px rgba(110, 31, 31, 0.15);
    }

    .sidebar-logo {
      margin-bottom: 3rem;
      display: flex;
      justify-content: center;
    }

    .logo-image {
      height: 60px;
      width: auto;
      object-fit: contain;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
    }

    .nav-item {
      padding: 1rem 1.5rem;
      border-radius: 16px;
      color: rgba(255, 255, 255, 0.85);
      text-decoration: none;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      font-size: 0.95rem;
      font-weight: 500;
      letter-spacing: 0.3px;
      border: 1px solid transparent;
    }

    .nav-item:hover {
      background: rgba(200, 154, 43, 0.15);
      color: #fff;
      transform: translateX(4px);
      border-color: rgba(200, 154, 43, 0.3);
    }

    .nav-item.active {
      background: linear-gradient(135deg, var(--royal-gold) 0%, #D4A834 100%);
      color: var(--deep-maroon);
      font-weight: 600;
      box-shadow: 0 4px 16px rgba(200, 154, 43, 0.3);
    }

    /* Main Content */
    .main-content {
      flex: 1;
      margin-left: 260px;
      overflow-y: auto;
      position: relative;
      z-index: 1;
    }

    /* Header - Minimal Luxury */
    .main-header {
      background: rgba(255, 248, 240, 0.95);
      backdrop-filter: blur(20px);
      padding: 1.25rem 2.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 20px rgba(110, 31, 31, 0.05);
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .location-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--dark-brown);
      font-size: 0.9rem;
      font-weight: 500;
    }

    .location-icon {
      font-size: 1rem;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
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
      padding: 4rem 3rem 5rem;
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
      height: 550px;
      object-fit: cover;
      border-radius: 24px;
      box-shadow: 0 24px 48px rgba(110, 31, 31, 0.12);
    }

    /* Floating Trust Cards */
    .trust-cards-section {
      padding: 2rem 3rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .trust-cards-scroll {
      display: flex;
      gap: 1rem;
      overflow-x: auto;
      padding-bottom: 1rem;
      scrollbar-width: none;
    }

    .trust-cards-scroll::-webkit-scrollbar {
      display: none;
    }

    .trust-card {
      flex-shrink: 0;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(20px);
      padding: 1.5rem 2rem;
      border-radius: 20px;
      box-shadow: var(--soft-shadow);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      border: 1px solid rgba(200, 154, 43, 0.15);
      transition: all 0.3s;
    }

    .trust-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(110, 31, 31, 0.12);
    }

    .trust-icon {
      font-size: 1.5rem;
    }

    /* Categories Section */
    .categories-section {
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

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 2rem;
    }

    .category-card {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(20px);
      padding: 2.5rem 2rem;
      text-align: center;
      border-radius: 24px;
      text-decoration: none;
      color: inherit;
      box-shadow: var(--soft-shadow);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(200, 154, 43, 0.1);
    }

    .category-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 16px 40px rgba(110, 31, 31, 0.15);
      border-color: var(--royal-gold);
    }

    .category-icon {
      font-size: 3.5rem;
      margin-bottom: 1.5rem;
    }

    .category-card h3 {
      color: var(--deep-maroon);
      margin-bottom: 0.75rem;
      font-size: 1.15rem;
      font-weight: 600;
    }

    .category-card p {
      color: var(--dark-brown);
      font-size: 0.9rem;
      margin-bottom: 1rem;
      line-height: 1.5;
      opacity: 0.75;
    }

    .category-count {
      color: var(--terracotta);
      font-size: 0.85rem;
      font-weight: 600;
    }

    /* Bestsellers - Premium Round Cards */
    .bestsellers-section {
      padding: 4rem 3rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .products-scroll {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 2rem;
    }

    .product-card-premium {
      text-decoration: none;
      color: inherit;
      display: block;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 1.5rem;
      box-shadow: var(--soft-shadow);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(200, 154, 43, 0.1);
    }

    .product-card-premium:hover {
      transform: translateY(-8px);
      box-shadow: 0 16px 40px rgba(110, 31, 31, 0.15);
    }

    .product-image-round {
      width: 120px;
      height: 120px;
      margin: 0 auto 1.5rem;
      border-radius: 50%;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(110, 31, 31, 0.12);
      border: 3px solid var(--warm-cream);
    }

    .product-image-round img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s;
    }

    .product-card-premium:hover .product-image-round img {
      transform: scale(1.1);
    }

    .product-info {
      text-align: center;
    }

    .product-info h3 {
      color: var(--deep-maroon);
      margin-bottom: 0.75rem;
      font-size: 1rem;
      font-weight: 600;
    }

    .product-meta {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .product-price {
      font-size: 1.1rem;
      color: var(--terracotta);
      font-weight: 700;
    }

    .product-rating {
      color: var(--royal-gold);
      font-size: 0.9rem;
      font-weight: 600;
    }

    .quick-add-btn {
      background: var(--deep-maroon);
      color: #fff;
      border: none;
      padding: 0.6rem 1.5rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .quick-add-btn:hover {
      background: var(--terracotta);
      transform: scale(1.05);
    }

    /* Glassmorphism Why Choose Us */
    .why-choose-section {
      padding: 5rem 3rem;
      position: relative;
    }

    .glassmorphism-card {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(40px);
      border-radius: 32px;
      padding: 4rem;
      box-shadow: var(--glass-shadow);
      border: 1px solid rgba(255, 255, 255, 0.5);
      max-width: 1000px;
      margin: 0 auto;
    }

    .why-choose-section .section-title {
      text-align: center;
      margin-bottom: 3rem;
    }

    .features-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .feature-list-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 1.1rem;
      color: var(--dark-brown);
      font-weight: 500;
    }

    .feature-check {
      color: var(--royal-gold);
      font-weight: 700;
      font-size: 1.3rem;
    }

    /* Features Strip */
    .features-strip {
      background: linear-gradient(90deg, var(--deep-maroon) 0%, var(--terracotta) 100%);
      padding: 2.5rem 3rem;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 2rem;
      box-shadow: 0 -8px 32px rgba(110, 31, 31, 0.15);
    }

    .feature-strip-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      color: #fff;
      text-align: center;
    }

    .strip-icon {
      font-size: 2rem;
    }

    .feature-strip-item span:last-child {
      font-size: 0.9rem;
      font-weight: 500;
      opacity: 0.95;
    }

    @media (max-width: 1200px) {
      .hero-content { grid-template-columns: 1fr 1fr; gap: 2.5rem; }
      .hero-image img { height: 480px; }
    }

    @media (max-width: 1024px) {
      .sidebar { width: 220px; }
      .main-content { margin-left: 220px; }
      .hero-content { grid-template-columns: 1fr; gap: 2.5rem; }
      .hero-image { order: -1; }
      .hero-image img { height: 400px; }
      .features-list { grid-template-columns: 1fr; }
      .features-strip { grid-template-columns: repeat(3, 1fr); }
      .hero-description { max-width: 100%; }
    }

    @media (max-width: 768px) {
      .sidebar { display: none; }
      .main-content { margin-left: 0; }
      .hero-section { padding: 3rem 1.5rem 4rem; }
      .hero-content { gap: 2rem; }
      .hero-image img { height: 350px; }
      .hero-features { flex-direction: column; gap: 0.75rem; }
      .features-strip { grid-template-columns: repeat(2, 1fr); }
      .products-scroll { grid-template-columns: repeat(2, 1fr); }
      .categories-grid { grid-template-columns: repeat(2, 1fr); }
      .glassmorphism-card { padding: 2.5rem 1.5rem; }
      .hero-title { font-size: 2rem; }
    }

    @media (max-width: 480px) {
      .hero-section { padding: 2rem 1rem 3rem; }
      .hero-image img { height: 300px; }
      .hero-cta-group { flex-direction: column; }
      .cta-primary, .cta-secondary { width: 100%; text-align: center; }
      .products-scroll { grid-template-columns: 1fr; }
      .categories-grid { grid-template-columns: 1fr; }
      .features-strip { grid-template-columns: 1fr; }
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
