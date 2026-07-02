import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  template: `
    <h1>Customer Management</h1>
    <div class="table-wrap card">
      <table class="data-table">
        <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Orders</th><th>Total Spent</th><th>Joined</th></tr></thead>
        <tbody>
          @for (c of customers; track c.id) {
            <tr>
              <td><strong>{{ c.fullName }}</strong></td>
              <td>{{ c.email }}</td>
              <td>{{ c.phone ?? '—' }}</td>
              <td>{{ c.orderCount }}</td>
              <td>{{ c.totalSpent | currency:'INR':'symbol':'1.0-0' }}</td>
              <td>{{ c.joinedAt | date:'mediumDate' }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    h1 { color: var(--maroon); margin-bottom: 1.5rem; }
    .table-wrap { overflow-x: auto; }
    .data-table { width: 100%; }
    .data-table th { white-space: nowrap; }
    .data-table th, .data-table td { padding: 0.875rem 1rem; text-align: left; border-bottom: 1px solid var(--cream-dark); }
    .data-table th { background: var(--cream); font-weight: 600; color: var(--maroon); }
  `]
})
export class AdminCustomersComponent implements OnInit {
  private api = inject(ApiService);
  customers: { id: string; fullName: string; email: string; phone?: string; orderCount: number; totalSpent: number; joinedAt: string }[] = [];

  ngOnInit() {
    this.api.get<typeof this.customers>('/admin/customers').subscribe(c => this.customers = c);
  }
}
