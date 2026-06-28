import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="auth-page">
      <div class="auth-card card">
        <h1>Join RAAS</h1>
        <p>Create your account and get 10% off with WELCOME10</p>
        <form (ngSubmit)="register()">
          <input class="input" [(ngModel)]="form.fullName" name="name" placeholder="Full Name" required />
          <input class="input" type="email" [(ngModel)]="form.email" name="email" placeholder="Email" required />
          <input class="input" type="tel" [(ngModel)]="form.phone" name="phone" placeholder="Phone (optional)" />
          <input class="input" type="password" [(ngModel)]="form.password" name="password" placeholder="Password" required />
          <input class="input" [(ngModel)]="form.referralCode" name="ref" placeholder="Referral Code (optional)" />
          @if (error) { <p class="error">{{ error }}</p> }
          <button class="btn btn-primary full" type="submit" [disabled]="loading">{{ loading ? 'Creating...' : 'Create Account' }}</button>
        </form>
        <p class="switch">Already have an account? <a routerLink="/login">Login</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: 70vh; display: flex; align-items: center; justify-content: center; padding: 2rem; }
    .auth-card { padding: 2.5rem; width: 100%; max-width: 420px; }
    .auth-card h1 { color: var(--maroon); margin-bottom: 0.5rem; }
    .auth-card > p { color: var(--text-muted); margin-bottom: 2rem; }
    form { display: flex; flex-direction: column; gap: 1rem; }
    .full { width: 100%; }
    .error { color: #C62828; font-size: 0.9rem; }
    .switch { text-align: center; margin-top: 1.5rem; color: var(--text-muted); font-size: 0.9rem; }
  `]
})
export class RegisterComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  form = { fullName: '', email: '', phone: '', password: '', referralCode: '' };
  error = '';
  loading = false;

  ngOnInit() {
    this.route.queryParams.subscribe(p => {
      if (p['ref']) this.form.referralCode = p['ref'];
    });
  }

  register() {
    this.loading = true;
    this.auth.register(this.form).subscribe({
      next: () => this.router.navigate(['/']),
      error: err => { this.error = err.error?.message ?? 'Registration failed'; this.loading = false; }
    });
  }
}
