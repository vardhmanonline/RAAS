import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { HeaderComponent } from './layout/header.component';
import { FooterComponent } from './layout/footer.component';
import { AnalyticsTracker } from './core/services/analytics-tracker.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <app-header />
    <main class="main-content mandala-bg">
      <router-outlet />
    </main>
    <app-footer />
  `,
  styles: [`.main-content { min-height: calc(100vh - 140px); padding-bottom: 2rem; }`]
})
export class AppComponent {
  constructor() {
    inject(AnalyticsTracker).pageVisit();
  }
}
