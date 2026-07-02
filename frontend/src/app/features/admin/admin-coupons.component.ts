import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-admin-coupons',
  standalone: true,
  imports: [DatePipe, FormsModule],
  template: `
    <div class="header-row">
      <h1>Coupons & Offers</h1>
      <button class="btn btn-primary" (click)="showForm = !showForm">+ Create Coupon</button>
    </div>
    @if (showForm) {
      <div class="card form-card">
        <div class="form-grid">
          <input class="input" [(ngModel)]="form.code" placeholder="Code" />
          <input class="input" type="number" [(ngModel)]="form.discountPercent" placeholder="Discount %" />
          <input class="input" type="number" [(ngModel)]="form.minOrderAmount" placeholder="Min Order ₹" />
          <input class="input" type="number" [(ngModel)]="form.usageLimit" placeholder="Usage Limit" />
          <input class="input" [(ngModel)]="form.description" placeholder="Description" />
        </div>
        <button class="btn btn-primary" (click)="createCoupon()">Create</button>
      </div>
    }
    <div class="table-wrap card">
      <table class="data-table">
        <thead><tr><th>Code</th><th>Discount</th><th>Min Order</th><th>Usage</th><th>Valid Until</th><th>Status</th></tr></thead>
        <tbody>
          @for (c of coupons; track c.id) {
            <tr>
              <td><strong>{{ c.code }}</strong></td>
              <td>{{ c.discountPercent }}%</td>
              <td>₹{{ c.minOrderAmount }}</td>
              <td>{{ c.usageCount }}/{{ c.usageLimit }}</td>
              <td>{{ c.validUntil | date:'mediumDate' }}</td>
              <td><span class="badge" [class.badge-maroon]="c.isActive">{{ c.isActive ? 'Active' : 'Inactive' }}</span></td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    h1 { color: var(--maroon); }
    .form-card { padding: 1.5rem; margin-bottom: 1.5rem; }
    .form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1rem; }
    .table-wrap { overflow-x: auto; }
    .data-table { width: 100%; }
    .data-table th { white-space: nowrap; }
    .data-table th, .data-table td { padding: 0.875rem 1rem; text-align: left; border-bottom: 1px solid var(--cream-dark); }
    .data-table th { background: var(--cream); font-weight: 600; color: var(--maroon); }
    @media (max-width: 768px) {
      .header-row {
        flex-direction: column;
        align-items: stretch;
        gap: 0.75rem;
      }
      .form-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class AdminCouponsComponent implements OnInit {
  private api = inject(ApiService);
  coupons: { id: string; code: string; discountPercent: number; minOrderAmount: number; usageCount: number; usageLimit: number; validUntil: string; isActive: boolean }[] = [];
  showForm = false;
  form = { code: '', description: '', discountPercent: 10, minOrderAmount: 299, usageLimit: 100 };

  ngOnInit() { this.load(); }
  load() { this.api.get<typeof this.coupons>('/admin/coupons').subscribe(c => this.coupons = c); }

  createCoupon() {
    const now = new Date();
    this.api.post('/admin/coupons', {
      ...this.form,
      validFrom: now.toISOString(),
      validUntil: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()).toISOString()
    }).subscribe(() => { this.showForm = false; this.load(); });
  }
}
