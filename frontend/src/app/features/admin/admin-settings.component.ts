import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

interface StoreSettings {
  sampleOrderEnabled: boolean;
  freeDeliveryThreshold: number;
  recentPurchaseCount: number;
  recentPurchaseDays: number;
  lowStockThreshold: number;
  supportEmail: string;
  supportPhone: string;
  companyName: string;
  companyTagline: string;
  companyDescription: string;
  logoUrl: string;
  mainTagline: string;
  secondaryTagline: string;
  websiteUrl: string;
  fssaiStatus: string;
  gstStatus: string;
  manufacturingLocation: string;
}

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="settings-page">
      <h1>Store Settings</h1>

      @if (loading) {
        <p class="loading">Loading settings...</p>
      } @else {
        <div class="settings-grid">

          <div class="setting-card card">
            <div class="setting-header">
              <div>
                <h3>Free Sample Orders</h3>
                <p>Allow new registered customers to claim a one-time free sample pack of all products.</p>
              </div>
              <label class="toggle">
                <input type="checkbox" [(ngModel)]="settings.sampleOrderEnabled" />
                <span class="slider"></span>
              </label>
            </div>
            <div class="setting-status" [class.enabled]="settings.sampleOrderEnabled">
              {{ settings.sampleOrderEnabled ? '✅ Enabled — new customers can claim samples' : '🚫 Disabled — sample claiming is off' }}
            </div>
          </div>

          <div class="setting-card card">
            <h3>Free Delivery Threshold</h3>
            <p>Orders above this amount qualify for free delivery. Currently set to <strong>₹{{ settings.freeDeliveryThreshold }}</strong>.</p>
            <div class="threshold-input">
              <span class="currency">₹</span>
              <input class="input" type="number" [(ngModel)]="settings.freeDeliveryThreshold" min="0" step="50" />
            </div>
            <p class="hint">Set to 0 to offer free delivery on all orders.</p>
          </div>

          <div class="setting-card card">
            <h3>Product Urgency Messaging</h3>
            <p>Configure social proof and low-stock urgency values shown on product detail pages.</p>
            <div class="branding-form">
              <label>Recent Buyers Count</label>
              <input class="input" type="number" [(ngModel)]="settings.recentPurchaseCount" min="0" step="1" />
              
              <label>Recent Buyers Days Window</label>
              <input class="input" type="number" [(ngModel)]="settings.recentPurchaseDays" min="1" step="1" />
              
              <label>Low Stock Alert Threshold</label>
              <input class="input" type="number" [(ngModel)]="settings.lowStockThreshold" min="0" step="1" />
            </div>
          </div>

          <div class="setting-card card">
            <h3>Contact Information</h3>
            <p>Customer support contact details displayed in the footer and contact sections.</p>
            <div class="contact-form">
              <label>Support Email</label>
              <input class="input" type="email" [(ngModel)]="settings.supportEmail" placeholder="support@example.com" />
              
              <label>Support Phone</label>
              <input class="input" type="text" [(ngModel)]="settings.supportPhone" placeholder="+91 84277 67533" />
            </div>
          </div>

          <div class="setting-card card">
            <h3>Company Branding</h3>
            <p>Company information displayed across the application.</p>
            <div class="branding-form">
              <label>Company Name</label>
              <input class="input" type="text" [(ngModel)]="settings.companyName" placeholder="RAAS" />
              
              <label>Company Tagline</label>
              <input class="input" type="text" [(ngModel)]="settings.companyTagline" placeholder="Taste the Roots of Rajasthan" />
              
              <label>Company Description</label>
              <textarea class="input" [(ngModel)]="settings.companyDescription" rows="3" placeholder="Brief description of your company"></textarea>
            </div>
          </div>

          <div class="setting-card card">
            <h3>Logo & Taglines</h3>
            <p>Logo and Hindi taglines for branding.</p>
            <div class="branding-form">
              <label>Logo URL</label>
              <input class="input" type="text" [(ngModel)]="settings.logoUrl" placeholder="https://example.com/logo.png" />
              @if (settings.logoUrl) {
                <div class="logo-preview">
                  <img [src]="settings.logoUrl" alt="Logo preview" />
                </div>
              }
              
              <label>Main Tagline (Hindi)</label>
              <input class="input" type="text" [(ngModel)]="settings.mainTagline" placeholder="राजस्थान का स्वाद, हर बाइट में खास!" />
              
              <label>Secondary Tagline (Hindi)</label>
              <input class="input" type="text" [(ngModel)]="settings.secondaryTagline" placeholder="देसी स्वाद, शुद्ध विश्वास" />
            </div>
          </div>

          <div class="setting-card card">
            <h3>Business Details</h3>
            <p>Additional business information for certifications and location.</p>
            <div class="branding-form">
              <label>Website URL</label>
              <input class="input" type="text" [(ngModel)]="settings.websiteUrl" placeholder="rajasthaniras.com" />
              
              <label>FSSAI Status</label>
              <input class="input" type="text" [(ngModel)]="settings.fssaiStatus" placeholder="FSSAI Registered" />
              
              <label>GST Status</label>
              <input class="input" type="text" [(ngModel)]="settings.gstStatus" placeholder="GST Registered" />
              
              <label>Manufacturing Location</label>
              <input class="input" type="text" [(ngModel)]="settings.manufacturingLocation" placeholder="Made in India" />
            </div>
          </div>

        </div>

        @if (saved) {
          <div class="success-banner">✅ Settings saved successfully!</div>
        }
        @if (error) {
          <div class="error-banner">❌ {{ error }}</div>
        }

        <button class="btn btn-primary save-btn" (click)="save()" [disabled]="saving">
          {{ saving ? 'Saving...' : 'Save Settings' }}
        </button>
      }
    </div>
  `,
  styles: [`
    .settings-page h1 { color: var(--maroon); margin-bottom: 2rem; }
    .loading { color: var(--text-muted); }
    .settings-grid { display: flex; flex-direction: column; gap: 1.5rem; max-width: 640px; }
    .setting-card { padding: 1.5rem; }
    .setting-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 1rem; }
    .setting-header h3 { color: var(--maroon); margin: 0 0 0.4rem; }
    .setting-header p, .setting-card > p { color: var(--text-muted); font-size: 0.9rem; line-height: 1.5; margin: 0; }
    .setting-status { margin-top: 0.75rem; font-size: 0.85rem; color: var(--text-muted); }
    .setting-status.enabled { color: #2e7d32; }
    .toggle { position: relative; display: inline-block; width: 52px; height: 28px; flex-shrink: 0; }
    .toggle input { opacity: 0; width: 0; height: 0; }
    .slider { position: absolute; inset: 0; background: #ccc; border-radius: 28px; cursor: pointer; transition: 0.3s; }
    .slider:before { content: ''; position: absolute; width: 22px; height: 22px; left: 3px; top: 3px; background: white; border-radius: 50%; transition: 0.3s; }
    input:checked + .slider { background: var(--maroon); }
    input:checked + .slider:before { transform: translateX(24px); }
    .threshold-input { display: flex; align-items: center; gap: 0.5rem; margin-top: 1rem; }
    .currency { font-size: 1.1rem; font-weight: 600; color: var(--maroon); }
    .threshold-input .input { width: 140px; }
    .hint { font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem; }
    .contact-form, .branding-form { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem; }
    .contact-form label, .branding-form label { font-size: 0.85rem; color: var(--text-muted); font-weight: 600; }
    .contact-form .input, .branding-form .input { width: 100%; }
    .branding-form textarea { resize: vertical; min-height: 80px; }
    .logo-preview { margin-top: 0.5rem; padding: 1rem; border: 2px dashed var(--cream-dark); border-radius: var(--radius-sm); text-align: center; }
    .logo-preview img { max-width: 200px; max-height: 100px; object-fit: contain; }
    .save-btn { margin-top: 1.5rem; }
    .success-banner { background: #e8f5e9; color: #2e7d32; padding: 0.75rem 1rem; border-radius: 8px; margin-top: 1rem; font-size: 0.9rem; }
    .error-banner { background: #ffebee; color: #c62828; padding: 0.75rem 1rem; border-radius: 8px; margin-top: 1rem; font-size: 0.9rem; }
    @media (max-width: 768px) {
      .settings-grid { max-width: none; }
      .setting-card { padding: 1rem; }
      .setting-header { flex-direction: column; align-items: stretch; }
      .threshold-input .input { width: 100%; }
      .save-btn { width: 100%; }
    }
  `]
})
export class AdminSettingsComponent implements OnInit {
  private api = inject(ApiService);

  loading = true;
  saving = false;
  saved = false;
  error = '';
  settings: StoreSettings = { 
    sampleOrderEnabled: true, 
    freeDeliveryThreshold: 499,
    recentPurchaseCount: 23,
    recentPurchaseDays: 7,
    lowStockThreshold: 20,
    supportEmail: 'support.rajasthaniras@gmail.com',
    supportPhone: '+91 84277 67533',
    companyName: 'RAAS',
    companyTagline: 'Taste the Roots of Rajasthan',
    companyDescription: 'Authentic pickles, papads, masalas & chutneys crafted with love from Rajasthani kitchens.',
    logoUrl: '',
    mainTagline: 'राजस्थान का स्वाद, हर बाइट में खास!',
    secondaryTagline: 'देसी स्वाद, शुद्ध विश्वास',
    websiteUrl: 'rajasthaniras.com',
    fssaiStatus: 'FSSAI Registered',
    gstStatus: 'GST Registered',
    manufacturingLocation: 'Made in India'
  };

  ngOnInit() {
    this.api.get<StoreSettings>('/admin/settings').subscribe({
      next: s => { this.settings = s; this.loading = false; },
      error: () => { this.error = 'Failed to load settings'; this.loading = false; }
    });
  }

  save() {
    this.saving = true;
    this.saved = false;
    this.error = '';
    this.api.put<StoreSettings>('/admin/settings', this.settings).subscribe({
      next: s => { this.settings = s; this.saving = false; this.saved = true; setTimeout(() => this.saved = false, 3000); },
      error: () => { this.error = 'Failed to save settings'; this.saving = false; }
    });
  }
}
