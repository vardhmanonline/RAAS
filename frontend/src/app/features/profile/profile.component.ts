import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { UserProfile } from '../../core/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="container page">
      <h1 class="section-title">My Profile</h1>
      @if (profile) {
        <div class="profile-grid">
          <div class="card profile-card">
            <div class="avatar">{{ profile.fullName.charAt(0) }}</div>
            <h2>{{ profile.fullName }}</h2>
            <p>{{ profile.email }}</p>
            @if (profile.phone) { <p>{{ profile.phone }}</p> }
            <div class="loyalty">
              <span class="loyalty-points">{{ profile.loyaltyPoints }}</span>
              <span>Loyalty Points</span>
            </div>
            <a routerLink="/referrals" class="btn btn-saffron full">Refer & Earn ₹50</a>
            <button class="btn btn-secondary full" (click)="auth.logout()">Logout</button>
          </div>
          <div class="card addresses-card">
            <h3>Saved Addresses</h3>
            @for (addr of profile.addresses; track addr.id) {
              <div class="address-item">
                <strong>{{ addr.label }}</strong>
                <p>{{ addr.line1 }}, {{ addr.city }}, {{ addr.state }} — {{ addr.pincode }}</p>
              </div>
            }
            <h4>Add New Address</h4>
            <div class="address-form">
              <input class="input" [(ngModel)]="newAddr.label" placeholder="Label (Home/Office)" />
              <input class="input" [(ngModel)]="newAddr.line1" placeholder="Address Line 1" />
              <input class="input" [(ngModel)]="newAddr.city" placeholder="City" />
              <input class="input" [(ngModel)]="newAddr.state" placeholder="State" />
              <input class="input" [(ngModel)]="newAddr.pincode" placeholder="Pincode" />
              <button class="btn btn-primary" (click)="addAddress()">Save Address</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page { padding: 2rem 0; }
    .profile-grid { display: grid; grid-template-columns: 320px 1fr; gap: 1.5rem; }
    .profile-card { padding: 2rem; text-align: center; }
    .avatar { width: 80px; height: 80px; border-radius: 50%; background: var(--maroon); color: white; font-size: 2rem; font-weight: 700; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; }
    .profile-card h2 { color: var(--maroon); margin-bottom: 0.5rem; }
    .profile-card p { color: var(--text-muted); font-size: 0.9rem; }
    .loyalty { margin: 1.5rem 0; padding: 1rem; background: var(--cream); border-radius: var(--radius-sm); }
    .loyalty-points { display: block; font-size: 2rem; font-weight: 700; color: var(--gold); }
    .full { width: 100%; margin-top: 0.75rem; }
    .addresses-card { padding: 1.5rem; }
    .addresses-card h3 { color: var(--maroon); margin-bottom: 1rem; }
    .address-item { padding: 0.75rem; background: var(--cream); border-radius: var(--radius-sm); margin-bottom: 0.75rem; }
    .address-item p { font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem; }
    h4 { margin: 1.5rem 0 1rem; }
    .address-form { display: grid; gap: 0.75rem; }
    @media (max-width: 768px) { .profile-grid { grid-template-columns: 1fr; } }
  `]
})
export class ProfileComponent implements OnInit {
  auth = inject(AuthService);
  private api = inject(ApiService);
  profile: UserProfile | null = null;
  newAddr = { label: 'Home', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false };

  ngOnInit() {
    this.api.get<UserProfile>('/users/profile').subscribe(p => this.profile = p);
  }

  addAddress() {
    this.api.post('/users/addresses', this.newAddr).subscribe(() => {
      this.ngOnInit();
      this.newAddr = { label: 'Home', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false };
    });
  }
}
