import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/services/api.service';

interface StoreSettings {
  supportEmail: string;
  supportPhone: string;
  companyName: string;
  companyTagline: string;
  companyDescription: string;
  logoUrl?: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          @if (settings?.logoUrl) {
            <div class="footer-logo-wrap">
              <img [src]="settings?.logoUrl" [alt]="settings?.companyName || 'RAAS'" class="footer-logo-image" />
            </div>
          } @else {
            <h3 class="footer-logo">🪷 {{ settings?.companyName || 'RAAS' }}</h3>
          }
          <p class="footer-tagline">{{ settings?.companyTagline || 'Taste the Roots of Rajasthan' }}</p>
          <p class="footer-desc">{{ settings?.companyDescription || 'Authentic pickles, papads, masalas & chutneys crafted with love from Rajasthani kitchens.' }}</p>
        </div>
        <div>
          <h4>Shop</h4>
          <a routerLink="/products" [queryParams]="{category: 'pickles'}">Pickles</a>
          <a routerLink="/products" [queryParams]="{category: 'papad'}">Papad</a>
          <a routerLink="/products" [queryParams]="{category: 'masalas'}">Masalas</a>
          <a routerLink="/products" [queryParams]="{category: 'chutneys'}">Chutneys</a>
        </div>
        <div>
          <h4>Support</h4>
          <a href="mailto:{{ settings?.supportEmail }}">{{ settings?.supportEmail || 'support.rajasthan@gmail.com' }}</a>
          <a href="tel:{{ formattedPhone }}">{{ settings?.supportPhone || '+91 84277 67533' }}</a>
          <a routerLink="/referrals">Refer & Earn ₹50</a>
        </div>
        <div>
          <h4>Made in Rajasthan 🇮🇳</h4>
          <p>FSSAI Certified<br>100% Natural Ingredients<br>No Artificial Preservatives</p>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container">© 2026 {{ settings?.companyName || 'RAAS' }}. All rights reserved.</div>
      </div>
    </footer>
  `,
  styles: [`
    .footer { background: var(--maroon); color: var(--cream); margin-top: 3rem; }
    .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 2rem; padding: 3rem 1.25rem; }
    .footer-brand { display: flex; flex-direction: column; gap: 0.75rem; }
    .footer-logo-wrap { display: inline-flex; align-items: center; padding: 0.75rem; background: rgba(255,255,255,0.08); border-radius: 16px; width: fit-content; }
    .footer-logo-image { height: 88px; width: auto; max-width: min(100%, 300px); object-fit: contain; display: block; }
    .footer-logo { font-family: var(--font-display); font-size: 1.8rem; margin-bottom: 0.25rem; }
    .footer-tagline { color: var(--gold); font-style: italic; margin-bottom: 0.25rem; }
    .footer-desc { opacity: 0.9; font-size: 0.95rem; line-height: 1.75; max-width: 36ch; }
    h4 { font-family: var(--font-display); margin-bottom: 1rem; color: var(--gold); }
    a { display: block; color: var(--cream); opacity: 0.85; margin-bottom: 0.5rem; font-size: 0.9rem; }
    a:hover { opacity: 1; color: var(--gold); }
    p { opacity: 0.85; font-size: 0.9rem; line-height: 1.8; }
    .footer-bottom { border-top: 1px solid rgba(255,255,255,0.15); padding: 1rem 0; text-align: center; opacity: 0.7; font-size: 0.85rem; }
    @media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr 1fr; } .footer-logo-image { height: 72px; } }
    @media (max-width: 480px) { .footer-grid { grid-template-columns: 1fr; padding: 2.25rem 1rem; } .footer-logo-image { height: 64px; max-width: 240px; } .footer-logo { font-size: 1.6rem; } .footer-desc { max-width: 100%; } }
  `]
})
export class FooterComponent implements OnInit {
  private api = inject(ApiService);
  settings: StoreSettings | null = null;

  ngOnInit() {
    this.api.get<StoreSettings>('/store/settings').subscribe({
      next: (settings) => this.settings = settings,
      error: () => {
        // Fallback to defaults if API fails
        this.settings = {
          supportEmail: 'support.rajasthan@gmail.com',
          supportPhone: '+91 84277 67533',
          companyName: 'RAAS',
          companyTagline: 'Taste the Roots of Rajasthan',
          companyDescription: 'Authentic pickles, papads, masalas & chutneys crafted with love from Rajasthani kitchens.'
        };
      }
    });
  }

  get formattedPhone(): string {
    return this.settings?.supportPhone?.replace(/\s/g, '') || '+918427767533';
  }
}
