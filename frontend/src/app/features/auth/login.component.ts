import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="auth-page">
      <div class="auth-card card">
        <div class="brand-header">
          <div class="brand-lotus">🪷</div>
          <h1>RAAS</h1>
          <p class="tagline">Taste the Roots of Rajasthan</p>
        </div>
        <form (ngSubmit)="login()">
          <input class="input" type="email" [(ngModel)]="email" name="email" placeholder="Email" required />
          <input class="input" type="password" [(ngModel)]="password" name="password" placeholder="Password" required />
          @if (error) { <p class="error">{{ error }}</p> }
          <button class="btn btn-primary full" type="submit" [disabled]="loading">
            {{ loading ? 'Entering the Royal Kitchen…' : 'Enter RAAS' }}
          </button>
        </form>
        <p class="switch">New to RAAS? <a routerLink="/register">Create Account</a></p>
      </div>
    </div>

    @if (showWelcome) {
      <div class="welcome-overlay" (click)="dismissWelcome()">
        <div class="welcome-modal" (click)="$event.stopPropagation()">
          <button class="welcome-close" (click)="dismissWelcome()" aria-label="Close">✕</button>
          <div class="welcome-pattern"></div>
          <div class="welcome-content">
            <div class="welcome-emblem">🪷</div>
            <div class="welcome-title-group">
              <p class="welcome-namaste">Namaste!!</p>
              <h2 class="welcome-name">{{ welcomeName }}</h2>
              <p class="welcome-subtitle">Welcome back to the Royal Kitchen of Rajasthan</p>
            </div>
            <div class="welcome-divider">
              <span>✦</span><span>✦</span><span>✦</span>
            </div>
            <p class="welcome-message">
              Every jar in our collection is crafted with <strong>centuries-old recipes</strong> from the desert kitchens of Jodhpur & Bikaner —
              using only the finest sun-dried spices, cold-pressed mustard oil, and hand-picked ingredients straight from Rajasthan's heartland.
            </p>
            <div class="welcome-highlights">
              <div class="highlight">
                <span class="hi">🌶️</span>
                <span>Authentic Rajasthani Masalas</span>
              </div>
              <div class="highlight">
                <span class="hi">🥒</span>
                <span>Traditional Achars & Pickles</span>
              </div>
              <div class="highlight">
                <span class="hi">✋</span>
                <span>Handcrafted with Love</span>
              </div>
            </div>
            <button class="btn btn-primary welcome-cta" (click)="dismissWelcome()">
              Explore Royal Collection →
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .auth-page { min-height: 70vh; display: flex; align-items: center; justify-content: center; padding: 2rem; }
    .auth-card { padding: 2.5rem; width: 100%; max-width: 420px; }
    .brand-header { text-align: center; margin-bottom: 2rem; }
    .brand-lotus { font-size: 2.5rem; margin-bottom: 0.5rem; }
    .brand-header h1 { color: var(--maroon); font-size: 2rem; letter-spacing: 4px; font-family: var(--font-display); }
    .tagline { color: var(--text-muted); font-size: 0.85rem; font-style: italic; margin-top: 0.25rem; }
    form { display: flex; flex-direction: column; gap: 1rem; }
    .full { width: 100%; }
    .error { color: #C62828; font-size: 0.9rem; }
    .switch { text-align: center; margin-top: 1.5rem; color: var(--text-muted); font-size: 0.9rem; }

    /* Welcome overlay */
    .welcome-overlay { position: fixed; inset: 0; background: rgba(44,24,16,0.75); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 1rem; animation: fadeIn 0.3s ease; overflow-y: auto; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .welcome-modal { background: var(--cream); border-radius: 24px; max-width: 520px; width: 100%; overflow: hidden; box-shadow: 0 24px 80px rgba(123,30,30,0.4); animation: slideUp 0.4s ease; position: relative; max-height: 90vh; overflow-y: auto; }
    @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .welcome-close { position: absolute; top: 0.75rem; right: 0.75rem; z-index: 10; background: rgba(255,255,255,0.9); border: none; border-radius: 50%; width: 36px; height: 36px; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--maroon); font-weight: 700; box-shadow: 0 2px 8px rgba(0,0,0,0.15); transition: all 0.2s; -webkit-tap-highlight-color: transparent; }
    .welcome-close:hover, .welcome-close:active { background: white; box-shadow: 0 4px 12px rgba(0,0,0,0.2); transform: scale(1.1); }
    .welcome-pattern { height: 8px; background: linear-gradient(90deg, var(--maroon), var(--saffron), var(--gold), var(--saffron), var(--maroon)); }
    .welcome-content { padding: 2.5rem; text-align: center; }
    .welcome-emblem { font-size: 3.5rem; margin-bottom: 0.75rem; }
    .welcome-namaste { font-size: 1rem; color: var(--saffron); font-weight: 600; letter-spacing: 2px; margin-bottom: 0.25rem; }
    .welcome-name { font-family: var(--font-display); font-size: 2rem; color: var(--maroon); margin: 0 0 0.25rem; }
    .welcome-subtitle { color: var(--text-muted); font-size: 0.9rem; font-style: italic; }
    .welcome-divider { display: flex; justify-content: center; gap: 0.75rem; margin: 1.25rem 0; color: var(--gold); font-size: 0.7rem; }
    .welcome-message { color: var(--text); line-height: 1.7; font-size: 0.95rem; margin-bottom: 1.5rem; }
    .welcome-highlights { display: flex; justify-content: center; gap: 1.5rem; flex-wrap: wrap; margin-bottom: 2rem; }
    .highlight { display: flex; flex-direction: column; align-items: center; gap: 0.4rem; font-size: 0.8rem; color: var(--text-muted); font-weight: 500; }
    .hi { font-size: 1.75rem; }
    .welcome-cta { width: 100%; font-size: 1rem; padding: 1rem; letter-spacing: 0.5px; }

    @media (max-width: 480px) {
      .auth-page { padding: 1rem; min-height: auto; }
      .auth-card { padding: 1.25rem; }
      .brand-header { margin-bottom: 1.25rem; }
      .brand-header h1 { font-size: 1.6rem; letter-spacing: 2px; }
    }

    @media (max-width: 480px) {
      .welcome-overlay { align-items: flex-start; padding: 0.5rem; }
      .welcome-modal { border-radius: 16px; margin: auto; }
      .welcome-content { padding: 1.5rem 1.25rem; }
      .welcome-emblem { font-size: 2.5rem; }
      .welcome-name { font-size: 1.5rem; }
      .welcome-message { font-size: 0.875rem; }
      .welcome-highlights { gap: 1rem; }
    }

    @media (max-width: 360px) {
      .auth-card { padding: 1rem; }
      .welcome-content { padding: 1.1rem 0.9rem; }
      .welcome-cta { font-size: 0.9rem; }
    }
  `]
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  email = '';
  password = '';
  error = '';
  loading = false;
  showWelcome = false;
  welcomeName = '';

  login() {
    this.loading = true;
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: res => {
        this.loading = false;
        if (res.role === 'Admin') {
          this.router.navigate(['/admin']);
        } else {
          this.welcomeName = res.fullName.split(' ')[0];
          this.showWelcome = true;
        }
      },
      error: () => { this.error = 'Invalid email or password'; this.loading = false; }
    });
  }

  dismissWelcome() {
    this.showWelcome = false;
    this.router.navigate(['/']);
  }
}
