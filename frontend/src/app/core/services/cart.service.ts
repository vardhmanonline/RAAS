import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private items = signal<CartItem[]>(this.load());

  cartItems = computed(() => this.items());
  itemCount = computed(() => this.items().reduce((s, i) => s + i.quantity, 0));
  subtotal = computed(() => this.items().reduce((s, i) => s + i.unitPrice * i.quantity, 0));
  deliveryCharge = computed(() => this.subtotal() >= 499 ? 0 : 49);

  addItem(item: Omit<CartItem, 'quantity'>, qty = 1) {
    const current = [...this.items()];
    const idx = current.findIndex(i => i.productId === item.productId);
    if (idx >= 0) {
      current[idx] = { ...current[idx], quantity: current[idx].quantity + qty };
    } else {
      current.push({ ...item, quantity: qty });
    }
    this.save(current);
  }

  updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) return this.removeItem(productId);
    const current = this.items().map(i =>
      i.productId === productId ? { ...i, quantity } : i
    );
    this.save(current);
  }

  removeItem(productId: string) {
    this.save(this.items().filter(i => i.productId !== productId));
  }

  clear() {
    this.save([]);
  }

  private save(items: CartItem[]) {
    this.items.set(items);
    localStorage.setItem('raas_cart', JSON.stringify(items));
  }

  private load(): CartItem[] {
    const raw = localStorage.getItem('raas_cart');
    return raw ? JSON.parse(raw) : [];
  }
}
