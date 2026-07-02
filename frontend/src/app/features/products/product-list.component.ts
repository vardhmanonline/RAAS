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
      <!-- Decorative Background Pattern -->
      <div class="background-pattern"></div>
      
      <div class="container">
        <!-- Hero Header -->
        <div class="page-header">
          <div class="header-content">
            <div class="header-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2"/>
              </svg>
              <span>Premium Quality</span>
            </div>
            <h1 class="section-title">Rajasthani Snacks</h1>
            <p class="section-subtitle">Authentic flavors from the heart of Rajasthan, crafted with love and tradition</p>
          </div>
          <div class="search-box">
            <input 
              type="text" 
              [(ngModel)]="searchQuery" 
              (input)="onSearch()"
              placeholder="Search our collection..." 
              class="search-input"
            />
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
        </div>

        <!-- Mobile Filter Toggle -->
        <div class="mobile-filter-bar">
          <button class="mobile-filter-btn" (click)="showMobileFilters = !showMobileFilters">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 4h18M7 9h10M10 14h4M12 19h0"/>
            </svg>
            Filters
            @if (activeFiltersCount > 0) {
              <span class="mobile-filter-count">{{ activeFiltersCount }}</span>
            }
          </button>
          <div class="mobile-results-info">{{ filteredProducts.length }} products</div>
        </div>

        <div class="products-layout">
          <!-- Premium Sidebar -->
          <aside class="sidebar" [class.mobile-open]="showMobileFilters">
            <div class="filter-section glass-effect">
              <div class="section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 3h18v18H3zM9 9h6M9 13h6M9 17h4"/>
                </svg>
              </div>
              <h3>Categories</h3>
              <div class="category-list">
                <a 
                  (click)="setCategory('')"
                  [class.active]="!selectedCategory"
                  class="category-link">
                  <div class="category-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 3h18v18H3zM9 9h6M9 13h6M9 17h4"/>
                    </svg>
                  </div>
                  <span>All Snacks</span>
                  <span class="count">{{ products.length }}</span>
                </a>
                @for (cat of categories; track cat.id) {
                  <a 
                    (click)="setCategory(cat.slug)"
                    [class.active]="selectedCategory === cat.slug"
                    class="category-link">
                    <div class="category-icon">
                      @if (cat.svgIcon) {
                        <div [innerHTML]="cat.svgIcon"></div>
                      } @else {
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M12 6v6l4 2"/>
                        </svg>
                      }
                    </div>
                    <span>{{ cat.name }}</span>
                    <span class="count">{{ cat.productCount }}</span>
                  </a>
                }
              </div>
            </div>

            <div class="filter-section glass-effect">
              <div class="section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2"/>
                </svg>
              </div>
              <h3>Quick Filters</h3>
              <div class="filter-list">
                <label class="filter-item">
                  <input type="checkbox" [(ngModel)]="filters.bestseller" (change)="applyFilters()" />
                  <span class="filter-label">Bestsellers</span>
                  <span class="filter-icon">⭐</span>
                </label>
                <label class="filter-item">
                  <input type="checkbox" [(ngModel)]="filters.spicy" (change)="applyFilters()" />
                  <span class="filter-label">Spicy</span>
                  <span class="filter-icon">🌶️</span>
                </label>
                <label class="filter-item">
                  <input type="checkbox" [(ngModel)]="filters.mild" (change)="applyFilters()" />
                  <span class="filter-label">Mild</span>
                  <span class="filter-icon">🌿</span>
                </label>
                <label class="filter-item">
                  <input type="checkbox" [(ngModel)]="filters.newArrival" (change)="applyFilters()" />
                  <span class="filter-label">New Arrivals</span>
                  <span class="filter-icon">✨</span>
                </label>
                <label class="filter-item">
                  <input type="checkbox" [(ngModel)]="filters.onSale" (change)="applyFilters()" />
                  <span class="filter-label">On Sale</span>
                  <span class="filter-icon">🏷️</span>
                </label>
              </div>
            </div>

            <div class="filter-section glass-effect">
              <div class="section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <h3>Price Range</h3>
              <div class="price-filter">
                <div class="price-inputs">
                  <div class="price-input-wrapper">
                    <span class="price-label">Min</span>
                    <input 
                      type="number" 
                      [(ngModel)]="filters.minPrice" 
                      (change)="applyFilters()"
                      placeholder="0" 
                      class="price-input"
                    />
                  </div>
                  <div class="price-divider">—</div>
                  <div class="price-input-wrapper">
                    <span class="price-label">Max</span>
                    <input 
                      type="number" 
                      [(ngModel)]="filters.maxPrice" 
                      (change)="applyFilters()"
                      placeholder="∞" 
                      class="price-input"
                    />
                  </div>
                </div>
                <button class="btn-clear" (click)="clearPriceFilter()">Clear Price</button>
              </div>
            </div>

            @if (activeFiltersCount > 0) {
              <button class="btn-clear-all" (click)="clearAllFilters()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
                Clear All Filters ({{ activeFiltersCount }})
              </button>
            }
          </aside>

          <!-- Products Grid -->
          <main class="products-main">
            <div class="results-header">
              <div class="results-info">
                <span class="results-count">{{ filteredProducts.length }} products</span>
                <span class="results-divider">•</span>
                <span class="results-text">Handpicked for you</span>
              </div>
              <div class="sort-wrapper">
                <svg class="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 4h18M3 8h18M3 12h18M3 16h18M3 20h18"/>
                </svg>
                <select [(ngModel)]="sortBy" (change)="sortProducts()" class="sort-select">
                  <option value="default">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            <div class="product-grid">
              @for (p of filteredProducts; track p.id) {
                <a [routerLink]="['/products', p.slug]" class="product-card">
                  <div class="product-image-container">
                    <img [src]="p.imageUrl" [alt]="p.name" loading="lazy" class="product-image" />
                    <div class="product-badges">
                      @if (p.isBestseller) { 
                        <span class="badge badge-bestseller">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2"/>
                          </svg>
                          Bestseller
                        </span> 
                      }
                      @if (p.compareAtPrice && p.compareAtPrice > p.price) {
                        <span class="badge badge-discount">{{ discountPercent(p) }}% OFF</span>
                      }
                      @if (p.isNew) { <span class="badge badge-new">New</span> }
                    </div>
                    <div class="product-overlay">
                      <div class="overlay-content">
                        <span class="view-text">Quick View</span>
                      </div>
                    </div>
                  </div>
                  <div class="product-details">
                    <div class="product-category">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 3h18v18H3zM9 9h6M9 13h6M9 17h4"/>
                      </svg>
                      {{ p.categoryName }}
                    </div>
                    <h3 class="product-name">{{ p.name }}</h3>
                    <p class="product-description">{{ p.description }}</p>
                    <div class="product-meta">
                      <div class="price-section">
                        <span class="current-price">{{ p.price | currency:'INR':'symbol':'1.0-0' }}</span>
                        @if (p.compareAtPrice) {
                          <span class="original-price">{{ p.compareAtPrice | currency:'INR':'symbol':'1.0-0' }}</span>
                        }
                      </div>
                      <div class="rating-section">
                        <svg class="star-icon" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2"/>
                        </svg>
                        <span>{{ p.rating }}</span>
                      </div>
                    </div>
                  </div>
                </a>
              } @empty {
                <div class="empty-state">
                  <div class="empty-illustration">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="M21 21l-4.35-4.35"/>
                      <path d="M11 8v6M8 11h6"/>
                    </svg>
                  </div>
                  <h3>No products found</h3>
                  <p>We couldn't find any products matching your criteria</p>
                  <button class="btn-primary" (click)="clearAllFilters()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                    Clear All Filters
                  </button>
                </div>
              }
            </div>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Premium Color Variables */
    :host {
      --ivory: #FFF8F0;
      --warm-cream: #F7E9D7;
      --deep-maroon: #6E1F1F;
      --royal-gold: #C89A2B;
      --terracotta: #B65A2A;
      --saffron: #FF9933;
      --soft-shadow: 0 8px 32px rgba(110, 31, 31, 0.08);
      --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    /* Products Page */
    .products-page {
      padding: 2rem 0;
      min-height: calc(100vh - 200px);
      position: relative;
      background: var(--ivory);
    }

    /* Background Pattern */
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

    .container {
      position: relative;
      z-index: 1;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    /* Page Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 2rem;
      margin-bottom: 3rem;
      flex-wrap: wrap;
    }

    .header-content {
      flex: 1;
    }

    .header-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: linear-gradient(135deg, var(--royal-gold) 0%, var(--terracotta) 100%);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 1rem;
      box-shadow: 0 4px 12px rgba(200, 154, 43, 0.3);
    }

    .header-badge svg {
      width: 16px;
      height: 16px;
    }

    .section-title {
      color: var(--deep-maroon);
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      line-height: 1.2;
      font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .section-subtitle {
      color: #4F3D2F;
      font-size: 1.1rem;
      margin: 0;
      line-height: 1.5;
    }

    /* Search Box */
    .search-box {
      position: relative;
      width: 350px;
    }

    .search-input {
      width: 100%;
      padding: 1rem 3rem 1rem 1.5rem;
      border: 2px solid rgba(110, 31, 31, 0.1);
      border-radius: 50px;
      font-size: 0.95rem;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
      box-shadow: var(--soft-shadow);
    }

    .search-input:focus {
      outline: none;
      border-color: var(--deep-maroon);
      box-shadow: 0 8px 24px rgba(110, 31, 31, 0.15);
    }

    .search-icon {
      position: absolute;
      right: 1.25rem;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      color: var(--deep-maroon);
      pointer-events: none;
    }

    /* Products Layout */
    .products-layout {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 2.5rem;
    }

    /* Sidebar */
    .sidebar {
      position: sticky;
      top: 100px;
      height: fit-content;
    }

    .filter-section {
      margin-bottom: 2rem;
      padding: 1.5rem;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(200, 154, 43, 0.1);
      box-shadow: var(--soft-shadow);
    }

    .section-icon {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--royal-gold) 0%, var(--terracotta) 100%);
      border-radius: 10px;
      margin-bottom: 1rem;
      color: white;
    }

    .section-icon svg {
      width: 18px;
      height: 18px;
    }

    .filter-section h3 {
      color: var(--deep-maroon);
      font-size: 1.1rem;
      margin-bottom: 1.25rem;
      font-weight: 600;
      font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    /* Category List */
    .category-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .category-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: 12px;
      color: #4F3D2F;
      text-decoration: none;
      transition: all 0.3s ease;
      cursor: pointer;
      background: transparent;
    }

    .category-link:hover {
      background: rgba(200, 154, 43, 0.1);
      color: var(--deep-maroon);
      transform: translateX(4px);
    }

    .category-link.active {
      background: linear-gradient(135deg, var(--deep-maroon) 0%, var(--terracotta) 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(110, 31, 31, 0.3);
    }

    .category-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .category-icon svg {
      width: 100%;
      height: 100%;
    }

    .category-link span {
      flex: 1;
      font-weight: 500;
    }

    .category-link .count {
      font-size: 0.8rem;
      opacity: 0.7;
      background: rgba(255, 255, 255, 0.2);
      padding: 0.2rem 0.5rem;
      border-radius: 10px;
    }

    /* Filter List */
    .filter-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .filter-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .filter-item:hover {
      background: rgba(200, 154, 43, 0.05);
    }

    .filter-item input[type="checkbox"] {
      accent-color: var(--deep-maroon);
      width: 20px;
      height: 20px;
      cursor: pointer;
    }

    .filter-label {
      flex: 1;
      color: #4F3D2F;
      font-weight: 500;
    }

    .filter-icon {
      font-size: 1rem;
    }

    /* Price Filter */
    .price-filter {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .price-inputs {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .price-input-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .price-label {
      font-size: 0.75rem;
      color: #6F5A49;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .price-input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid rgba(110, 31, 31, 0.1);
      border-radius: 10px;
      font-size: 0.9rem;
      background: rgba(255, 255, 255, 0.9);
      transition: all 0.3s ease;
    }

    .price-input:focus {
      outline: none;
      border-color: var(--deep-maroon);
    }

    .price-divider {
      color: var(--deep-maroon);
      font-weight: 600;
      font-size: 1.2rem;
    }

    .btn-clear {
      padding: 0.75rem 1.5rem;
      background: rgba(110, 31, 31, 0.1);
      color: var(--deep-maroon);
      border: none;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-clear:hover {
      background: var(--deep-maroon);
      color: white;
    }

    .btn-clear-all {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, var(--deep-maroon) 0%, var(--terracotta) 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(110, 31, 31, 0.3);
    }

    .btn-clear-all:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(110, 31, 31, 0.4);
    }

    .btn-clear-all svg {
      width: 18px;
      height: 18px;
    }

    /* Products Main */
    .products-main {
      min-height: 500px;
    }

    /* Results Header */
    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid rgba(200, 154, 43, 0.1);
    }

    .results-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .results-count {
      color: var(--deep-maroon);
      font-weight: 600;
      font-size: 1rem;
    }

    .results-divider {
      color: var(--royal-gold);
    }

    .results-text {
      color: #6F5A49;
      font-size: 0.9rem;
    }

    .sort-wrapper {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .sort-icon {
      width: 18px;
      height: 18px;
      color: var(--deep-maroon);
    }

    .sort-select {
      padding: 0.75rem 1.5rem;
      border: 2px solid rgba(110, 31, 31, 0.1);
      border-radius: 50px;
      background: rgba(255, 255, 255, 0.9);
      cursor: pointer;
      font-size: 0.9rem;
      color: var(--deep-maroon);
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .sort-select:focus {
      outline: none;
      border-color: var(--deep-maroon);
    }

    /* Product Grid */
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 2rem;
    }

    /* Product Card */
    .product-card {
      text-decoration: none;
      color: inherit;
      display: flex;
      flex-direction: column;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 20px;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(200, 154, 43, 0.1);
      box-shadow: var(--soft-shadow);
    }

    .product-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 16px 40px rgba(110, 31, 31, 0.15);
    }

    /* Product Image Container */
    .product-image-container {
      position: relative;
      aspect-ratio: 1;
      overflow: hidden;
    }

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s ease;
    }

    .product-card:hover .product-image {
      transform: scale(1.1);
    }

    /* Product Badges */
    .product-badges {
      position: absolute;
      top: 1rem;
      left: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      z-index: 2;
    }

    .badge {
      font-size: 0.7rem;
      font-weight: 600;
      padding: 0.4rem 0.75rem;
      border-radius: 20px;
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .badge-bestseller {
      background: linear-gradient(135deg, var(--royal-gold) 0%, var(--terracotta) 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(200, 154, 43, 0.3);
    }

    .badge-bestseller svg {
      width: 12px;
      height: 12px;
    }

    .badge-discount {
      background: linear-gradient(135deg, var(--saffron) 0%, var(--terracotta) 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(255, 153, 51, 0.3);
    }

    .badge-new {
      background: linear-gradient(135deg, var(--deep-maroon) 0%, var(--terracotta) 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(110, 31, 31, 0.3);
    }

    /* Product Overlay */
    .product-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(110, 31, 31, 0.8) 0%, transparent 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
      display: flex;
      align-items: flex-end;
      padding: 1.5rem;
      z-index: 1;
    }

    .product-card:hover .product-overlay {
      opacity: 1;
    }

    .overlay-content {
      width: 100%;
      text-align: center;
    }

    .view-text {
      color: white;
      font-weight: 600;
      font-size: 0.9rem;
      letter-spacing: 0.5px;
    }

    /* Product Details */
    .product-details {
      padding: 1.5rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .product-category {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: var(--royal-gold);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.5rem;
    }

    .product-category svg {
      width: 14px;
      height: 14px;
    }

    .product-name {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--deep-maroon);
      margin: 0.25rem 0 0.5rem;
      line-height: 1.3;
      flex: 1;
    }

    .product-description {
      font-size: 0.85rem;
      color: #4F3D2F;
      margin-bottom: 1rem;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .product-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid rgba(200, 154, 43, 0.1);
    }

    .price-section {
      display: flex;
      flex-direction: column;
    }

    .current-price {
      font-weight: 700;
      color: var(--deep-maroon);
      font-size: 1.2rem;
    }

    .original-price {
      text-decoration: line-through;
      color: #6F5A49;
      font-size: 0.85rem;
    }

    .rating-section {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: var(--royal-gold);
      font-weight: 600;
      font-size: 0.9rem;
    }

    .star-icon {
      width: 16px;
      height: 16px;
    }

    /* Empty State */
    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 5rem 2rem;
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      border: 2px dashed rgba(200, 154, 43, 0.2);
    }

    .empty-illustration {
      width: 80px;
      height: 80px;
      margin: 0 auto 1.5rem;
      color: var(--royal-gold);
      opacity: 0.5;
    }

    .empty-illustration svg {
      width: 100%;
      height: 100%;
    }

    .empty-state h3 {
      color: var(--deep-maroon);
      margin-bottom: 0.5rem;
      font-size: 1.5rem;
    }

    .empty-state p {
      color: #4F3D2F;
      margin-bottom: 2rem;
      font-size: 1rem;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, var(--deep-maroon) 0%, var(--terracotta) 100%);
      color: white;
      border: none;
      border-radius: 50px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(110, 31, 31, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(110, 31, 31, 0.4);
    }

    .btn-primary svg {
      width: 18px;
      height: 18px;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .products-layout {
        grid-template-columns: 1fr;
      }
      .sidebar {
        display: none;
      }
      .sidebar.mobile-open {
        display: block;
        margin-bottom: 1.5rem;
      }
      .results-header {
        flex-wrap: wrap;
        gap: 0.75rem;
      }
    }

    /* Mobile Filter Bar */
    .mobile-filter-bar {
      display: none;
    }

    @media (max-width: 1024px) {
      .mobile-filter-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;
        gap: 1rem;
      }
    }

    .mobile-filter-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 1.25rem;
      background: linear-gradient(135deg, var(--deep-maroon) 0%, var(--terracotta) 100%);
      color: white;
      border: none;
      border-radius: 50px;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(110, 31, 31, 0.25);
    }

    .mobile-filter-btn svg {
      width: 16px;
      height: 16px;
    }

    .mobile-filter-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(110, 31, 31, 0.35);
    }

    .mobile-filter-btn:focus-visible,
    .sort-select:focus-visible,
    .search-input:focus-visible,
    .category-link:focus-visible,
    .btn-clear-all:focus-visible {
      outline: 3px solid rgba(255, 153, 51, 0.9);
      outline-offset: 2px;
    }

    .mobile-filter-count {
      background: white;
      color: var(--deep-maroon);
      font-size: 0.75rem;
      font-weight: 700;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .mobile-results-info {
      color: var(--deep-maroon);
      font-weight: 600;
      font-size: 0.95rem;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: 1rem;
      }
      .search-box {
        width: 100%;
      }
      .product-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }
      .section-title {
        font-size: 1.8rem;
      }
      .section-subtitle {
        font-size: 0.95rem;
      }
      .products-page {
        padding: 1.5rem 0;
      }
      .sort-wrapper {
        width: 100%;
      }
      .sort-select {
        width: 100%;
      }
      .mobile-filter-bar {
        flex-wrap: wrap;
      }
    }

    @media (max-width: 480px) {
      .product-grid {
        grid-template-columns: 1fr;
      }
      .container {
        padding: 0 1rem;
      }
      .section-title {
        font-size: 1.5rem;
      }
      .results-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
      }

      .mobile-filter-btn {
        min-height: 44px;
      }
    }

    @media (max-width: 360px) {
      .mobile-filter-bar {
        flex-direction: column;
        align-items: stretch;
      }

      .mobile-filter-btn,
      .mobile-results-info,
      .sort-wrapper,
      .sort-select {
        width: 100%;
      }

      .results-info {
        flex-wrap: wrap;
      }
    }
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
  showMobileFilters = false;
  
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
