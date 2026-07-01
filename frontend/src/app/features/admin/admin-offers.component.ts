import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  badgeText: string;
  buttonText: string;
  buttonLink: string;
  backgroundColor: string;
  textColor: string;
  badgeColor: string;
  buttonColor: string;
  displayOrder: number;
  isActive: boolean;
  validFrom?: string;
  validUntil?: string;
}

@Component({
  selector: 'app-admin-offers',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="offers-page">
      <div class="page-header">
        <h1>Special Offers</h1>
        <button class="btn btn-primary" (click)="showCreateForm = true">+ Create Offer</button>
      </div>

      @if (showCreateForm) {
        <div class="card form-card">
          <h2>Create New Offer</h2>
          <div class="form-grid">
            <div class="form-group full">
              <label>Title *</label>
              <input class="input" [(ngModel)]="newOffer.title" placeholder="Diwali Special Combos" />
            </div>
            <div class="form-group full">
              <label>Description *</label>
              <textarea class="input" [(ngModel)]="newOffer.description" rows="2" placeholder="Up to 25% off on curated gift packs. Perfect for gifting!"></textarea>
            </div>
            <div class="form-group">
              <label>Badge Text *</label>
              <input class="input" [(ngModel)]="newOffer.badgeText" placeholder="Festival Offer" />
            </div>
            <div class="form-group">
              <label>Button Text *</label>
              <input class="input" [(ngModel)]="newOffer.buttonText" placeholder="Explore Combos" />
            </div>
            <div class="form-group full">
              <label>Button Link *</label>
              <input class="input" [(ngModel)]="newOffer.buttonLink" placeholder="/products?category=combos" />
            </div>
            <div class="form-group">
              <label>Background Color</label>
              <input class="input" [(ngModel)]="newOffer.backgroundColor" placeholder="linear-gradient(135deg, var(--maroon), var(--maroon-dark))" />
            </div>
            <div class="form-group">
              <label>Text Color</label>
              <input class="input" [(ngModel)]="newOffer.textColor" placeholder="var(--cream)" />
            </div>
            <div class="form-group">
              <label>Badge Color</label>
              <select class="input" [(ngModel)]="newOffer.badgeColor">
                <option value="badge-gold">Gold</option>
                <option value="badge-saffron">Saffron</option>
                <option value="badge-maroon">Maroon</option>
              </select>
            </div>
            <div class="form-group">
              <label>Button Color</label>
              <select class="input" [(ngModel)]="newOffer.buttonColor">
                <option value="btn-gold">Gold</option>
                <option value="btn-primary">Primary</option>
                <option value="btn-secondary">Secondary</option>
              </select>
            </div>
            <div class="form-group">
              <label>Display Order</label>
              <input class="input" type="number" [(ngModel)]="newOffer.displayOrder" placeholder="0" />
            </div>
            <div class="form-group">
              <label>Valid From</label>
              <input class="input" type="datetime-local" [(ngModel)]="newOffer.validFrom" />
            </div>
            <div class="form-group">
              <label>Valid Until</label>
              <input class="input" type="datetime-local" [(ngModel)]="newOffer.validUntil" />
            </div>
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="newOffer.isActive" />
                Active
              </label>
            </div>
          </div>
          <div class="form-actions">
            <button class="btn btn-secondary" (click)="showCreateForm = false; resetForm()">Cancel</button>
            <button class="btn btn-primary" (click)="createOffer()" [disabled]="saving">{{ saving ? 'Creating...' : 'Create Offer' }}</button>
          </div>
        </div>
      }

      @if (loading) {
        <p class="loading">Loading offers...</p>
      } @else {
        <div class="offers-list">
          @for (offer of offers; track offer.id) {
            <div class="offer-card card" [class.inactive]="!offer.isActive">
              <div class="offer-preview" [style.background]="offer.backgroundColor" [style.color]="offer.textColor">
                <span class="preview-badge {{ offer.badgeColor }}">{{ offer.badgeText }}</span>
                <h3>{{ offer.title }}</h3>
                <p>{{ offer.description }}</p>
                <button class="preview-btn {{ offer.buttonColor }}">{{ offer.buttonText }}</button>
              </div>
              <div class="offer-details">
                <div class="offer-meta">
                  <span class="status" [class.active]="offer.isActive">{{ offer.isActive ? 'Active' : 'Inactive' }}</span>
                  <span class="order">Order: {{ offer.displayOrder }}</span>
                  @if (offer.validFrom || offer.validUntil) {
                    <span class="dates">
                      @if (offer.validFrom) { From: {{ formatDate(offer.validFrom) }} }
                      @if (offer.validUntil) { Until: {{ formatDate(offer.validUntil) }} }
                    </span>
                  }
                </div>
                <div class="offer-actions">
                  <button class="btn btn-small btn-outline" (click)="editOffer(offer)">Edit</button>
                  <button class="btn btn-small btn-secondary" (click)="toggleActive(offer)">{{ offer.isActive ? 'Deactivate' : 'Activate' }}</button>
                  <button class="btn btn-small btn-secondary" (click)="deleteOffer(offer.id)">Delete</button>
                </div>
              </div>
            </div>
          }
          @if (offers.length === 0) {
            <p class="empty-state">No special offers found. Create one to get started!</p>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .offers-page h1 { color: var(--maroon); margin-bottom: 1.5rem; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .loading { color: var(--text-muted); }
    .form-card { padding: 1.5rem; margin-bottom: 2rem; }
    .form-card h2 { color: var(--maroon); margin-bottom: 1rem; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group.full { grid-column: 1 / -1; }
    .form-group label { display: block; font-size: 0.85rem; color: var(--text-muted); font-weight: 600; margin-bottom: 0.4rem; }
    .form-group .input, .form-group textarea { width: 100%; }
    .checkbox-label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
    .checkbox-label input { accent-color: var(--maroon); }
    .form-actions { display: flex; gap: 1rem; margin-top: 1.5rem; }
    .offers-list { display: flex; flex-direction: column; gap: 1rem; }
    .offer-card { display: grid; grid-template-columns: 300px 1fr; gap: 1.5rem; padding: 1.5rem; }
    .offer-card.inactive { opacity: 0.6; }
    .offer-preview { padding: 1.5rem; border-radius: var(--radius-sm); display: flex; flex-direction: column; gap: 0.75rem; min-height: 150px; }
    .preview-badge { align-self: flex-start; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
    .preview-btn { align-self: flex-start; padding: 0.5rem 1rem; border-radius: var(--radius-sm); border: none; cursor: pointer; font-weight: 600; }
    .offer-details { display: flex; flex-direction: column; justify-content: space-between; }
    .offer-meta { display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.85rem; color: var(--text-muted); }
    .status { padding: 0.25rem 0.5rem; border-radius: 4px; background: #e0e0e0; }
    .status.active { background: #e8f5e9; color: #2e7d32; }
    .offer-actions { display: flex; gap: 0.5rem; }
    .btn-small { padding: 0.4rem 0.8rem; font-size: 0.85rem; }
    .empty-state { text-align: center; color: var(--text-muted); padding: 3rem; }
    @media (max-width: 768px) { .offer-card { grid-template-columns: 1fr; } }
  `]
})
export class AdminOffersComponent implements OnInit {
  private api = inject(ApiService);

  loading = true;
  saving = false;
  showCreateForm = false;
  offers: SpecialOffer[] = [];
  newOffer: Partial<SpecialOffer> = {
    title: '',
    description: '',
    badgeText: '',
    buttonText: '',
    buttonLink: '',
    backgroundColor: 'linear-gradient(135deg, var(--maroon), var(--maroon-dark))',
    textColor: 'var(--cream)',
    badgeColor: 'badge-gold',
    buttonColor: 'btn-gold',
    displayOrder: 0,
    isActive: true
  };

  ngOnInit() {
    this.loadOffers();
  }

  loadOffers() {
    this.api.get<SpecialOffer[]>('/admin/special-offers').subscribe({
      next: (offers) => { this.offers = offers; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  resetForm() {
    this.newOffer = {
      title: '',
      description: '',
      badgeText: '',
      buttonText: '',
      buttonLink: '',
      backgroundColor: 'linear-gradient(135deg, var(--maroon), var(--maroon-dark))',
      textColor: 'var(--cream)',
      badgeColor: 'badge-gold',
      buttonColor: 'btn-gold',
      displayOrder: 0,
      isActive: true
    };
  }

  createOffer() {
    if (!this.newOffer.title || !this.newOffer.description || !this.newOffer.badgeText || 
        !this.newOffer.buttonText || !this.newOffer.buttonLink) {
      alert('Please fill in all required fields');
      return;
    }

    this.saving = true;
    this.api.post<SpecialOffer>('/admin/special-offers', this.newOffer).subscribe({
      next: () => {
        this.showCreateForm = false;
        this.resetForm();
        this.loadOffers();
        this.saving = false;
      },
      error: () => { alert('Failed to create offer'); this.saving = false; }
    });
  }

  editOffer(offer: SpecialOffer) {
    this.newOffer = { ...offer };
    this.showCreateForm = true;
  }

  toggleActive(offer: SpecialOffer) {
    this.api.put<SpecialOffer>(`/admin/special-offers/${offer.id}`, { ...offer, isActive: !offer.isActive }).subscribe({
      next: () => this.loadOffers(),
      error: () => alert('Failed to update offer')
    });
  }

  deleteOffer(id: string) {
    if (!confirm('Are you sure you want to delete this offer?')) return;
    
    this.api.delete(`/admin/special-offers/${id}`).subscribe({
      next: () => this.loadOffers(),
      error: () => alert('Failed to delete offer')
    });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
