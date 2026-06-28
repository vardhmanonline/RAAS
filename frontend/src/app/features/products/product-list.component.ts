import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Product } from '../../core/models';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  template: `
    <div class="container page">
      <h1 class="section-title">Our Products</h1>
      <p class="section-subtitle">Authentic Rajasthani flavors, delivered fresh</p>

      <div class="filters">
        <button class="filter-btn" [class.active]="!activeFilter" (click)="setFilter('')">All</button>
        <button class="filter-btn" [class.active]="activeFilter === 'bestseller'" (click)="setFilter('bestseller')">Bestseller</button>
        <button class="filter-btn" [class.active]="activeFilter === 'spicy'" (click)="setFilter('spicy')">Spicy</button>
        <button class="filter-btn" [class.active]="activeFilter === 'mild'" (click)="setFilter('mild')">Mild</button>
      </div>

      <div class="grid-2 product-grid">
        @for (p of products; track p.id) {
          <a [routerLink]="['/products', p.slug]" class="product-card card">
            <div class="product-img">
              <img [src]="p.imageUrl" [alt]="p.name" loading="lazy" />
              @if (p.isBestseller) { <span class="badge badge-saffron">Bestseller</span> }
              @if (p.compareAtPrice && p.compareAtPrice > p.price) {
                <span class="badge badge-gold discount-badge">{{ discountPercent(p) }}% OFF</span>
              }
              <span class="badge badge-maroon made-badge">Made in Rajasthan</span>
            </div>
            <div class="product-body">
              <span class="category-label">{{ p.categoryName }}</span>
              <h3>{{ p.name }}</h3>
              <div class="product-footer">
                <div>
                  <span class="price">{{ p.price | currency:'INR':'symbol':'1.0-0' }}</span>
                  @if (p.compareAtPrice) {
                    <span class="compare-price">{{ p.compareAtPrice | currency:'INR':'symbol':'1.0-0' }}</span>
                  }
                </div>
                <span class="rating">★ {{ p.rating }}</span>
              </div>
            </div>
          </a>
        } @empty {
          <p class="empty">No products found.</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 2rem 0; }
    .filters { display: flex; gap: 0.5rem; margin-bottom: 2rem; flex-wrap: wrap; }
    .filter-btn { padding: 0.5rem 1.25rem; border: 2px solid var(--cream-dark); border-radius: 50px; background: var(--white); cursor: pointer; font-weight: 500; transition: all 0.2s; }
    .filter-btn.active, .filter-btn:hover { background: var(--maroon); color: var(--white); border-color: var(--maroon); }
    .product-grid { gap: 1.25rem; }
    .product-card { text-decoration: none; color: inherit; display: flex; flex-direction: column; }
    .product-img { position: relative; aspect-ratio: 4/3; overflow: hidden; }
    .product-img img { width: 100%; height: 100%; object-fit: cover; }
    .product-img .badge { position: absolute; top: 0.75rem; left: 0.75rem; }
    .made-badge { top: auto; bottom: 0.75rem; font-size: 0.65rem; }
    .discount-badge { top: 0.75rem; right: 0.75rem; left: auto; }
    .product-body { padding: 1rem; flex: 1; display: flex; flex-direction: column; }
    .category-label { font-size: 0.75rem; color: var(--saffron); font-weight: 600; text-transform: uppercase; }
    .product-body h3 { font-size: 1.05rem; margin: 0.25rem 0 0.75rem; flex: 1; }
    .product-footer { display: flex; justify-content: space-between; align-items: center; }
    .price { font-weight: 700; color: var(--maroon); font-size: 1.15rem; }
    .compare-price { text-decoration: line-through; color: var(--text-muted); font-size: 0.85rem; margin-left: 0.5rem; }
    .rating { color: var(--gold); font-weight: 600; }
    .empty { grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted); }
  `]
})
export class ProductListComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  products: Product[] = [];
  activeFilter = '';
  category = '';

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.category = params['category'] ?? '';
      this.activeFilter = params['filter'] ?? '';
      this.loadProducts();
    });
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
    this.loadProducts();
  }

  private loadProducts() {
    let url = '/products?';
    if (this.category) url += `category=${this.category}&`;
    if (this.activeFilter) url += `filter=${this.activeFilter}`;
    this.api.get<Product[]>(url).subscribe(p => this.products = p);
  }

  discountPercent(p: Product): number {
    if (!p.compareAtPrice || p.compareAtPrice <= p.price) return 0;
    return Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100);
  }
}
