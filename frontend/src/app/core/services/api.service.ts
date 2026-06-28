import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  get<T>(path: string) {
    return this.http.get<T>(`${this.baseUrl}${path}`, { headers: this.headers() });
  }

  post<T>(path: string, body: unknown) {
    return this.http.post<T>(`${this.baseUrl}${path}`, body, { headers: this.headers() });
  }

  put<T>(path: string, body: unknown) {
    return this.http.put<T>(`${this.baseUrl}${path}`, body, { headers: this.headers() });
  }

  delete<T>(path: string) {
    return this.http.delete<T>(`${this.baseUrl}${path}`, { headers: this.headers() });
  }

  private headers(): HttpHeaders {
    const token = localStorage.getItem('raas_token');
    const sessionId = localStorage.getItem('raas_session') ?? this.ensureSession();
    let h = new HttpHeaders({ 'X-Session-Id': sessionId });
    if (token) h = h.set('Authorization', `Bearer ${token}`);
    return h;
  }

  private ensureSession(): string {
    let id = localStorage.getItem('raas_session');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('raas_session', id);
    }
    return id;
  }
}
