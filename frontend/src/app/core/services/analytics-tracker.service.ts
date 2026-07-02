import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AnalyticsTracker {
  private api = inject(ApiService);
  private router = inject(Router);

  constructor() {
    // Track page visits on route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.pageVisit();
      });
  }

  pageVisit(path?: string) {
    const currentPath = path || this.router.url;
    this.api.post('/analytics/track', {
      eventType: 'page_visit',
      path: currentPath,
      timestamp: new Date().toISOString()
    }).subscribe({
      error: () => {} // Silently fail - don't break user experience
    });
  }

  trackEvent(eventName: string, metadata?: Record<string, any>) {
    this.api.post('/analytics/track', {
      eventType: eventName,
      metadata,
      timestamp: new Date().toISOString()
    }).subscribe({
      error: () => {}
    });
  }

  track(eventName: string, itemId?: string | number) {
    const metadata = itemId !== undefined ? { itemId } : undefined;
    this.trackEvent(eventName, metadata);
  }
}
