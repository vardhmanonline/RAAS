import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Order } from '../../core/models';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe],
  template: `
    <div class="container page">
      <h1 class="section-title">My Orders</h1>
      @for (order of orders; track order.id) {
        <a [routerLink]="['/orders', order.id]" class="order-card card">
          <div class="order-header">
            <div>
              <strong>{{ order.orderNumber }}</strong>
              <span class="order-date">{{ order.createdAt | date:'medium' }}</span>
            </div>
            <span class="status-badge" [class]="order.status.toLowerCase()">{{ order.status }}</span>
          </div>
          <div class="order-items-preview">
            @for (item of order.items.slice(0, 2); track item.productId) {
              <img [src]="item.productImageUrl" [alt]="item.productName" />
            }
            @if (order.items.length > 2) {
              <span class="more">+{{ order.items.length - 2 }}</span>
            }
          </div>
          <div class="order-footer">
            <span>{{ order.items.length }} item(s)</span>
            <strong>{{ order.total | currency:'INR':'symbol':'1.0-0' }}</strong>
          </div>
        </a>
      } @empty {
        <p class="empty">No orders yet. <a routerLink="/products">Start shopping</a></p>
      }
    </div>
  `,
  styles: [`
    .page { padding: 2rem 0; }
    .order-card { display: block; padding: 1.25rem; margin-bottom: 1rem; text-decoration: none; color: inherit; }
    .order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .order-date { display: block; font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem; }
    .status-badge { padding: 0.25rem 0.75rem; border-radius: 50px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
    .status-badge.pending { background: #FFF3E0; color: #E65100; }
    .status-badge.packed { background: #E3F2FD; color: #1565C0; }
    .status-badge.shipped { background: #E8F5E9; color: #2E7D32; }
    .status-badge.delivered { background: #F3E5F5; color: #7B1FA2; }
    .order-items-preview { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
    .order-items-preview img { width: 48px; height: 48px; object-fit: cover; border-radius: 8px; }
    .more { width: 48px; height: 48px; background: var(--cream-dark); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; color: var(--text-muted); }
    .order-footer { display: flex; justify-content: space-between; color: var(--text-muted); font-size: 0.9rem; }
    .order-footer strong { color: var(--maroon); font-size: 1.1rem; }
    .empty { text-align: center; padding: 3rem; color: var(--text-muted); }
  `]
})
export class OrdersComponent implements OnInit {
  private api = inject(ApiService);
  orders: Order[] = [];

  ngOnInit() {
    this.api.get<Order[]>('/orders/my').subscribe(o => this.orders = o);
  }
}
