import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { ApiService } from '../../core/services/api.service';
import { AnalyticsTracker } from '../../core/services/analytics-tracker.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CurrencyPipe, FormsModule],
  template: `
    <div class="container page">
      <div class="steps">
        <span class="step active">1. Address</span>
        <span class="step-divider">→</span>
        <span class="step" [class.active]="step >= 2">2. Payment</span>
      </div>

      @if (step === 1) {
        <div class="checkout-layout">
          <div class="form-section card">
            <h2>Delivery Address</h2>
            <div class="form-grid">
              <input class="input" [(ngModel)]="form.shippingName" placeholder="Full Name" />
              <input class="input" [(ngModel)]="form.shippingPhone" placeholder="Phone Number" />
              <input class="input full" [(ngModel)]="form.shippingAddress" placeholder="Address" />
              <input class="input" [(ngModel)]="form.shippingCity" placeholder="City" />
              <input class="input" [(ngModel)]="form.shippingState" placeholder="State" />
              <input class="input" [(ngModel)]="form.shippingPincode" placeholder="Pincode" />
            </div>
            <button class="btn btn-primary" (click)="step = 2">Continue to Payment</button>
          </div>
          <div class="summary card">
            <h3>Order Summary</h3>
            @for (item of cart.cartItems(); track item.productId) {
              <div class="summary-item">
                <span>{{ item.productName }} × {{ item.quantity }}</span>
                <span>{{ item.unitPrice * item.quantity | currency:'INR':'symbol':'1.0-0' }}</span>
              </div>
            }
            <div class="summary-total">
              <span>Total</span>
              <span>{{ cart.subtotal() + cart.deliveryCharge() | currency:'INR':'symbol':'1.0-0' }}</span>
            </div>
          </div>
        </div>
      }

      @if (step === 2) {
        <div class="checkout-layout">
          <div class="form-section card">
            <h2>Payment Method</h2>
            <div class="payment-options">
              @for (method of paymentMethods; track method.value) {
                <label class="payment-option" [class.selected]="form.paymentMethod === method.value">
                  <input type="radio" name="payment" [value]="method.value" [(ngModel)]="form.paymentMethod" />
                  <span>{{ method.icon }} {{ method.label }}</span>
                </label>
              }
            </div>
            <input class="input" [(ngModel)]="form.couponCode" placeholder="Coupon code (optional)" style="margin-top:1rem" />
            <button class="btn btn-primary place-order" (click)="placeOrder()" [disabled]="placing">
              {{ placing ? 'Placing Order...' : 'Place Order — ' + (cart.subtotal() + cart.deliveryCharge() | currency:'INR':'symbol':'1.0-0') }}
            </button>
          </div>
          <div class="summary card">
            <h3>Delivery to</h3>
            <p>{{ form.shippingName }}<br>{{ form.shippingAddress }}<br>{{ form.shippingCity }}, {{ form.shippingState }} — {{ form.shippingPincode }}</p>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page { padding: 2rem 0; }
    .steps { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; font-weight: 600; }
    .step { color: var(--text-muted); }
    .step.active { color: var(--maroon); }
    .step-divider { color: var(--cream-dark); }
    .checkout-layout { display: grid; grid-template-columns: 1fr 340px; gap: 2rem; align-items: start; }
    .form-section, .summary { padding: 1.5rem; }
    .form-section h2 { color: var(--maroon); margin-bottom: 1.25rem; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.5rem; }
    .form-grid .full { grid-column: 1 / -1; }
    .payment-options { display: flex; flex-direction: column; gap: 0.75rem; }
    .payment-option { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; border: 2px solid var(--cream-dark); border-radius: var(--radius-sm); cursor: pointer; }
    .payment-option.selected { border-color: var(--maroon); background: rgba(123,30,30,0.04); }
    .payment-option input { accent-color: var(--maroon); }
    .place-order { width: 100%; margin-top: 1.5rem; }
    .summary h3 { color: var(--maroon); margin-bottom: 1rem; }
    .summary-item { display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.9rem; }
    .summary-total { display: flex; justify-content: space-between; font-weight: 700; border-top: 2px solid var(--cream-dark); padding-top: 0.75rem; margin-top: 0.75rem; color: var(--maroon); }
    @media (max-width: 768px) { .checkout-layout { grid-template-columns: 1fr; } }
  `]
})
export class CheckoutComponent implements OnInit {
  cart = inject(CartService);
  private api = inject(ApiService);
  private router = inject(Router);
  private tracker = inject(AnalyticsTracker);

  step = 1;
  placing = false;
  form = {
    shippingName: '', shippingPhone: '', shippingAddress: '',
    shippingCity: '', shippingState: '', shippingPincode: '',
    paymentMethod: 'UPI', couponCode: ''
  };
  paymentMethods = [
    { value: 'UPI', label: 'UPI / GPay / PhonePe', icon: '📱' },
    { value: 'COD', label: 'Cash on Delivery', icon: '💵' },
    { value: 'Card', label: 'Credit / Debit Card', icon: '💳' }
  ];

  ngOnInit() {
    this.tracker.track('CheckoutStarted');
    this.api.post('/orders/track-checkout', {}).subscribe();
  }

  placeOrder() {
    this.placing = true;
    this.api.post<{ id: string }>('/orders/checkout', {
      items: this.cart.cartItems(),
      ...this.form
    }).subscribe({
      next: order => {
        this.cart.clear();
        this.router.navigate(['/orders', order.id]);
      },
      error: err => {
        alert(err.error?.message ?? 'Order failed');
        this.placing = false;
      }
    });
  }
}
