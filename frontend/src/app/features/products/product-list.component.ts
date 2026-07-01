import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Product, Category } from '../../core/models';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, FormsModule],
  template: `
    <div class="products-page">
      <div class="container">
        <div class="page-header">
          <div>
            <h1 class="section-title">Rajasthani Snacks</h1>
            <p class="section-subtitle">Authentic flavors from the heart of Rajasthan</p>
          </div>
          <div class="search-box">
            <input 
              type="text" 
              [(ngModel)]="searchQuery" 
              (input)="onSearch()"
              placeholder="Search snacks..." 
              class="search-input"
            />
            <span class="search-icon">🔍</span>
          </div>
        </div>

        <div class="products-layout">
          <aside class="sidebar">
            <div class="filter-section">
              <h3>Categories</h3>
              <div class="category-list">
                <a 
                  (click)="setCategory('')"
                  [class.active]="!selectedCategory"
                  class="category-link">
                  All Snacks
                </a>
                @for (cat of categories; track cat.id) {
                  <a 
                    (click)="setCategory(cat.slug)"
                    [class.active]="selectedCategory === cat.slug"
                    class="category-link">
                    {{ cat.name }}
                    <span class="count">{{ cat.productCount }}</span>
                  </a>
                }
              </div>
            </div>

            <div class="filter-section">
              <h3>Quick Filters</h3>
              <div class="filter-list">
                <label class="filter-item">
                  <input type="checkbox" [(ngModel)]="filters.bestseller" (change)="applyFilters()" />
                  <span>Bestsellers</span>
                </label>
                <label class="filter-item">
                  <input type="checkbox" [(ngModel)]="filters.spicy" (change)="applyFilters()" />
                  <span>Spicy</span>
                </label>
                <label class="filter-item">
                  <input type="checkbox" [(ngModel)]="filters.mild" (change)="applyFilters()" />
                  <span>Mild</span>
                </label>
                <label class="filter-item">
                  <input type="checkbox" [(ngModel)]="filters.newArrival" (change)="applyFilters()" />
                  <span>New Arrivals</span>
                </label>
                <label class="filter-item">
                  <input type="checkbox" [(ngModel)]="filters.onSale" (change)="applyFilters()" />
                  <span>On Sale</span>
                </label>
              </div>
            </div>

            <div class="filter-section">
              <h3>Price Range</h3>
              <div class="price-filter">
                <div class="price-inputs">
                  <input 
                    type="number" 
                    [(ngModel)]="filters.minPrice" 
                    (change)="applyFilters()"
                    placeholder="Min" 
                    class="price-input"
                  />
                  <span>-</span>
                  <input 
                    type="number" 
                    [(ngModel)]="filters.maxPrice" 
                    (change)="applyFilters()"
                    placeholder="Max" 
                    class="price-input"
                  />
                </div>
                <button class="btn btn-secondary btn-sm" (click)="clearPriceFilter()">Clear</button>
              </div>
            </div>

            @if (activeFiltersCount > 0) {
              <button class="btn btn-outline btn-sm clear-all-btn" (click)="clearAllFilters()">
                Clear All Filters ({{ activeFiltersCount }})
              </button>
            }
          </aside>

          <main class="products-main">
            <div class="results-header">
              <span class="results-count">{{ filteredProducts.length }} products found</span>
              <select [(ngModel)]="sortBy" (change)="sortProducts()" class="sort-select">
                <option value="default">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            <div class="grid-3 product-grid">
              @for (p of filteredProducts; track p.id) {
                <a [routerLink]="['/products', p.slug]" class="product-card card">
                  <div class="product-img">
                    <img [src]="p.imageUrl" [alt]="p.name" loading="lazy" />
                    @if (p.isBestseller) { <span class="badge badge-saffron">Bestseller</span> }
                    @if (p.compareAtPrice && p.compareAtPrice > p.price) {
                      <span class="badge badge-gold discount-badge">{{ discountPercent(p) }}% OFF</span>
                    }
                    @if (p.isNew) { <span class="badge badge-maroon new-badge">New</span> }
                    <span class="badge badge-cream made-badge">Made in Rajasthan</span>
                  </div>
                  <div class="product-body">
                    <span class="category-label">{{ p.categoryName }}</span>
                    <h3>{{ p.name }}</h3>
                    <p class="product-description">{{ p.description }}</p>
                    <div class="product-footer">
                      <div class="price-block">
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
                <div class="empty-state">
                  <div class="empty-icon">🔍</div>
                  <h3>No products found</h3>
                  <p>Try adjusting your filters or search terms</p>
                  <button class="btn btn-primary" (click)="clearAllFilters()">Clear All Filters</button>
                </div>
              }
            </div>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .products-page { padding: 2rem 0; min-height: calc(100vh - 200px); }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 2rem; margin-bottom: 2rem; flex-wrap: wrap; }
    .section-title { color: var(--maroon); margin-bottom: 0.5rem; }
    .section-subtitle { color: var(--text-muted); margin: 0; }
    .search-box { position: relative; width: 300px; }
    .search-input { width: 100%; padding: 0.75rem 2.5rem 0.75rem 1rem; border: 2px solid var(--cream-dark); border-radius: var(--radius-sm); font-size: 0.95rem; }
    .search-input:focus { outline: none; border-color: var(--maroon); }
    .search-icon { position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); pointer-events: none; }
    .products-layout { display: grid; grid-template-columns: 280px 1fr; gap: 2rem; }
    .sidebar { position: sticky; top: 100px; height: fit-content; }
    .filter-section { margin-bottom: 2rem; }
    .filter-section h3 { color: var(--maroon); font-size: 1rem; margin-bottom: 1rem; font-family: var(--font-display); }
    .category-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .category-link { display: flex; justify-content: space-between; align-items: center; padding: 0.6rem 0.75rem; border-radius: var(--radius-sm); color: var(--text-muted); text-decoration: none; transition: all 0.2s; cursor: pointer; }
    .category-link:hover { background: var(--cream); color: var(--maroon); }
    .category-link.active { background: var(--maroon); color: var(--white); }
    .category-link .count { font-size: 0.8rem; opacity: 0.7; }
    .filter-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .filter-item { display: flex; align-items: center; gap: 0.75rem; cursor: pointer; }
    .filter-item input[type="checkbox"] { accent-color: var(--maroon); width: 18px; height: 18px; }
    .filter-item span { color: var(--text-muted); }
    .price-filter { display: flex; flex-direction: column; gap: 0.75rem; }
    .price-inputs { display: flex; align-items: center; gap: 0.5rem; }
    .price-input { width: 80px; padding: 0.5rem; border: 1px solid var(--cream-dark); border-radius: var(--radius-sm); font-size: 0.9rem; }
    .price-input:focus { outline: none; border-color: var(--maroon); }
    .clear-all-btn { width: 100%; margin-top: 1rem; }
    .products-main { min-height: 500px; }
    .results-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .results-count { color: var(--text-muted); font-size: 0.9rem; }
    .sort-select { padding: 0.5rem 1rem; border: 1px solid var(--cream-dark); border-radius: var(--radius-sm); background: var(--white); cursor: pointer; }
    .product-grid { gap: 1.5rem; }
    .product-card { text-decoration: none; color: inherit; display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s; }
    .product-card:hover { transform: translateY(-4px); box-shadow: var(--shadow); }
    .product-img { position: relative; aspect-ratio: 1; overflow: hidden; border-radius: var(--radius-sm) var(--radius-sm) 0 0; }
    .product-img img { width: 100%; height: 100%; object-fit: cover; }
    .product-img .badge { position: absolute; top: 0.5rem; left: 0.5rem; font-size: 0.7rem; padding: 0.25rem 0.5rem; }
    .made-badge { top: auto; bottom: 0.5rem; left: 0.5rem; right: auto; background: var(--cream-dark); color: var(--maroon); }
    .discount-badge { top: 0.5rem; right: 0.5rem; left: auto; }
    .new-badge { top: 0.5rem; left: 0.5rem; }
    .product-body { padding: 1rem; flex: 1; display: flex; flex-direction: column; }
    .category-label { font-size: 0.7rem; color: var(--saffron); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .product-body h3 { font-size: 1rem; margin: 0.25rem 0 0.5rem; flex: 1; line-height: 1.3; }
    .product-description { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .product-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 0.75rem; border-top: 1px solid var(--cream-dark); }
    .price-block { display: flex; flex-direction: column; }
    .price { font-weight: 700; color: var(--maroon); font-size: 1.1rem; }
    .compare-price { text-decoration: line-through; color: var(--text-muted); font-size: 0.8rem; }
    .rating { color: var(--gold); font-weight: 600; font-size: 0.9rem; }
    .empty-state { grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; }
    .empty-icon { font-size: 4rem; margin-bottom: 1rem; }
    .empty-state h3 { color: var(--maroon); margin-bottom: 0.5rem; }
    .empty-state p { color: var(--text-muted); margin-bottom: 1.5rem; }
    @media (max-width: 1024px) { .products-layout { grid-template-columns: 1fr; } .sidebar { display: none; } }
    @media (max-width: 768px) { .page-header { flex-direction: column; } .search-box { width: 100%; } .product-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 480px) { .product-grid { grid-template-columns: 1fr; } }
  `]
})
export class ProductListComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  products: Product[] = [];
  categories: Category[] = [];
  filteredProducts: Product[] = [];
  selectedCategory = '';
  searchQuery = '';
  sortBy = 'default';
  
  filters = {
    bestseller: false,
    spicy: false,
    mild: false,
    newArrival: false,
    onSale: false,
    minPrice: null as number | null,
    maxPrice: null as number | null
  };

  ngOnInit() {
    this.api.get<Category[]>('/products/categories').subscribe(c => this.categories = c);
    this.route.queryParams.subscribe(params => {
      this.selectedCategory = params['category'] ?? '';
      this.searchQuery = params['search'] ?? '';
      this.loadProducts();
    });
  }

  loadProducts() {
    let url = '/products?';
    if (this.selectedCategory) url += `category=${this.selectedCategory}&`;
    this.api.get<Product[]>(url).subscribe(p => {
      this.products = p;
      this.applyFilters();
    });
  }

  setCategory(category: string) {
    this.selectedCategory = category;
    this.loadProducts();
  }

  onSearch() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(p => {
      // Search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        if (!p.name.toLowerCase().includes(query) && 
            !(p.description?.toLowerCase().includes(query) ?? false) &&
            !p.categoryName.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Checkbox filters
      if (this.filters.bestseller && !p.isBestseller) return false;
      if (this.filters.spicy && !p.tags?.includes('spicy')) return false;
      if (this.filters.mild && !p.tags?.includes('mild')) return false;
      if (this.filters.newArrival && !p.isNew) return false;
      if (this.filters.onSale && (!p.compareAtPrice || p.compareAtPrice <= p.price)) return false;

      // Price range filter
      if (this.filters.minPrice && p.price < this.filters.minPrice) return false;
      if (this.filters.maxPrice && p.price > this.filters.maxPrice) return false;

      return true;
    });

    this.sortProducts();
  }

  sortProducts() {
    switch (this.sortBy) {
      case 'price-low':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        this.filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        this.filteredProducts.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      default:
        // Keep original order (featured)
        break;
    }
  }

  clearPriceFilter() {
    this.filters.minPrice = null;
    this.filters.maxPrice = null;
    this.applyFilters();
  }

  clearAllFilters() {
    this.searchQuery = '';
    this.filters = {
      bestseller: false,
      spicy: false,
      mild: false,
      newArrival: false,
      onSale: false,
      minPrice: null,
      maxPrice: null
    };
    this.sortBy = 'default';
    this.applyFilters();
  }

  get activeFiltersCount(): number {
    let count = 0;
    if (this.searchQuery) count++;
    if (this.filters.bestseller) count++;
    if (this.filters.spicy) count++;
    if (this.filters.mild) count++;
    if (this.filters.newArrival) count++;
    if (this.filters.onSale) count++;
    if (this.filters.minPrice || this.filters.maxPrice) count++;
    return count;
  }

  discountPercent(p: Product): number {
    if (!p.compareAtPrice || p.compareAtPrice <= p.price) return 0;
    return Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100);
  }
}
