import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Category, Product } from '../../core/models';

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
    <section class="hero">
      <div class="container hero-content">
        <div class="hero-text">
          <span class="hero-badge badge badge-gold">Made in Rajasthan</span>
          <h1>Taste the Roots<br>of <em>Rajasthan</em></h1>
          <p>Authentic pickles, papads, masalas & chutneys — crafted with generations of love from desert kitchens to your table.</p>
          <div class="hero-cta">
            <a routerLink="/products" class="btn btn-primary">Shop Now</a>
            <a routerLink="/products" [queryParams]="{filter: 'bestseller'}" class="btn btn-secondary">Best Sellers</a>
          </div>
        </div>
        <div class="hero-image">
          @if (settings?.logoUrl) {
            <img [src]="settings.logoUrl" [alt]="settings?.companyName" />
          } @else {
            <img src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600" alt="Rajasthani food" />
          }
        </div>
      </div>
    </section>

    @if (settings?.mainTagline || settings?.secondaryTagline) {
      <section class="branding-section">
        <div class="container branding-content">
          @if (settings?.logoUrl) {
            <img [src]="settings.logoUrl" [alt]="settings?.companyName" class="branding-logo" />
          }
          @if (settings?.mainTagline) {
            <h2 class="main-tagline">{{ settings.mainTagline }}</h2>
          }
          @if (settings?.secondaryTagline) {
            <p class="secondary-tagline">{{ settings.secondaryTagline }}</p>
          }
          @if (settings?.websiteUrl || settings?.fssaiStatus || settings?.gstStatus || settings?.manufacturingLocation) {
            <div class="branding-badges">
              @if (settings?.websiteUrl) {
                <span class="branding-badge">{{ settings.websiteUrl }}</span>
              }
              @if (settings?.fssaiStatus) {
                <span class="branding-badge">{{ settings.fssaiStatus }}</span>
              }
              @if (settings?.gstStatus) {
                <span class="branding-badge">{{ settings.gstStatus }}</span>
              }
              @if (settings?.manufacturingLocation) {
                <span class="branding-badge">{{ settings.manufacturingLocation }}</span>
              }
            </div>
          }
        </div>
      </section>
    }

    @if (specialOffers.length > 0) {
      <section class="special-offers">
        <div class="offers-container">
          @for (offer of specialOffers; track offer.id) {
            <div class="offer-banner" [style.background]="offer.backgroundColor" [style.color]="offer.textColor">
              <div class="offer-content">
                <span class="badge {{ offer.badgeColor }}">{{ offer.badgeText }}</span>
                <h2>{{ offer.title }}</h2>
                <p>{{ offer.description }}</p>
                <a [href]="offer.buttonLink" class="btn {{ offer.buttonColor }}">{{ offer.buttonText }}</a>
              </div>
            </div>
          }
        </div>
      </section>
    }

    <section class="container section">
      <h2 class="section-title">Shop by Category</h2>
      <p class="section-subtitle">Handpicked traditional delicacies from every corner of Rajasthan</p>
      <div class="grid-3 category-grid">
        @for (cat of categories; track cat.id) {
          <a [routerLink]="['/products']" [queryParams]="{category: cat.slug}" class="category-card card">
            <div class="category-icon">{{ categoryIcon(cat.slug) }}</div>
            <h3>{{ cat.name }}</h3>
            <p>{{ cat.description }}</p>
            <span class="category-count">{{ cat.productCount }} products</span>
          </a>
        }
      </div>
    </section>

    <section class="health-strip">
      <div class="container health-grid">
        <div class="health-item">🌿 <strong>Ayurvedic</strong> — Natural healing spices</div>
        <div class="health-item">💪 <strong>Immunity</strong> — Turmeric & traditional herbs</div>
        <div class="health-item">🫁 <strong>Digestion</strong> — Probiotic-rich pickles</div>
        <div class="health-item">🌾 <strong>100% Natural</strong> — No preservatives</div>
      </div>
    </section>

    @if (bestsellers.length) {
      <section class="container section">
        <h2 class="section-title">Best Sellers</h2>
        <p class="section-subtitle">Loved by thousands across India</p>
        <div class="product-carousel">
          @for (p of bestsellers; track p.id) {
            <a [routerLink]="['/products', p.slug]" class="product-card card">
              <div class="product-img-wrap">
                <img [src]="p.imageUrl" [alt]="p.name" />
                @if (p.isBestseller) { <span class="badge badge-saffron product-badge">Bestseller</span> }
                @if (p.compareAtPrice && p.compareAtPrice > p.price) {
                  <span class="badge badge-gold product-badge off-badge">{{ discountPercent(p) }}% OFF</span>
                }
                <span class="badge badge-maroon product-badge made-in">Made in Rajasthan</span>
              </div>
              <div class="product-info">
                <h3>{{ p.name }}</h3>
                <div class="product-meta">
                  <span class="rating">★ {{ p.rating }}</span>
                  <div class="price-block">
                    <span class="price">{{ p.price | currency:'INR':'symbol':'1.0-0' }}</span>
                    @if (p.compareAtPrice && p.compareAtPrice > p.price) {
                      <span class="mrp">{{ p.compareAtPrice | currency:'INR':'symbol':'1.0-0' }}</span>
                    }
                  </div>
                </div>
              </div>
            </a>
          }
        </div>
      </section>
    }
  `,
  styles: [`
    .hero { background: linear-gradient(135deg, var(--cream) 0%, var(--cream-dark) 100%); padding: 3rem 0; overflow: hidden; }
    .hero-content { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center; }
    .hero-badge { margin-bottom: 1rem; }
    .hero h1 { font-size: clamp(2.5rem, 6vw, 3.75rem); color: var(--maroon); margin-bottom: 1rem; }
    .hero h1 em { color: var(--saffron); font-style: italic; }
    .hero p { font-size: 1.1rem; color: var(--text-muted); margin-bottom: 2rem; max-width: 480px; }
    .hero-cta { display: flex; gap: 1rem; flex-wrap: wrap; }
    .hero-image img { border-radius: var(--radius); box-shadow: var(--shadow); width: 100%; max-height: 400px; object-fit: cover; }
    .branding-section { background: var(--white); padding: 2rem 0; border-bottom: 1px solid var(--cream-dark); }
    .branding-content { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
    .branding-logo { max-width: 300px; max-height: 150px; object-fit: contain; }
    .main-tagline { font-size: 1.5rem; color: var(--maroon); font-family: var(--font-display); margin: 0; }
    .secondary-tagline { font-size: 1.1rem; color: var(--text-muted); margin: 0; font-style: italic; }
    .branding-badges { display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center; margin-top: 0.5rem; }
    .branding-badge { background: var(--maroon); color: var(--cream); padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.8rem; }
    .special-offers { padding: 0; }
    .offers-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; }
    .offer-banner { padding: 2.5rem 2rem; min-height: 180px; display: flex; align-items: center; justify-content: center; }
    .offer-content { text-align: center; max-width: 500px; }
    .offer-content .badge { display: inline-block; margin-bottom: 1rem; }
    .offer-content h2 { font-size: 1.75rem; margin: 0.75rem 0; }
    .offer-content p { opacity: 0.9; margin-bottom: 1.5rem; line-height: 1.5; }
    .section { padding: 3rem 0; }
    .category-card { padding: 2rem 1.5rem; text-align: center; text-decoration: none; color: inherit; }
    .category-icon { font-size: 2.5rem; margin-bottom: 1rem; }
    .category-card h3 { color: var(--maroon); margin-bottom: 0.5rem; }
    .category-card p { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 0.75rem; }
    .category-count { color: var(--saffron); font-size: 0.85rem; font-weight: 600; }
    .health-strip { background: var(--maroon); padding: 1.25rem 0; }
    .health-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; text-align: center; color: var(--cream); font-size: 0.9rem; }
    .product-carousel { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.25rem; }
    .product-card { text-decoration: none; color: inherit; }
    .product-img-wrap { position: relative; aspect-ratio: 1; overflow: hidden; }
    .product-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
    .product-badge { position: absolute; top: 0.75rem; left: 0.75rem; }
    .made-in { top: auto; bottom: 0.75rem; left: 0.75rem; font-size: 0.65rem; }
    .off-badge { top: 0.75rem; right: 0.75rem; left: auto; }
    .price-block { display: flex; flex-direction: column; align-items: flex-end; }
    .mrp { text-decoration: line-through; color: var(--text-muted); font-size: 0.8rem; }
    .product-info { padding: 1rem; }
    .product-info h3 { font-size: 1rem; margin-bottom: 0.5rem; }
    .product-meta { display: flex; justify-content: space-between; align-items: center; }
    .rating { color: var(--gold); font-weight: 600; }
    .price { font-weight: 700; color: var(--maroon); font-size: 1.1rem; }
    @media (max-width: 768px) {
      .hero-content { grid-template-columns: 1fr; }
      .hero-image { order: -1; }
      .health-grid { grid-template-columns: 1fr 1fr; }
      .offers-container { grid-template-columns: 1fr; }
      .branding-badges { grid-template-columns: 1fr 1fr; }
    }
  `]
})
export class HomeComponent implements OnInit {
  private api = inject(ApiService);
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
