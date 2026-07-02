import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Order } from '../../core/models';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, FormsModule],
  template: `
    <div class="header-row">
      <h1>Order Management</h1>
      <button class="btn btn-secondary" (click)="exportOrders()">Export CSV</button>
    </div>
    <div class="table-wrap card">
      <table class="data-table">
        <thead><tr><th>Order</th><th>Date</th><th>Total</th><th>Payment</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          @for (order of orders; track order.id) {
            <tr>
              <td><strong>{{ order.orderNumber }}</strong></td>
              <td>{{ order.createdAt | date:'short' }}</td>
              <td>{{ order.total | currency:'INR':'symbol':'1.0-0' }}</td>
              <td>{{ order.paymentMethod }}</td>
              <td>
                <select class="status-select" [ngModel]="order.status" (ngModelChange)="updateStatus(order.id, $event)">
                  <option value="Pending">Pending</option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
              <td>{{ order.items.length }} items</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    h1 { color: var(--maroon); }
    .table-wrap { overflow-x: auto; }
    .data-table { width: 100%; }
    .data-table th { white-space: nowrap; }
    .data-table th, .data-table td { padding: 0.875rem 1rem; text-align: left; border-bottom: 1px solid var(--cream-dark); }
    .data-table th { background: var(--cream); font-weight: 600; color: var(--maroon); }
    .status-select { padding: 0.35rem 0.5rem; border-radius: 6px; border: 1px solid var(--cream-dark); }
    @media (max-width: 768px) {
      .header-row {
        flex-direction: column;
        align-items: stretch;
        gap: 0.75rem;
      }
    }
  `]
})
export class AdminOrdersComponent implements OnInit {
  private api = inject(ApiService);
  orders: Order[] = [];

  ngOnInit() { this.api.get<Order[]>('/admin/orders').subscribe(o => this.orders = o); }

  updateStatus(id: string, status: string) {
    this.api.put(`/admin/orders/${id}/status`, { status }).subscribe(() => this.ngOnInit());
  }

  exportOrders() {
    const csv = ['Order,Date,Total,Status,Payment', ...this.orders.map(o =>
      `${o.orderNumber},${o.createdAt},${o.total},${o.status},${o.paymentMethod}`
    )].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'raas-orders.csv';
    a.click();
  }
}
