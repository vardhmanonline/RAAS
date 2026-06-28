import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Order } from '../../core/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  template: `
    <h1>Admin Dashboard</h1>
    <div class="quick-stats">
      <div class="stat-card card"><span class="stat-value">{{ orders.length }}</span><span class="stat-label">Total Orders</span></div>
      <div class="stat-card card"><span class="stat-value">{{ totalRevenue | currency:'INR':'symbol':'1.0-0' }}</span><span class="stat-label">Revenue</span></div>
      <div class="stat-card card"><span class="stat-value">{{ pendingOrders }}</span><span class="stat-label">Pending</span></div>
    </div>
    <div class="quick-links">
      <a routerLink="/admin/orders" class="card link-card">📦 Manage Orders</a>
      <a routerLink="/admin/products" class="card link-card">🛍️ Manage Products</a>
      <a routerLink="/admin/analytics" class="card link-card">📊 View Analytics</a>
    </div>
    <h2>Recent Orders</h2>
    @for (order of orders.slice(0, 5); track order.id) {
      <div class="order-row card">
        <span><strong>{{ order.orderNumber }}</strong> — {{ order.status }}</span>
        <span>{{ order.total | currency:'INR':'symbol':'1.0-0' }}</span>
      </div>
    }
  `,
  styles: [`
    h1 { color: var(--maroon); margin-bottom: 1.5rem; }
    h2 { color: var(--maroon); margin: 2rem 0 1rem; }
    .quick-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem; }
    .stat-card { padding: 1.5rem; text-align: center; }
    .stat-value { display: block; font-size: 2rem; font-weight: 700; color: var(--maroon); }
    .stat-label { color: var(--text-muted); font-size: 0.9rem; }
    .quick-links { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem; }
    .link-card { padding: 1.5rem; text-align: center; text-decoration: none; color: inherit; font-weight: 600; }
    .order-row { display: flex; justify-content: space-between; padding: 1rem 1.25rem; margin-bottom: 0.5rem; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private api = inject(ApiService);
  orders: Order[] = [];
  totalRevenue = 0;
  pendingOrders = 0;

  ngOnInit() {
    this.api.get<Order[]>('/admin/orders').subscribe(o => {
      this.orders = o;
      this.totalRevenue = o.reduce((s, x) => s + x.total, 0);
      this.pendingOrders = o.filter(x => x.status === 'Pending').length;
    });
  }
}
