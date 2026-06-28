import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AuthResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private user = signal<AuthResponse | null>(this.loadUser());

  isLoggedIn = computed(() => !!this.user());
  isAdmin = computed(() => this.user()?.role === 'Admin');
  currentUser = computed(() => this.user());

  constructor(private api: ApiService, private router: Router) {}

  login(email: string, password: string) {
    return this.api.post<AuthResponse>('/auth/login', { email, password }).pipe(
      tap(res => this.setSession(res))
    );
  }

  register(data: { email: string; password: string; fullName: string; phone?: string; referralCode?: string }) {
    return this.api.post<AuthResponse>('/auth/register', data).pipe(
      tap(res => this.setSession(res))
    );
  }

  logout() {
    localStorage.removeItem('raas_token');
    localStorage.removeItem('raas_user');
    this.user.set(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem('raas_token');
  }

  private setSession(res: AuthResponse) {
    localStorage.setItem('raas_token', res.token);
    localStorage.setItem('raas_user', JSON.stringify(res));
    this.user.set(res);
  }

  private loadUser(): AuthResponse | null {
    const raw = localStorage.getItem('raas_user');
    return raw ? JSON.parse(raw) : null;
  }
}
