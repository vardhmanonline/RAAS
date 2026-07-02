import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/services/api.service';

interface StoreSettings {
  supportEmail: string;
  supportPhone: string;
  companyName: string;
  companyTagline: string;
  companyDescription: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          <span class="footer-brand-badge">Crafted in Rajasthan</span>
          <h3 class="footer-logo"><span class="footer-logo-icon">🪷</span><span class="footer-logo-text">{{ settings?.companyName || 'RAAS' }}</span></h3>
          <p class="footer-tagline">{{ settings?.companyTagline || 'Taste the Roots of Rajasthan' }}</p>
          <p class="footer-desc">{{ settings?.companyDescription || 'Authentic pickles, papads, masalas & chutneys crafted with love from Rajasthani kitchens.' }}</p>
        </div>
        <div class="footer-column">
          <h4>Shop</h4>
          <a routerLink="/products" [queryParams]="{category: 'pickles'}">Pickles</a>
          <a routerLink="/products" [queryParams]="{category: 'papad'}">Papad</a>
          <a routerLink="/products" [queryParams]="{category: 'masalas'}">Masalas</a>
          <a routerLink="/products" [queryParams]="{category: 'chutneys'}">Chutneys</a>
        </div>
        <div class="footer-column">
          <h4>Support</h4>
          <a href="mailto:{{ settings?.supportEmail }}">{{ settings?.supportEmail || 'support.rajasthan@gmail.com' }}</a>
          <a href="tel:{{ formattedPhone }}">{{ settings?.supportPhone || '+91 84277 67533' }}</a>
          <a routerLink="/referrals">Refer & Earn ₹50</a>
        </div>
        <div class="footer-column">
          <h4>Made in Rajasthan 🇮🇳</h4>
          <p>FSSAI Certified<br>100% Natural Ingredients<br>No Artificial Preservatives</p>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container footer-bottom-content">
          <span>© 2026 {{ settings?.companyName || 'RAAS' }}. All rights reserved.</span>
          <span>Heritage flavours, thoughtfully delivered.</span>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      position: relative;
      overflow: hidden;
      background: linear-gradient(180deg, #6a1616 0%, #4f1212 100%);
      color: var(--cream);
      margin-top: 3rem;
    }
    .footer::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at top left, rgba(201, 168, 96, 0.18), transparent 30%),
        radial-gradient(circle at bottom right, rgba(255, 255, 255, 0.08), transparent 26%);
      pointer-events: none;
    }
    .footer-grid {
      position: relative;
      display: grid;
      grid-template-columns: minmax(0, 1.8fr) repeat(3, minmax(0, 1fr));
      gap: 1.25rem;
      padding: 3.75rem 1.25rem 3rem;
      align-items: stretch;
    }
    .footer-brand,
    .footer-column {
      position: relative;
      border: 1px solid rgba(250, 243, 224, 0.12);
      border-radius: 24px;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
      padding: 1.5rem;
    }
    .footer-brand {
      padding: 1.75rem;
      background: linear-gradient(145deg, rgba(255, 255, 255, 0.12), rgba(201, 168, 96, 0.08) 55%, rgba(255, 255, 255, 0.03));
    }
    .footer-brand-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      margin-bottom: 1rem;
      padding: 0.35rem 0.8rem;
      border-radius: 999px;
      background: rgba(201, 168, 96, 0.16);
      color: var(--cream);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }
    .footer-logo { font-family: var(--font-display); font-size: 2.4rem; margin-bottom: 0.75rem; letter-spacing: 2px; color: var(--cream); display: flex; align-items: center; gap: 0.75rem; line-height: 1.1; }
    .footer-logo-icon {
      width: 3rem;
      height: 3rem;
      border-radius: 18px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1.7rem;
      background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.28), rgba(201, 168, 96, 0.12));
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
    }
    .footer-logo-text { color: var(--gold); font-weight: 700; }
    .footer-tagline { color: var(--gold); font-style: italic; margin-bottom: 0.75rem; font-size: 1rem; }
    .footer-desc { max-width: 32rem; opacity: 0.9; font-size: 0.95rem; line-height: 1.8; }
    h4 { font-family: var(--font-display); margin-bottom: 1rem; color: var(--gold); font-size: 1.05rem; letter-spacing: 0.08em; }
    a { display: block; width: fit-content; color: var(--cream); opacity: 0.88; margin-bottom: 0.7rem; font-size: 0.92rem; }
    a:hover { opacity: 1; color: var(--gold); }
    p { opacity: 0.85; font-size: 0.9rem; line-height: 1.8; }
    .footer-bottom {
      position: relative;
      border-top: 1px solid rgba(255,255,255,0.12);
      background: rgba(0, 0, 0, 0.12);
    }
    .footer-bottom-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 1rem 1.25rem;
      opacity: 0.7;
      font-size: 0.85rem;
      flex-wrap: wrap;
    }
    @media (max-width: 1024px) {
      .footer-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .footer-brand { grid-column: 1 / -1; }
    }
    @media (max-width: 768px) {
      .footer-grid { padding-top: 3rem; }
      .footer-logo { font-size: 2rem; }
    }
    @media (max-width: 480px) {
      .footer-grid { grid-template-columns: 1fr; }
      .footer-brand { grid-column: auto; }
      .footer-logo { font-size: 1.875rem; }
      .footer-brand,
      .footer-column { padding: 1.25rem; }
    }
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
