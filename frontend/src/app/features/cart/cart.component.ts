import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, FormsModule],
  template: `
    <div class="container page">
      <h1 class="section-title">Your Cart</h1>
      @if (cart.cartItems().length) {
        <div class="cart-layout">
          <div class="cart-items">
            @for (item of cart.cartItems(); track item.productId) {
              <div class="cart-item card">
                <img [src]="item.imageUrl" [alt]="item.productName" />
                <div class="item-info">
                  <h3>{{ item.productName }}</h3>
                  <p>{{ item.unitPrice | currency:'INR':'symbol':'1.0-0' }} each</p>
                </div>
                <div class="qty-control">
                  <button (click)="cart.updateQuantity(item.productId, item.quantity - 1)">−</button>
                  <span>{{ item.quantity }}</span>
                  <button (click)="cart.updateQuantity(item.productId, item.quantity + 1)">+</button>
                </div>
                <div class="item-total">{{ item.unitPrice * item.quantity | currency:'INR':'symbol':'1.0-0' }}</div>
                <button class="remove-btn" (click)="cart.removeItem(item.productId)">✕</button>
              </div>
            }
          </div>
          <div class="cart-summary card">
            <h3>Order Summary</h3>
            <div class="summary-row"><span>Subtotal</span><span>{{ cart.subtotal() | currency:'INR':'symbol':'1.0-0' }}</span></div>
            <div class="summary-row"><span>Delivery</span><span>{{ cart.deliveryCharge() === 0 ? 'FREE' : (cart.deliveryCharge() | currency:'INR':'symbol':'1.0-0') }}</span></div>
            @if (cart.subtotal() < 499) {
              <p class="free-delivery">Add {{ 499 - cart.subtotal() | currency:'INR':'symbol':'1.0-0' }} more for free delivery!</p>
            }
            <div class="coupon-row">
              <input class="input" [(ngModel)]="couponCode" placeholder="Coupon code" />
              <button class="btn btn-secondary" (click)="applyCoupon()">Apply</button>
            </div>
            @if (discount() > 0) {
              <div class="summary-row discount"><span>Discount</span><span>-{{ discount() | currency:'INR':'symbol':'1.0-0' }}</span></div>
            }
            <div class="summary-row total"><span>Total</span><span>{{ total() | currency:'INR':'symbol':'1.0-0' }}</span></div>
            <a routerLink="/checkout" class="btn btn-primary full-width">Proceed to Checkout</a>
          </div>
        </div>
      } @else {
        <div class="empty-cart">
          <p>Your cart is empty</p>
          <a routerLink="/products" class="btn btn-primary">Start Shopping</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .page { padding: 2rem 0; }
    .cart-layout { display: grid; grid-template-columns: 1fr 360px; gap: 2rem; align-items: start; }
    .cart-item { display: grid; grid-template-columns: 80px 1fr auto auto auto; gap: 1rem; align-items: center; padding: 1rem; margin-bottom: 0.75rem; }
    .cart-item img { width: 80px; height: 80px; object-fit: cover; border-radius: var(--radius-sm); }
    .item-info h3 { font-size: 1rem; margin-bottom: 0.25rem; }
    .item-info p { color: var(--text-muted); font-size: 0.85rem; }
    .qty-control { display: flex; align-items: center; border: 2px solid var(--cream-dark); border-radius: var(--radius-sm); }
    .qty-control button { width: 32px; height: 32px; border: none; background: var(--cream); cursor: pointer; }
    .qty-control span { width: 32px; text-align: center; font-weight: 600; }
    .item-total { font-weight: 700; color: var(--maroon); }
    .remove-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 1rem; }
    .cart-summary { padding: 1.5rem; position: sticky; top: 80px; }
    .cart-summary h3 { margin-bottom: 1.25rem; color: var(--maroon); }
    .summary-row { display: flex; justify-content: space-between; margin-bottom: 0.75rem; }
    .summary-row.total { font-weight: 700; font-size: 1.15rem; border-top: 2px solid var(--cream-dark); padding-top: 0.75rem; margin-top: 0.75rem; color: var(--maroon); }
    .summary-row.discount { color: var(--success); }
    .free-delivery { font-size: 0.85rem; color: var(--saffron); margin-bottom: 1rem; }
    .coupon-row { display: flex; gap: 0.5rem; margin: 1rem 0; }
    .coupon-row .input { flex: 1; }
    .full-width { width: 100%; margin-top: 1rem; }
    .empty-cart { text-align: center; padding: 4rem; }
    .empty-cart p { color: var(--text-muted); margin-bottom: 1.5rem; font-size: 1.1rem; }
    @media (max-width: 768px) {
      .cart-layout { grid-template-columns: 1fr; }
      .cart-item {
        grid-template-columns: 72px 1fr auto;
        grid-template-areas:
          'image info remove'
          'image qty total';
        gap: 0.75rem;
      }
      .cart-item img { grid-area: image; width: 72px; height: 72px; }
      .item-info { grid-area: info; min-width: 0; }
      .qty-control { grid-area: qty; width: fit-content; }
      .item-total { grid-area: total; justify-self: end; }
      .remove-btn { grid-area: remove; align-self: start; }
      .coupon-row { flex-direction: column; }
    }
  `]
})
export class CartComponent {
  cart = inject(CartService);
  private api = inject(ApiService);
  couponCode = '';
  discount = signal(0);

  total = () => this.cart.subtotal() + this.cart.deliveryCharge() - this.discount();

  applyCoupon() {
    if (!this.couponCode) return;
    this.api.post<{ isValid: boolean; discountAmount: number; message: string }>('/orders/validate-coupon', {
      code: this.couponCode, subtotal: this.cart.subtotal()
    }).subscribe(res => {
      if (res.isValid) this.discount.set(res.discountAmount);
      else alert(res.message);
    });
  }
}
