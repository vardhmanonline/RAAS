import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Category, Product } from '../../core/models';

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
          <img src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600" alt="Rajasthani food" />
        </div>
      </div>
    </section>

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

    <section class="festival-offer">
      <div class="container offer-content">
        <div>
          <span class="badge badge-gold">Festival Offer</span>
          <h2>Diwali Special Combos</h2>
          <p>Up to 25% off on curated gift packs. Perfect for gifting!</p>
          <a routerLink="/products" [queryParams]="{category: 'combos'}" class="btn btn-gold">Explore Combos</a>
        </div>
      </div>
    </section>
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
    .festival-offer { background: linear-gradient(135deg, var(--maroon), var(--maroon-dark)); padding: 3rem 0; margin-top: 2rem; }
    .offer-content { color: var(--cream); }
    .offer-content h2 { font-size: 2rem; margin: 1rem 0; }
    .offer-content p { opacity: 0.9; margin-bottom: 1.5rem; }
    @media (max-width: 768px) {
      .hero-content { grid-template-columns: 1fr; }
      .hero-image { order: -1; }
      .health-grid { grid-template-columns: 1fr 1fr; }
    }
  `]
})
export class HomeComponent implements OnInit {
  private api = inject(ApiService);
  categories: Category[] = [];
  bestsellers: Product[] = [];

  ngOnInit() {
    this.api.get<Category[]>('/products/categories').subscribe(c => this.categories = c);
    this.api.get<Product[]>('/products?filter=bestseller').subscribe(p => this.bestsellers = p);
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
