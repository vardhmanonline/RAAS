import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="container footer-grid">
        <div>
          <h3 class="footer-logo">🪷 RAAS</h3>
          <p class="footer-tagline">Taste the Roots of Rajasthan</p>
          <p class="footer-desc">Authentic pickles, papads, masalas & chutneys crafted with love from Rajasthani kitchens.</p>
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
          <a href="mailto:support&#64;raas.in">support&#64;raas.in</a>
          <a href="tel:+919876543210">+91 98765 43210</a>
          <a routerLink="/referrals">Refer & Earn ₹50</a>
        </div>
        <div>
          <h4>Made in Rajasthan 🇮🇳</h4>
          <p>FSSAI Certified<br>100% Natural Ingredients<br>No Artificial Preservatives</p>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container">© 2026 RAAS. All rights reserved.</div>
      </div>
    </footer>
  `,
  styles: [`
    .footer { background: var(--maroon); color: var(--cream); margin-top: 3rem; }
    .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 2rem; padding: 3rem 1.25rem; }
    .footer-logo { font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 0.5rem; }
    .footer-tagline { color: var(--gold); font-style: italic; margin-bottom: 0.75rem; }
    .footer-desc { opacity: 0.85; font-size: 0.9rem; line-height: 1.7; }
    h4 { font-family: var(--font-display); margin-bottom: 1rem; color: var(--gold); }
    a { display: block; color: var(--cream); opacity: 0.85; margin-bottom: 0.5rem; font-size: 0.9rem; }
    a:hover { opacity: 1; color: var(--gold); }
    p { opacity: 0.85; font-size: 0.9rem; line-height: 1.8; }
    .footer-bottom { border-top: 1px solid rgba(255,255,255,0.15); padding: 1rem 0; text-align: center; opacity: 0.7; font-size: 0.85rem; }
    @media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 480px) { .footer-grid { grid-template-columns: 1fr; } }
  `]
})
export class FooterComponent {}
