import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-claim-sample',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="container page">
      @if (claimed) {
        <div class="success-card card">
          <div class="success-icon">🎉</div>
          <h2>Sample Order Placed!</h2>
          <p>Your free sample pack is on its way. Check your email for confirmation and order updates.</p>
          <a routerLink="/orders" class="btn btn-primary">Track My Order</a>
        </div>
      } @else {
        <div class="claim-card card">
          <div class="badge">🎁 One-Time Offer</div>
          <h1>Claim Your Free Sample Pack</h1>
          <p class="subtitle">As a new RAAS customer, get a free sample of <strong>every product</strong> — completely free, just pay nothing!</p>

          <div class="products-note">
            <span>🥒 Pickles</span>
            <span>🌶️ Masalas</span>
            <span>🫓 Papads</span>
            <span>🍯 Chutneys</span>
          </div>

          <h3>Delivery Address</h3>
          <div class="form-grid">
            <input class="input" [(ngModel)]="form.shippingName" placeholder="Full Name" />
            <input class="input" [(ngModel)]="form.shippingPhone" placeholder="Phone Number" />
            <input class="input full" [(ngModel)]="form.shippingAddress" placeholder="Address" />
            <input class="input" [(ngModel)]="form.shippingCity" placeholder="City" />
            <input class="input" [(ngModel)]="form.shippingState" placeholder="State" />
            <input class="input" [(ngModel)]="form.shippingPincode" placeholder="Pincode" />
          </div>

          @if (error) { <p class="error">{{ error }}</p> }

          <button class="btn btn-primary claim-btn" (click)="claimSample()" [disabled]="loading">
            {{ loading ? 'Claiming...' : '🎁 Claim Free Sample Pack' }}
          </button>
          <p class="terms">This is a one-time offer available only for new registered customers. One sample per product.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .page { padding: 2rem 0; display: flex; justify-content: center; }
    .claim-card, .success-card { max-width: 560px; width: 100%; padding: 2.5rem; }
    .badge { display: inline-block; background: var(--maroon); color: #fff; padding: 0.25rem 1rem; border-radius: 50px; font-size: 0.8rem; font-weight: 600; margin-bottom: 1rem; }
    h1 { color: var(--maroon); margin-bottom: 0.5rem; }
    .subtitle { color: var(--text-muted); line-height: 1.6; margin-bottom: 1.5rem; }
    .products-note { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem; }
    .products-note span { background: var(--cream-dark); padding: 0.4rem 0.9rem; border-radius: 50px; font-size: 0.85rem; }
    h3 { color: var(--maroon); margin-bottom: 1rem; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.5rem; }
    .form-grid .full { grid-column: 1 / -1; }
    .claim-btn { width: 100%; }
    .terms { margin-top: 1rem; font-size: 0.8rem; color: var(--text-muted); text-align: center; }
    .error { color: #C62828; font-size: 0.9rem; margin-bottom: 0.75rem; }
    .success-card { text-align: center; }
    .success-icon { font-size: 4rem; margin-bottom: 1rem; }
    .success-card h2 { color: var(--maroon); margin-bottom: 0.75rem; }
    .success-card p { color: var(--text-muted); margin-bottom: 2rem; }
  `]
})
export class ClaimSampleComponent {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  readonly router = inject(Router);

  loading = false;
  claimed = false;
  error = '';
  form = {
    shippingName: '', shippingPhone: '', shippingAddress: '',
    shippingCity: '', shippingState: '', shippingPincode: ''
  };

  ngOnInit() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/claim-sample' } });
      return;
    }
    const user = this.auth.currentUser();
    if (user?.hasClaimedSample) {
      this.error = 'You have already claimed your free sample.';
    }
  }

  claimSample() {
    if (!this.form.shippingName || !this.form.shippingPhone || !this.form.shippingAddress ||
        !this.form.shippingCity || !this.form.shippingState || !this.form.shippingPincode) {
      this.error = 'Please fill in all delivery details';
      return;
    }
    this.loading = true;
    this.error = '';
    this.api.post('/orders/claim-sample', this.form).subscribe({
      next: () => { this.claimed = true; this.loading = false; },
      error: err => { this.error = err.error?.message ?? 'Failed to claim sample'; this.loading = false; }
    });
  }
}
