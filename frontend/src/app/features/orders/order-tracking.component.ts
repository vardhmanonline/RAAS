import { Component, OnInit, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Order } from '../../core/models';

const STATUSES = ['Pending', 'Packed', 'Shipped', 'Delivered'];

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe],
  template: `
    @if (order) {
      <div class="container page">
        <a routerLink="/orders" class="back">← Back to Orders</a>
        <h1 class="section-title">Order {{ order.orderNumber }}</h1>
        <p class="order-meta">Placed on {{ order.createdAt | date:'fullDate' }} · {{ order.paymentMethod }} · {{ order.paymentStatus }}</p>

        <div class="timeline card">
          @for (status of statuses; track status; let i = $index) {
            <div class="timeline-step" [class.completed]="isCompleted(status)" [class.current]="order.status === status">
              <div class="timeline-dot">
                @if (isCompleted(status) && order.status !== status) { ✓ }
                @else if (order.status === status) { {{ i + 1 }} }
                @else { {{ i + 1 }} }
              </div>
              <div class="timeline-content">
                <strong>{{ status }}</strong>
                @if (order.status === status) { <span class="current-label">Current</span> }
              </div>
              @if (i < statuses.length - 1) { <div class="timeline-line" [class.completed]="isCompleted(statuses[i+1]) || isCompleted(status)"></div> }
            </div>
          }
        </div>

        <div class="order-details card">
          <h3>Items</h3>
          @for (item of order.items; track item.productId) {
            <div class="detail-item">
              <img [src]="item.productImageUrl" [alt]="item.productName" />
              <div>
                <strong>{{ item.productName }}</strong>
                <p>Qty: {{ item.quantity }} × {{ item.unitPrice | currency:'INR':'symbol':'1.0-0' }}</p>
              </div>
              <span>{{ item.totalPrice | currency:'INR':'symbol':'1.0-0' }}</span>
            </div>
          }
          <div class="totals">
            <div><span>Subtotal</span><span>{{ order.subtotal | currency:'INR':'symbol':'1.0-0' }}</span></div>
            <div><span>Delivery</span><span>{{ order.deliveryCharge | currency:'INR':'symbol':'1.0-0' }}</span></div>
            @if (order.discount > 0) {
              <div><span>Discount</span><span>-{{ order.discount | currency:'INR':'symbol':'1.0-0' }}</span></div>
            }
            <div class="grand-total"><span>Total</span><span>{{ order.total | currency:'INR':'symbol':'1.0-0' }}</span></div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .page { padding: 2rem 0; }
    .back { color: var(--text-muted); font-size: 0.9rem; display: inline-block; margin-bottom: 1rem; }
    .order-meta { color: var(--text-muted); margin-bottom: 2rem; }
    .timeline { padding: 2rem; margin-bottom: 1.5rem; }
    .timeline-step { display: flex; align-items: center; gap: 1rem; position: relative; padding: 0.75rem 0; }
    .timeline-dot { width: 40px; height: 40px; border-radius: 50%; background: var(--cream-dark); display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; z-index: 1; }
    .timeline-step.completed .timeline-dot { background: var(--success); color: white; }
    .timeline-step.current .timeline-dot { background: var(--maroon); color: white; box-shadow: 0 0 0 4px rgba(123,30,30,0.2); }
    .timeline-line { position: absolute; left: 19px; top: 52px; width: 2px; height: calc(100% - 16px); background: var(--cream-dark); }
    .timeline-line.completed { background: var(--success); }
    .current-label { font-size: 0.75rem; color: var(--saffron); font-weight: 600; margin-left: 0.5rem; }
    .order-details { padding: 1.5rem; }
    .order-details h3 { color: var(--maroon); margin-bottom: 1rem; }
    .detail-item { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid var(--cream-dark); }
    .detail-item img { width: 56px; height: 56px; object-fit: cover; border-radius: 8px; }
    .detail-item div { flex: 1; }
    .detail-item p { font-size: 0.85rem; color: var(--text-muted); }
    .totals { margin-top: 1rem; }
    .totals div { display: flex; justify-content: space-between; padding: 0.35rem 0; }
    .grand-total { font-weight: 700; font-size: 1.15rem; color: var(--maroon); border-top: 2px solid var(--cream-dark); padding-top: 0.75rem; margin-top: 0.5rem; }
  `]
})
export class OrderTrackingComponent implements OnInit {
  id = input.required<string>();
  private api = inject(ApiService);
  order: Order | null = null;
  statuses = STATUSES;

  ngOnInit() {
    this.api.get<Order>(`/orders/${this.id()}`).subscribe(o => this.order = o);
  }

  isCompleted(status: string): boolean {
    if (!this.order) return false;
    const current = STATUSES.indexOf(this.order.status);
    return STATUSES.indexOf(status) <= current;
  }
}
