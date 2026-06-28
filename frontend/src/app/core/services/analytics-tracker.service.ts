import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AnalyticsTracker {
  constructor(private api: ApiService) {}

  track(eventType: string, productId?: string, orderId?: string) {
    this.api.post('/analytics/track', { eventType, productId, orderId, sessionId: localStorage.getItem('raas_session') }).subscribe();
  }

  pageVisit() {
    this.track('PageVisit');
  }
}
