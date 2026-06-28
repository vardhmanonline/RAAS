import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Product, ProductDetail, Category } from '../../core/models';

type DiscountType = 'none' | 'percent' | 'flat';

interface ProductForm {
  categoryId: string;
  name: string;
  description: string;
  story: string;
  healthBenefits: string;
  usageSuggestions: string;
  ingredients: string;
  mrp: number;
  discountType: DiscountType;
  discountValue: number;
  stock: number;
  spiceLevel: string;
  isBestseller: boolean;
  imageUrl: string;
}

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe, FormsModule],
  template: `
    <div class="header-row">
      <h1>Product Management</h1>
      <button class="btn btn-primary" (click)="openAddForm()">+ Add Product</button>
    </div>

    @if (showForm) {
      <div class="card form-card">
        <h3>{{ editingId ? 'Edit Product' : 'New Product' }}</h3>

        <h4 class="section-label">Basic Info</h4>
        <div class="form-grid">
          <select class="input" [(ngModel)]="form.categoryId">
            @for (c of categories; track c.id) { <option [value]="c.id">{{ c.name }}</option> }
          </select>
          <input class="input" [(ngModel)]="form.name" placeholder="Product Name *" />
          <select class="input" [(ngModel)]="form.spiceLevel">
            <option value="Mild">Mild</option>
            <option value="Medium">Medium</option>
            <option value="Spicy">Spicy</option>
          </select>
          <input class="input" type="number" [(ngModel)]="form.stock" placeholder="Stock *" min="0" />
          <input class="input full" [(ngModel)]="form.imageUrl" placeholder="Image URL *" />
          <textarea class="input full" [(ngModel)]="form.description" placeholder="Short description *" rows="2"></textarea>
          <textarea class="input full" [(ngModel)]="form.story" placeholder="Story — From Rajasthan Kitchens" rows="2"></textarea>
        </div>

        <h4 class="section-label">Health & Ingredients</h4>
        <div class="form-grid">
          <textarea class="input full" [(ngModel)]="form.healthBenefits" placeholder="Health benefits (Ayurveda, digestion, immunity…)" rows="3"></textarea>
          <textarea class="input full" [(ngModel)]="form.usageSuggestions" placeholder="Usage suggestions (pair with dal-rice, paratha…)" rows="2"></textarea>
          <textarea class="input full" [(ngModel)]="form.ingredients" placeholder="Ingredients list (comma-separated)" rows="2"></textarea>
        </div>

        <h4 class="section-label">Pricing & Discount</h4>
        <div class="form-grid pricing-grid">
          <div class="field">
            <label>Discount Type</label>
            <select class="input" [(ngModel)]="form.discountType" (ngModelChange)="onDiscountChange()">
              <option value="none">No discount (single price)</option>
              <option value="percent">Percentage off MRP</option>
              <option value="flat">Flat ₹ off MRP</option>
            </select>
          </div>

          @if (form.discountType === 'none') {
            <div class="field">
              <label>Selling Price (₹)</label>
              <input class="input" type="number" [(ngModel)]="form.mrp" placeholder="Price" min="0" step="1" />
            </div>
          } @else {
            <div class="field">
              <label>MRP (₹) — shown struck-through on shop</label>
              <input class="input" type="number" [(ngModel)]="form.mrp" placeholder="MRP" min="0" step="1" (ngModelChange)="onDiscountChange()" />
            </div>
            <div class="field">
              <label>{{ form.discountType === 'percent' ? 'Discount (%)' : 'Discount (₹)' }}</label>
              <input class="input" type="number" [(ngModel)]="form.discountValue" min="0" [max]="form.discountType === 'percent' ? 99 : form.mrp" step="1" (ngModelChange)="onDiscountChange()" />
            </div>
          }

          <div class="price-preview full">
            <strong>Customer will see:</strong>
            @if (form.discountType !== 'none' && form.mrp > 0) {
              <span class="preview-selling">{{ sellingPrice | currency:'INR':'symbol':'1.0-0' }}</span>
              <span class="preview-mrp">{{ form.mrp | currency:'INR':'symbol':'1.0-0' }} MRP</span>
              @if (discountPercent > 0) {
                <span class="preview-badge">{{ discountPercent | number:'1.0-0' }}% OFF</span>
              }
            } @else {
              <span class="preview-selling">{{ form.mrp | currency:'INR':'symbol':'1.0-0' }}</span>
              <span class="preview-note">No MRP / discount shown</span>
            }
          </div>
        </div>

        <label class="checkbox-row"><input type="checkbox" [(ngModel)]="form.isBestseller" /> Mark as Bestseller</label>

        <div class="form-actions">
          <button class="btn btn-primary" (click)="saveProduct()" [disabled]="saving">{{ saving ? 'Saving…' : 'Save Product' }}</button>
          <button class="btn btn-secondary" type="button" (click)="cancelForm()">Cancel</button>
        </div>
        @if (saveError) { <p class="error">{{ saveError }}</p> }
      </div>
    }

    <table class="data-table card">
      <thead>
        <tr>
          <th>Product</th>
          <th>MRP</th>
          <th>Selling</th>
          <th>Discount</th>
          <th>Stock</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        @for (p of products; track p.id) {
          <tr>
            <td>
              <img [src]="p.imageUrl" class="thumb" alt="" />
              {{ p.name }}
              @if (p.isBestseller) { <span class="badge badge-saffron">Bestseller</span> }
            </td>
            <td>{{ p.compareAtPrice ? (p.compareAtPrice | currency:'INR':'symbol':'1.0-0') : '—' }}</td>
            <td><strong>{{ p.price | currency:'INR':'symbol':'1.0-0' }}</strong></td>
            <td>
              @if (p.compareAtPrice && p.compareAtPrice > p.price) {
                <span class="disc-badge">{{ calcDiscount(p) }}% OFF</span>
              } @else { — }
            </td>
            <td>{{ p.stock }}</td>
            <td class="actions">
              <button class="btn-edit" (click)="editProduct(p)">Edit</button>
              <button class="btn-sm" (click)="deleteProduct(p.id)">Delete</button>
            </td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: [`
    .header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    h1 { color: var(--maroon); }
    .form-card { padding: 1.5rem; margin-bottom: 1.5rem; }
    .section-label { color: var(--clay); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px; margin: 1.25rem 0 0.75rem; font-weight: 600; }
    .section-label:first-of-type { margin-top: 0; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
    .form-grid .full { grid-column: 1 / -1; }
    .field label { display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem; font-weight: 500; }
    .price-preview { background: var(--cream); padding: 1rem 1.25rem; border-radius: var(--radius-sm); display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
    .preview-selling { font-size: 1.5rem; font-weight: 700; color: var(--maroon); }
    .preview-mrp { text-decoration: line-through; color: var(--text-muted); }
    .preview-badge { background: var(--saffron); color: white; padding: 0.25rem 0.6rem; border-radius: 50px; font-size: 0.8rem; font-weight: 700; }
    .preview-note { font-size: 0.85rem; color: var(--text-muted); }
    .checkbox-row { display: flex; align-items: center; gap: 0.5rem; margin: 1rem 0; cursor: pointer; }
    .form-actions { display: flex; gap: 0.75rem; margin-top: 0.5rem; }
    .error { color: #C62828; margin-top: 0.75rem; font-size: 0.9rem; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th, .data-table td { padding: 0.875rem 1rem; text-align: left; border-bottom: 1px solid var(--cream-dark); vertical-align: middle; }
    .data-table th { background: var(--cream); font-weight: 600; color: var(--maroon); }
    .thumb { width: 40px; height: 40px; object-fit: cover; border-radius: 8px; vertical-align: middle; margin-right: 0.5rem; }
    .disc-badge { background: #E8F5E9; color: #2E7D32; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 700; }
    .actions { display: flex; gap: 0.5rem; }
    .btn-edit { padding: 0.35rem 0.75rem; border: 1px solid var(--maroon); color: var(--maroon); background: white; border-radius: 6px; cursor: pointer; }
    .btn-sm { padding: 0.35rem 0.75rem; border: 1px solid #C62828; color: #C62828; background: white; border-radius: 6px; cursor: pointer; }
    @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } }
  `]
})
export class AdminProductsComponent implements OnInit {
  private api = inject(ApiService);
  products: Product[] = [];
  categories: Category[] = [];
  showForm = false;
  editingId: string | null = null;
  saving = false;
  saveError = '';

  form: ProductForm = this.emptyForm();

  get sellingPrice(): number {
    if (this.form.discountType === 'none') return this.form.mrp;
    if (this.form.discountType === 'percent') {
      return Math.max(0, Math.round(this.form.mrp * (1 - this.form.discountValue / 100)));
    }
    return Math.max(0, this.form.mrp - this.form.discountValue);
  }

  get discountPercent(): number {
    if (this.form.discountType === 'percent') return this.form.discountValue;
    if (this.form.discountType === 'flat' && this.form.mrp > 0) {
      return Math.round((this.form.discountValue / this.form.mrp) * 100);
    }
    return 0;
  }

  ngOnInit() {
    this.load();
    this.api.get<Category[]>('/products/categories').subscribe(c => {
      this.categories = c;
      if (c.length && !this.form.categoryId) this.form.categoryId = c[0].id;
    });
  }

  calcDiscount(p: Product): number {
    if (!p.compareAtPrice || p.compareAtPrice <= p.price) return 0;
    return Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100);
  }

  onDiscountChange() { /* triggers preview refresh */ }

  openAddForm() {
    this.editingId = null;
    this.form = this.emptyForm();
    if (this.categories.length) this.form.categoryId = this.categories[0].id;
    this.showForm = true;
    this.saveError = '';
  }

  cancelForm() {
    this.showForm = false;
    this.editingId = null;
    this.saveError = '';
  }

  editProduct(p: Product) {
    this.editingId = p.id;
    this.showForm = true;
    this.saveError = '';
    this.api.get<ProductDetail>(`/products/${p.slug}`).subscribe({
      next: detail => {
        let discountType: DiscountType = 'none';
        let discountValue = 0;
        let mrp = detail.price;

        if (detail.compareAtPrice && detail.compareAtPrice > detail.price) {
          mrp = detail.compareAtPrice;
          const pct = Math.round(((detail.compareAtPrice - detail.price) / detail.compareAtPrice) * 100);
          const flat = detail.compareAtPrice - detail.price;
          if ([5, 10, 15, 20, 25, 30, 40, 50].includes(pct)) {
            discountType = 'percent';
            discountValue = pct;
          } else {
            discountType = 'flat';
            discountValue = flat;
          }
        }

        this.form = {
          categoryId: detail.categoryId,
          name: detail.name,
          description: detail.description,
          story: detail.story,
          healthBenefits: detail.healthBenefits,
          usageSuggestions: detail.usageSuggestions,
          ingredients: detail.ingredients,
          mrp,
          discountType,
          discountValue,
          stock: detail.stock,
          spiceLevel: detail.spiceLevel,
          isBestseller: detail.isBestseller,
          imageUrl: detail.imageUrl
        };
      }
    });
  }

  saveProduct() {
    if (!this.form.name?.trim()) { this.saveError = 'Product name is required'; return; }
    if (this.form.mrp <= 0) { this.saveError = 'Price/MRP must be greater than 0'; return; }
    if (this.form.discountType !== 'none' && this.sellingPrice <= 0) {
      this.saveError = 'Selling price must be greater than 0'; return;
    }

    const payload = {
      categoryId: this.form.categoryId,
      name: this.form.name,
      description: this.form.description,
      story: this.form.story,
      healthBenefits: this.form.healthBenefits,
      usageSuggestions: this.form.usageSuggestions,
      ingredients: this.form.ingredients,
      price: this.sellingPrice,
      compareAtPrice: this.form.discountType === 'none' ? null : this.form.mrp,
      stock: this.form.stock,
      spiceLevel: this.form.spiceLevel,
      isBestseller: this.form.isBestseller,
      imageUrl: this.form.imageUrl,
      galleryUrls: this.form.imageUrl ? [this.form.imageUrl] : []
    };

    this.saving = true;
    this.saveError = '';

    const req = this.editingId
      ? this.api.put(`/products/${this.editingId}`, { ...payload, isActive: true })
      : this.api.post('/products', payload);

    req.subscribe({
      next: () => {
        this.saving = false;
        this.showForm = false;
        this.editingId = null;
        this.load();
      },
      error: err => {
        this.saving = false;
        this.saveError = err.error?.message ?? err.error?.title ?? 'Failed to save product';
      }
    });
  }

  deleteProduct(id: string) {
    if (confirm('Remove this product from the shop?')) {
      this.api.delete(`/products/${id}`).subscribe(() => this.load());
    }
  }

  load() { this.api.get<Product[]>('/products').subscribe(p => this.products = p); }

  private emptyForm(): ProductForm {
    return {
      categoryId: '', name: '', description: '', story: '',
      healthBenefits: '', usageSuggestions: '', ingredients: '',
      mrp: 0, discountType: 'none', discountValue: 0,
      stock: 0, spiceLevel: 'Mild', isBestseller: false, imageUrl: ''
    };
  }
}
