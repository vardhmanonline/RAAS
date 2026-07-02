import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ComplianceCase, InvestorCrmOverview, LandDealSummary, PricingPlan, RevenueReport } from '../../core/models';

@Component({
  selector: 'app-investor-crm-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe, DatePipe, FormsModule],
  template: `
    <h1>Investor CRM & Land Registry</h1>

    @if (overview) {
      <section class="metrics-grid section">
        <article class="card metric"><span class="value">{{ overview.totalInvestors }}</span><span class="label">Investor Accounts</span></article>
        <article class="card metric"><span class="value">{{ overview.totalDeals }}</span><span class="label">Land Deals</span></article>
        <article class="card metric"><span class="value">{{ overview.totalCommittedCapital | currency:'INR':'symbol':'1.0-0' }}</span><span class="label">Committed Capital</span></article>
        <article class="card metric"><span class="value">{{ overview.registeredLandArea | number:'1.0-2' }} ac</span><span class="label">Registered Area</span></article>
        <article class="card metric"><span class="value">{{ overview.openComplianceCases }}</span><span class="label">Open Compliance Cases</span></article>
        <article class="card metric"><span class="value">{{ overview.whiteFunds | currency:'INR':'symbol':'1.0-0' }}</span><span class="label">White Funds</span></article>
        <article class="card metric"><span class="value">{{ overview.blackFunds | currency:'INR':'symbol':'1.0-0' }}</span><span class="label">Black Funds</span></article>
      </section>
    }

    <section class="section card">
      <h2>Revenue Report Filters</h2>
      <div class="filters">
        <label>
          Deal
          <select [(ngModel)]="filters.dealId" name="dealId">
            <option value="">All deals</option>
            @for (deal of deals; track deal.id) {
              <option [value]="deal.id">{{ deal.dealCode }} — {{ deal.title }}</option>
            }
          </select>
        </label>
        <label>
          Min Area (acres)
          <input type="number" step="0.01" [(ngModel)]="filters.minAreaInAcres" name="minAreaInAcres" />
        </label>
        <label>
          From
          <input type="date" [(ngModel)]="filters.from" name="from" />
        </label>
        <label>
          To
          <input type="date" [(ngModel)]="filters.to" name="to" />
        </label>
        <button type="button" (click)="loadRevenueReport()">Refresh Report</button>
      </div>

      @if (report) {
        <div class="metrics-grid">
          <article class="metric"><span class="value">{{ report.totalEarnings | currency:'INR':'symbol':'1.0-0' }}</span><span class="label">Total Earnings</span></article>
          <article class="metric"><span class="value">{{ report.investorPayouts | currency:'INR':'symbol':'1.0-0' }}</span><span class="label">Investor Payouts</span></article>
          <article class="metric"><span class="value">{{ report.netRevenue | currency:'INR':'symbol':'1.0-0' }}</span><span class="label">Net Revenue</span></article>
          <article class="metric"><span class="value">{{ report.dealCount }}</span><span class="label">Deals</span></article>
          <article class="metric"><span class="value">{{ report.totalLandArea | number:'1.0-2' }} ac</span><span class="label">Land Area</span></article>
        </div>
      }
    </section>

    <section class="section two-col">
      <article class="card">
        <h2>Flexible Pricing Modules</h2>
        @for (plan of pricingPlans; track plan.id) {
          <div class="row">
            <div>
              <strong>{{ plan.name }}</strong>
              <small>{{ plan.code }}</small>
            </div>
            <div class="price">{{ plan.monthlyPrice | currency:'INR':'symbol':'1.0-0' }}/mo</div>
            <ul>
              <li>Basic CRM: {{ plan.includesBasicCrm ? 'Yes' : 'No' }}</li>
              <li>Advanced Tracking: {{ plan.includesAdvancedTracking ? 'Yes' : 'No' }}</li>
              <li>Compliance Dashboards: {{ plan.includesComplianceDashboard ? 'Yes' : 'No' }}</li>
            </ul>
          </div>
        }
      </article>

      <article class="card">
        <h2>Compliance Monitoring</h2>
        @for (caseItem of complianceCases; track caseItem.id) {
          <div class="row">
            <div>
              <strong>{{ caseItem.alertType }}</strong>
              <small>{{ caseItem.severity }} · {{ caseItem.status }}</small>
            </div>
            <span>{{ caseItem.dueDate ? (caseItem.dueDate | date:'mediumDate') : 'No due date' }}</span>
          </div>
        } @empty {
          <p class="muted">No compliance cases yet.</p>
        }
      </article>
    </section>
  `,
  styles: [`
    h1 { color: var(--maroon); margin-bottom: 1.5rem; }
    h2 { color: var(--maroon); margin-bottom: 1rem; }
    .section { margin-bottom: 1.5rem; }
    .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; }
    .metric { padding: 0.9rem; border: 1px solid var(--cream-dark); border-radius: var(--radius-sm); background: white; }
    .metric.card { border: none; }
    .value { display: block; font-weight: 700; color: var(--maroon); font-size: 1.15rem; }
    .label { color: var(--text-muted); font-size: 0.8rem; }
    .card { background: white; border-radius: var(--radius-md); padding: 1rem; box-shadow: var(--shadow-sm); }
    .filters { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 0.75rem; align-items: end; margin-bottom: 1rem; }
    label { display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.85rem; }
    input, select, button { padding: 0.55rem 0.65rem; border-radius: 8px; border: 1px solid var(--cream-dark); }
    button { background: var(--maroon); color: #fff; cursor: pointer; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .row { border-top: 1px solid var(--cream-dark); padding: 0.75rem 0; }
    .row:first-child { border-top: 0; padding-top: 0; }
    .row small { display: block; color: var(--text-muted); }
    .price { font-weight: 700; color: var(--maroon); margin: 0.3rem 0; }
    .muted { color: var(--text-muted); }
    ul { margin: 0.4rem 0 0; padding-left: 1rem; color: var(--text-muted); }
    @media (max-width: 860px) { .two-col { grid-template-columns: 1fr; } }
  `]
})
export class InvestorCrmDashboardComponent implements OnInit {
  private api = inject(ApiService);

  overview: InvestorCrmOverview | null = null;
  report: RevenueReport | null = null;
  deals: LandDealSummary[] = [];
  pricingPlans: PricingPlan[] = [];
  complianceCases: ComplianceCase[] = [];

  filters = {
    dealId: '',
    minAreaInAcres: '',
    from: '',
    to: ''
  };

  ngOnInit() {
    this.api.get<InvestorCrmOverview>('/investorcrm/overview').subscribe(data => (this.overview = data));
    this.api.get<LandDealSummary[]>('/investorcrm/deals').subscribe(data => (this.deals = data));
    this.api.get<PricingPlan[]>('/investorcrm/pricing-plans').subscribe(data => (this.pricingPlans = data));
    this.api.get<ComplianceCase[]>('/investorcrm/compliance-cases').subscribe(data => (this.complianceCases = data));
    this.loadRevenueReport();
  }

  loadRevenueReport() {
    const params = new URLSearchParams();
    if (this.filters.dealId) params.set('dealId', this.filters.dealId);
    if (this.filters.minAreaInAcres) params.set('minAreaInAcres', this.filters.minAreaInAcres);
    if (this.filters.from) params.set('from', this.filters.from);
    if (this.filters.to) params.set('to', this.filters.to);

    const query = params.toString();
    const path = query ? `/investorcrm/revenue-report?${query}` : '/investorcrm/revenue-report';

    this.api.get<RevenueReport>(path).subscribe(data => (this.report = data));
  }
}
