import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AnalyticsTracker } from './core/services/analytics-tracker.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <main class="main-content mandala-bg">
      <router-outlet />
    </main>
  `,
  styles: [`.main-content { min-height: calc(100vh - 140px); padding-bottom: 2rem; }`]
})
export class AppComponent {
  constructor() {
    inject(AnalyticsTracker).pageVisit();
  }
}
