import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { AnalyticsTracker } from '../../core/services/analytics-tracker.service';
import { UserProfile } from '../../core/models';

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

      @if (!isLoggedIn && step === 0) {
        <div class="guest-prompt card">
          <h2>How would you like to checkout?</h2>
          <div class="guest-options">
            <button class="btn btn-primary" (click)="router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } })">
              🔐 Login / Register
            </button>
            <div class="or-divider">or</div>
            <button class="btn btn-outline" (click)="step = 1">
              👤 Continue as Guest
            </button>
          </div>
          <p class="guest-note">Guests can checkout without an account. <strong>Create an account</strong> to track orders, earn loyalty points & get 10% off with WELCOME10.</p>
        </div>
      }

      @if (step === 1) {
        <div class="checkout-layout">
          <div class="form-section card">
            <h2>Delivery Address</h2>
            @if (!isLoggedIn) {
              <input class="input full" type="email" [(ngModel)]="form.guestEmail" placeholder="Your Email (for order confirmation) *" style="margin-bottom:0.75rem" />
              @if (formErrors.guestEmail) {
                <p class="error">{{ formErrors.guestEmail }}</p>
              }
            }
            
            @if (isLoggedIn && userProfile && userProfile.addresses.length > 0) {
              <div class="saved-addresses">
                <h3>Select a saved address</h3>
                @for (addr of userProfile.addresses; track addr.id) {
                  <div class="address-option" [class.selected]="selectedAddressId === addr.id" (click)="selectAddress(addr)">
                    <div class="address-header">
                      <strong>{{ addr.label }}</strong>
                      @if (addr.isDefault) { <span class="default-badge">Default</span> }
                    </div>
                    <p>{{ addr.line1 }}, {{ addr.city }}, {{ addr.state }} — {{ addr.pincode }}</p>
                  </div>
                }
                <button class="btn btn-outline" (click)="selectedAddressId = null; clearForm()">+ Enter new address</button>
              </div>
            }
            
            <div class="form-grid">
              <input class="input" [(ngModel)]="form.shippingName" placeholder="Full Name *" />
              <input class="input" [(ngModel)]="form.shippingPhone" placeholder="Phone Number (10 digits) *" maxlength="10" />
              <input class="input full" [(ngModel)]="form.shippingAddress" placeholder="Address Line 1 *" />
              <input class="input full" [(ngModel)]="form.shippingAddress2" placeholder="Address Line 2 (optional)" />
              <input class="input" [(ngModel)]="form.shippingCity" placeholder="City *" />
              <input class="input" [(ngModel)]="form.shippingState" placeholder="State *" />
              <input class="input" [(ngModel)]="form.shippingPincode" placeholder="Pincode (6 digits) *" maxlength="6" />
            </div>
            @if (formErrors.shippingPhone || formErrors.shippingPincode) {
              <div class="error-messages">
                @if (formErrors.shippingPhone) { <p class="error">{{ formErrors.shippingPhone }}</p> }
                @if (formErrors.shippingPincode) { <p class="error">{{ formErrors.shippingPincode }}</p> }
              </div>
            }
            <button class="btn btn-primary" (click)="validateAndProceed()">Continue to Payment</button>
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
            <p>{{ form.shippingName }}<br>{{ form.shippingAddress }}{{ form.shippingAddress2 ? ', ' + form.shippingAddress2 : '' }}<br>{{ form.shippingCity }}, {{ form.shippingState }} — {{ form.shippingPincode }}<br>📱 {{ form.shippingPhone }}</p>
            @if (!isLoggedIn) {
              <p class="guest-badge">👤 Checking out as Guest</p>
            }
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
    .saved-addresses { margin-bottom: 1.5rem; }
    .saved-addresses h3 { color: var(--maroon); margin-bottom: 0.75rem; font-size: 1rem; }
    .address-option { padding: 0.75rem; border: 2px solid var(--cream-dark); border-radius: var(--radius-sm); margin-bottom: 0.5rem; cursor: pointer; transition: all 0.2s; }
    .address-option:hover { border-color: var(--maroon); }
    .address-option.selected { border-color: var(--maroon); background: rgba(123,30,30,0.04); }
    .address-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem; }
    .default-badge { background: var(--gold); color: white; padding: 0.15rem 0.5rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
    .address-option p { font-size: 0.85rem; color: var(--text-muted); margin: 0; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.5rem; }
    .form-grid .full { grid-column: 1 / -1; }
    .input.full { width: 100%; box-sizing: border-box; }
    .payment-options { display: flex; flex-direction: column; gap: 0.75rem; }
    .payment-option { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; border: 2px solid var(--cream-dark); border-radius: var(--radius-sm); cursor: pointer; }
    .payment-option.selected { border-color: var(--maroon); background: rgba(123,30,30,0.04); }
    .payment-option input { accent-color: var(--maroon); }
    .place-order { width: 100%; margin-top: 1.5rem; }
    .summary h3 { color: var(--maroon); margin-bottom: 1rem; }
    .summary-item { display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.9rem; }
    .summary-total { display: flex; justify-content: space-between; font-weight: 700; border-top: 2px solid var(--cream-dark); padding-top: 0.75rem; margin-top: 0.75rem; color: var(--maroon); }
    .guest-prompt { max-width: 480px; margin: 0 auto; padding: 2.5rem; text-align: center; }
    .guest-prompt h2 { color: var(--maroon); margin-bottom: 1.5rem; }
    .guest-options { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
    .or-divider { color: var(--text-muted); font-size: 0.85rem; }
    .btn-outline { background: transparent; border: 2px solid var(--maroon); color: var(--maroon); padding: 0.5rem 1rem; border-radius: var(--radius-sm); font-weight: 600; cursor: pointer; font-size: 0.9rem; }
    .btn-outline:hover { background: rgba(123,30,30,0.06); }
    .guest-note { margin-top: 1.5rem; font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; }
    .guest-badge { margin-top: 0.75rem; font-size: 0.85rem; color: var(--text-muted); }
    .error { color: #dc3545; font-size: 0.85rem; margin: 0.25rem 0; }
    .error-messages { margin-top: -1rem; margin-bottom: 1rem; }
    @media (max-width: 768px) { .checkout-layout { grid-template-columns: 1fr; } }
  `]
})
export class CheckoutComponent implements OnInit {
  cart = inject(CartService);
  private api = inject(ApiService);
  readonly router = inject(Router);
  private authSvc = inject(AuthService);
  private tracker = inject(AnalyticsTracker);

  get isLoggedIn() { return this.authSvc.isLoggedIn(); }

  step = this.authSvc.isLoggedIn() ? 1 : 0;
  placing = false;
  userProfile: UserProfile | null = null;
  selectedAddressId: string | null = null;
  form = {
    guestEmail: '',
    shippingName: '', shippingPhone: '', shippingAddress: '', shippingAddress2: '',
    shippingCity: '', shippingState: '', shippingPincode: '',
    paymentMethod: 'UPI', couponCode: ''
  };
  formErrors = {
    guestEmail: '',
    shippingPhone: '',
    shippingPincode: ''
  };
  paymentMethods = [
    { value: 'UPI', label: 'UPI / GPay / PhonePe', icon: '📱' },
    { value: 'COD', label: 'Cash on Delivery', icon: '💵' },
    { value: 'Card', label: 'Credit / Debit Card', icon: '💳' }
  ];

  ngOnInit() {
    this.tracker.track('CheckoutStarted');
    if (this.isLoggedIn) {
      this.api.post('/orders/track-checkout', {}).subscribe();
      this.loadUserProfile();
    }
  }

  loadUserProfile() {
    this.api.get<UserProfile>('/users/profile').subscribe(profile => {
      this.userProfile = profile;
      this.form.shippingName = profile.fullName;
      this.form.shippingPhone = profile.phone || '';
      
      // Auto-select default address if available
      const defaultAddress = profile.addresses.find(a => a.isDefault);
      if (defaultAddress) {
        this.selectAddress(defaultAddress);
      }
    });
  }

  selectAddress(addr: any) {
    this.selectedAddressId = addr.id;
    this.form.shippingAddress = addr.line1;
    this.form.shippingAddress2 = addr.line2 || '';
    this.form.shippingCity = addr.city;
    this.form.shippingState = addr.state;
    this.form.shippingPincode = addr.pincode;
  }

  clearForm() {
    this.form.shippingAddress = '';
    this.form.shippingAddress2 = '';
    this.form.shippingCity = '';
    this.form.shippingState = '';
    this.form.shippingPincode = '';
  }

  validateAndProceed() {
    this.formErrors = { guestEmail: '', shippingPhone: '', shippingPincode: '' };
    
    // Validate guest email
    if (!this.isLoggedIn) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.form.guestEmail) {
        this.formErrors.guestEmail = 'Email is required';
        return;
      }
      if (!emailRegex.test(this.form.guestEmail)) {
        this.formErrors.guestEmail = 'Invalid email format';
        return;
      }
    }

    // Validate required fields
    if (!this.form.shippingName || !this.form.shippingAddress || !this.form.shippingCity || 
        !this.form.shippingState || !this.form.shippingPincode) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate phone
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!this.form.shippingPhone) {
      this.formErrors.shippingPhone = 'Phone number is required';
      return;
    }
    if (!phoneRegex.test(this.form.shippingPhone)) {
      this.formErrors.shippingPhone = 'Phone must be 10 digits starting with 6-9';
      return;
    }

    // Validate pincode
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(this.form.shippingPincode)) {
      this.formErrors.shippingPincode = 'Pincode must be exactly 6 digits';
      return;
    }

    this.step = 2;
  }

  placeOrder() {
    this.placing = true;
    const shippingAddress = this.form.shippingAddress2 
      ? `${this.form.shippingAddress}, ${this.form.shippingAddress2}`
      : this.form.shippingAddress;

    if (this.isLoggedIn) {
      this.api.post<{ id: string }>('/orders/checkout', {
        items: this.cart.cartItems(),
        couponCode: this.form.couponCode,
        paymentMethod: this.form.paymentMethod,
        shippingName: this.form.shippingName,
        shippingPhone: this.form.shippingPhone,
        shippingAddress: shippingAddress,
        shippingCity: this.form.shippingCity,
        shippingState: this.form.shippingState,
        shippingPincode: this.form.shippingPincode
      }).subscribe({
        next: order => { this.cart.clear(); this.router.navigate(['/orders', order.id]); },
        error: err => { alert(err.error?.message ?? 'Order failed'); this.placing = false; }
      });
    } else {
      if (!this.form.guestEmail) {
        alert('Please enter your email to continue as guest');
        this.step = 1;
        this.placing = false;
        return;
      }
      this.api.post<{ id: string; orderNumber: string }>('/orders/guest-checkout', {
        items: this.cart.cartItems(),
        couponCode: this.form.couponCode,
        paymentMethod: this.form.paymentMethod,
        shippingName: this.form.shippingName,
        shippingPhone: this.form.shippingPhone,
        shippingAddress: shippingAddress,
        shippingCity: this.form.shippingCity,
        shippingState: this.form.shippingState,
        shippingPincode: this.form.shippingPincode,
        guestEmail: this.form.guestEmail
      }).subscribe({
        next: order => {
          this.cart.clear();
          alert(`Order ${order.orderNumber} placed! Confirmation sent to ${this.form.guestEmail}`);
          this.router.navigate(['/']);
        },
        error: err => { alert(err.error?.message ?? 'Order failed'); this.placing = false; }
      });
    }
  }
}
