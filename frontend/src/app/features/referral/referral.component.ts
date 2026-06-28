import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { ReferralDashboard } from '../../core/models';

@Component({
  selector: 'app-referral',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  template: `
  <div class="container page">
    <h1 class="section-title">Refer & Earn ₹50</h1>
    <p class="section-subtitle">Share RAAS with friends and earn rewards on every successful referral</p>

    @if (dashboard) {
      <div class="referral-hero card">
        <div class="code-box">
          <span class="code-label">Your Referral Code</span>
          <span class="code">{{ dashboard.referralCode }}</span>
        </div>
        <div class="stats">
          <div><strong>{{ dashboard.totalEarnings | currency:'INR':'symbol':'1.0-0' }}</strong><span>Total Earned</span></div>
          <div><strong>{{ dashboard.totalReferrals }}</strong><span>Referrals</span></div>
          <div><strong>{{ dashboard.pendingReferrals }}</strong><span>Pending</span></div>
        </div>
        <button class="btn btn-primary" (click)="shareWhatsApp()">📱 Share on WhatsApp</button>
        <button class="btn btn-secondary" (click)="copyCode()">Copy Code</button>
      </div>

      <h3 class="history-title">Referral History</h3>
      @for (r of history; track r.date) {
        <div class="history-item card">
          <div>
            <strong>{{ r.referredUserName }}</strong>
            <span class="date">{{ r.date | date:'mediumDate' }}</span>
          </div>
          <div>
            <span class="reward">{{ r.reward | currency:'INR':'symbol':'1.0-0' }}</span>
            <span class="status" [class.rewarded]="r.isRewarded">{{ r.isRewarded ? 'Rewarded' : 'Pending' }}</span>
          </div>
        </div>
      }
    }
  </div>
  `,
  styles: [`
    .page { padding: 2rem 0; }
    .referral-hero { padding: 2rem; text-align: center; margin-bottom: 2rem; }
    .code-box { margin-bottom: 2rem; }
    .code-label { display: block; color: var(--text-muted); font-size: 0.9rem; margin-bottom: 0.5rem; }
    .code { font-size: 2.5rem; font-weight: 700; color: var(--maroon); letter-spacing: 4px; font-family: monospace; }
    .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
    .stats div { padding: 1rem; background: var(--cream); border-radius: var(--radius-sm); }
    .stats strong { display: block; font-size: 1.5rem; color: var(--maroon); }
    .stats span { font-size: 0.85rem; color: var(--text-muted); }
    .referral-hero .btn { margin: 0.25rem; }
    .history-title { color: var(--maroon); margin-bottom: 1rem; }
    .history-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem; margin-bottom: 0.5rem; }
    .date { display: block; font-size: 0.85rem; color: var(--text-muted); }
    .reward { font-weight: 700; color: var(--maroon); margin-right: 0.75rem; }
    .status { font-size: 0.8rem; padding: 0.2rem 0.6rem; border-radius: 50px; background: #FFF3E0; color: #E65100; }
    .status.rewarded { background: #E8F5E9; color: #2E7D32; }
  `]
})
export class ReferralComponent implements OnInit {
  private api = inject(ApiService);
  dashboard: ReferralDashboard | null = null;
  history: { referredUserName: string; date: string; reward: number; isRewarded: boolean }[] = [];

  ngOnInit() {
    this.api.get<ReferralDashboard>('/users/referrals').subscribe(d => this.dashboard = d);
    this.api.get<typeof this.history>('/users/referrals/history').subscribe(h => this.history = h);
  }

  shareWhatsApp() {
    if (!this.dashboard) return;
    window.open(`https://wa.me/?text=${encodeURIComponent(this.dashboard.shareMessage)}`, '_blank');
  }

  copyCode() {
    if (!this.dashboard) return;
    navigator.clipboard.writeText(this.dashboard.referralCode);
    alert('Code copied!');
  }
}
