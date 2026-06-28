import { Component, OnInit, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { CartService } from '../../core/services/cart.service';
import { AnalyticsTracker } from '../../core/services/analytics-tracker.service';
import { ProductDetail } from '../../core/models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    @if (product) {
      <div class="container page">
        <div class="product-layout">
          <div class="gallery">
            <img [src]="selectedImage" [alt]="product.name" class="main-image" />
            <div class="thumbnails">
              @for (img of allImages; track img) {
                <img [src]="img" (click)="selectedImage = img" [class.active]="selectedImage === img" />
              }
            </div>
          </div>
          <div class="product-details">
            <span class="badge badge-maroon">Made in Rajasthan</span>
            @if (product.isBestseller) { <span class="badge badge-saffron">Bestseller</span> }
            <h1>{{ product.name }}</h1>
            <div class="rating-row">★ {{ product.rating }} ({{ product.reviewCount }} reviews) · {{ product.spiceLevel }}</div>
            <div class="price-row">
              <span class="price">{{ product.price | currency:'INR':'symbol':'1.0-0' }}</span>
              @if (product.compareAtPrice && product.compareAtPrice > product.price) {
                <span class="compare">MRP {{ product.compareAtPrice | currency:'INR':'symbol':'1.0-0' }}</span>
                <span class="save">{{ discountPercent }}% OFF · Save {{ product.compareAtPrice - product.price | currency:'INR':'symbol':'1.0-0' }}</span>
              }
            </div>
            <p class="desc">{{ product.description }}</p>
            <div class="qty-row">
              <label>Quantity</label>
              <div class="qty-control">
                <button (click)="qty = Math.max(1, qty - 1)">−</button>
                <span>{{ qty }}</span>
                <button (click)="qty = Math.min(product.stock, qty + 1)">+</button>
              </div>
              <span class="stock">{{ product.stock }} in stock</span>
            </div>
          </div>
        </div>

        <section class="story-section card">
          <h2>From Rajasthan Kitchens</h2>
          <p>{{ product.story }}</p>
        </section>

        <div class="info-grid">
          <section class="card info-card">
            <h3>🌿 Health Benefits</h3>
            <p>{{ product.healthBenefits }}</p>
          </section>
          <section class="card info-card">
            <h3>🍽️ Usage Suggestions</h3>
            <p>{{ product.usageSuggestions }}</p>
          </section>
          <section class="card info-card">
            <h3>📋 Ingredients</h3>
            <p>{{ product.ingredients }}</p>
          </section>
        </div>
      </div>

      <div class="sticky-cta">
        <button class="btn btn-secondary" (click)="addToCart()">Add to Cart</button>
        <button class="btn btn-primary" (click)="buyNow()">Buy Now — {{ (product.price * qty) | currency:'INR':'symbol':'1.0-0' }}</button>
      </div>
    } @else if (loading) {
      <div class="container page"><div class="skeleton" style="height:400px"></div></div>
    }
  `,
  styles: [`
    .page { padding: 2rem 0 6rem; }
    .product-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; margin-bottom: 2rem; }
    .main-image { width: 100%; border-radius: var(--radius); aspect-ratio: 1; object-fit: cover; box-shadow: var(--shadow); }
    .thumbnails { display: flex; gap: 0.5rem; margin-top: 0.75rem; }
    .thumbnails img { width: 72px; height: 72px; object-fit: cover; border-radius: var(--radius-sm); cursor: pointer; border: 2px solid transparent; opacity: 0.7; }
    .thumbnails img.active { border-color: var(--maroon); opacity: 1; }
    .product-details h1 { font-size: 2rem; color: var(--maroon); margin: 0.75rem 0; }
    .rating-row { color: var(--text-muted); margin-bottom: 1rem; }
    .price-row { margin-bottom: 1.5rem; }
    .price { font-size: 2rem; font-weight: 700; color: var(--maroon); }
    .compare { text-decoration: line-through; color: var(--text-muted); margin-left: 0.75rem; }
    .save { color: var(--success); font-weight: 600; margin-left: 0.75rem; font-size: 0.9rem; }
    .desc { color: var(--text-muted); line-height: 1.8; margin-bottom: 1.5rem; }
    .qty-row { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
    .qty-control { display: flex; align-items: center; border: 2px solid var(--cream-dark); border-radius: var(--radius-sm); overflow: hidden; }
    .qty-control button { width: 40px; height: 40px; border: none; background: var(--cream); cursor: pointer; font-size: 1.25rem; }
    .qty-control span { width: 40px; text-align: center; font-weight: 600; }
    .stock { color: var(--text-muted); font-size: 0.85rem; }
    .story-section { padding: 2rem; margin-bottom: 1.5rem; }
    .story-section h2 { color: var(--maroon); margin-bottom: 1rem; }
    .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
    .info-card { padding: 1.5rem; }
    .info-card h3 { margin-bottom: 0.75rem; font-size: 1.1rem; }
    .info-card p { color: var(--text-muted); font-size: 0.95rem; line-height: 1.7; }
    @media (max-width: 768px) {
      .product-layout, .info-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  slug = input.required<string>();
  private api = inject(ApiService);
  private cart = inject(CartService);
  private tracker = inject(AnalyticsTracker);
  private router = inject(Router);

  product: ProductDetail | null = null;
  loading = true;
  selectedImage = '';
  allImages: string[] = [];
  qty = 1;
  Math = Math;

  get discountPercent(): number {
    if (!this.product?.compareAtPrice || this.product.compareAtPrice <= this.product.price) return 0;
    return Math.round(((this.product.compareAtPrice - this.product.price) / this.product.compareAtPrice) * 100);
  }

  ngOnInit() {
    this.api.get<ProductDetail>(`/products/${this.slug()}`).subscribe({
      next: p => {
        this.product = p;
        this.allImages = [p.imageUrl, ...(p.galleryUrls ?? [])];
        this.selectedImage = p.imageUrl;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  addToCart() {
    if (!this.product) return;
    this.cart.addItem({
      productId: this.product.id,
      productName: this.product.name,
      imageUrl: this.product.imageUrl,
      unitPrice: this.product.price
    }, this.qty);
    this.tracker.track('AddedToCart', this.product.id);
  }

  buyNow() {
    this.addToCart();
    this.router.navigate(['/checkout']);
  }
}
