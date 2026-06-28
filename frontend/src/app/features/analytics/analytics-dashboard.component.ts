import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { AnalyticsDashboard } from '../../core/models';

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe],
  template: `
    <h1>Founder Analytics</h1>
    @if (data) {
      <section class="section">
        <h2>💰 Sales Analytics</h2>
        <div class="metrics-grid">
          <div class="metric card"><span class="value">{{ data.sales.totalRevenue | currency:'INR':'symbol':'1.0-0' }}</span><span class="label">Total Revenue</span></div>
          <div class="metric card"><span class="value">{{ data.sales.todayRevenue | currency:'INR':'symbol':'1.0-0' }}</span><span class="label">Today</span></div>
          <div class="metric card"><span class="value">{{ data.sales.weekRevenue | currency:'INR':'symbol':'1.0-0' }}</span><span class="label">This Week</span></div>
          <div class="metric card"><span class="value">{{ data.sales.monthRevenue | currency:'INR':'symbol':'1.0-0' }}</span><span class="label">This Month</span></div>
          <div class="metric card"><span class="value">{{ data.sales.averageOrderValue | currency:'INR':'symbol':'1.0-0' }}</span><span class="label">Avg Order Value</span></div>
          <div class="metric card"><span class="value">{{ data.sales.totalOrders }}</span><span class="label">Total Orders</span></div>
        </div>
      </section>

      <section class="section">
        <h2>👥 Customer Behavior</h2>
        <div class="metrics-grid">
          <div class="metric card"><span class="value">{{ data.customers.repeatCustomerPercent | number:'1.0-1' }}%</span><span class="label">Repeat Customers</span></div>
          <div class="metric card"><span class="value">{{ data.customers.newCustomers }}</span><span class="label">New (30d)</span></div>
          <div class="metric card"><span class="value">{{ data.customers.returningCustomers }}</span><span class="label">Returning</span></div>
          <div class="metric card"><span class="value">{{ data.customers.totalCustomers }}</span><span class="label">Total Customers</span></div>
        </div>
      </section>

      <section class="section">
        <h2>📦 Product Insights</h2>
        <div class="two-col">
          <div class="card table-card">
            <h3>Top Selling</h3>
            @for (p of data.products.topSelling; track p.productId) {
              <div class="row"><span>{{ p.name }}</span><span>{{ p.unitsSold }} sold · {{ p.revenue | currency:'INR':'symbol':'1.0-0' }}</span></div>
            }
          </div>
          <div class="card table-card">
            <h3>Category Performance</h3>
            @for (c of data.products.categoryPerformance; track c.category) {
              <div class="row"><span>{{ c.category }}</span><span>{{ c.revenue | currency:'INR':'symbol':'1.0-0' }}</span></div>
            }
          </div>
        </div>
      </section>

      <section class="section">
        <h2>🔗 Referral Analytics</h2>
        <div class="metrics-grid">
          <div class="metric card"><span class="value">{{ data.referrals.conversionRate | number:'1.0-1' }}%</span><span class="label">Conversion Rate</span></div>
          <div class="metric card"><span class="value">{{ data.referrals.totalReferrals }}</span><span class="label">Total Referrals</span></div>
          <div class="metric card"><span class="value">{{ data.referrals.convertedReferrals }}</span><span class="label">Converted</span></div>
        </div>
      </section>

      <section class="section">
        <h2>🔄 Conversion Funnel</h2>
        <div class="funnel">
          @for (step of funnelSteps; track step.label) {
            <div class="funnel-step">
              <div class="funnel-bar" [style.width.%]="step.pct"></div>
              <span class="funnel-label">{{ step.label }}</span>
              <span class="funnel-count">{{ step.count }} ({{ step.pct | number:'1.0-0' }}%)</span>
            </div>
          }
        </div>
      </section>
    }
  `,
  styles: [`
    h1 { color: var(--maroon); margin-bottom: 2rem; }
    h2 { color: var(--maroon); margin-bottom: 1rem; font-size: 1.25rem; }
    h3 { color: var(--clay); margin-bottom: 0.75rem; font-size: 1rem; }
    .section { margin-bottom: 2.5rem; }
    .metrics-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }
    .metric { padding: 1.25rem; text-align: center; }
    .value { display: block; font-size: 1.5rem; font-weight: 700; color: var(--maroon); }
    .label { font-size: 0.8rem; color: var(--text-muted); }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .table-card { padding: 1.25rem; }
    .row { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--cream-dark); font-size: 0.9rem; }
    .funnel { display: flex; flex-direction: column; gap: 0.75rem; }
    .funnel-step { position: relative; background: var(--white); border-radius: var(--radius-sm); padding: 0.75rem 1rem; overflow: hidden; }
    .funnel-bar { position: absolute; left: 0; top: 0; bottom: 0; background: rgba(123,30,30,0.1); z-index: 0; }
    .funnel-label, .funnel-count { position: relative; z-index: 1; }
    .funnel-count { float: right; font-weight: 600; color: var(--maroon); }
    @media (max-width: 768px) { .two-col { grid-template-columns: 1fr; } }
  `]
})
export class AnalyticsDashboardComponent implements OnInit {
  private api = inject(ApiService);
  data: AnalyticsDashboard | null = null;
  funnelSteps: { label: string; count: number; pct: number }[] = [];

  ngOnInit() {
    this.api.get<AnalyticsDashboard>('/analytics/dashboard').subscribe(d => {
      this.data = d;
      const f = d.funnel;
      const max = Math.max(f.visits, 1);
      this.funnelSteps = [
        { label: 'Visits', count: f.visits, pct: 100 },
        { label: 'Product Views', count: f.productViews, pct: f.productViews / max * 100 },
        { label: 'Add to Cart', count: f.addToCarts, pct: f.addToCarts / max * 100 },
        { label: 'Checkout Started', count: f.checkoutStarts, pct: f.checkoutStarts / max * 100 },
        { label: 'Purchase', count: f.purchases, pct: f.purchases / max * 100 }
      ];
    });
  }
}
