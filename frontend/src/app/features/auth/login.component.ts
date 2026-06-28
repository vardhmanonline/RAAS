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
        <h1>Welcome Back</h1>
        <p>Login to your RAAS account</p>
        <form (ngSubmit)="login()">
          <input class="input" type="email" [(ngModel)]="email" name="email" placeholder="Email" required />
          <input class="input" type="password" [(ngModel)]="password" name="password" placeholder="Password" required />
          @if (error) { <p class="error">{{ error }}</p> }
          <button class="btn btn-primary full" type="submit" [disabled]="loading">{{ loading ? 'Logging in...' : 'Login' }}</button>
        </form>
        <p class="switch">Don't have an account? <a routerLink="/register">Register</a></p>
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
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  email = '';
  password = '';
  error = '';
  loading = false;

  login() {
    this.loading = true;
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: res => this.router.navigate(res.role === 'Admin' ? ['/admin'] : ['/']),
      error: () => { this.error = 'Invalid email or password'; this.loading = false; }
    });
  }
}
