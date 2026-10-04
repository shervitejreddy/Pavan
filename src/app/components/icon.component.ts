import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      [class]="className || 'w-4 h-4 inline-block'"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      [ngSwitch]="name"
    >
      <!-- Bike -->
      <ng-container *ngSwitchCase="'bike'">
        <circle cx="18.5" cy="17.5" r="3.5"/>
        <circle cx="5.5" cy="17.5" r="3.5"/>
        <circle cx="15" cy="5" r="1"/>
        <path d="M12 17.5V14l-3-3 4-3 2 3h2"/>
      </ng-container>

      <!-- Car -->
      <ng-container *ngSwitchCase="'car'">
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.2 1 12 1 13v3c0 .6.4 1 1 1h2"/>
        <circle cx="7" cy="17" r="2"/>
        <path d="M9 17h6"/>
        <circle cx="17" cy="17" r="2"/>
      </ng-container>

      <!-- Shield Check -->
      <ng-container *ngSwitchCase="'shield-check'">
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
        <path d="m9 12 2 2 4-4"/>
      </ng-container>

      <!-- Map Pin -->
      <ng-container *ngSwitchCase="'map-pin'">
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
        <circle cx="12" cy="10" r="3"/>
      </ng-container>

      <!-- Fuel -->
      <ng-container *ngSwitchCase="'fuel'">
        <line x1="3" x2="15" y1="22" y2="22"/>
        <line x1="4" x2="14" y1="9" y2="9"/>
        <path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/>
        <path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/>
      </ng-container>

      <!-- Leaf -->
      <ng-container *ngSwitchCase="'leaf'">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
      </ng-container>

      <!-- Plus -->
      <ng-container *ngSwitchCase="'plus'">
        <path d="M5 12h14"/>
        <path d="M12 5v14"/>
      </ng-container>

      <!-- Sparkles -->
      <ng-container *ngSwitchCase="'sparkles'">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
        <path d="M5 3v4"/>
        <path d="M19 17v4"/>
        <path d="M3 5h4"/>
        <path d="M17 19h4"/>
      </ng-container>

      <!-- Building 2 -->
      <ng-container *ngSwitchCase="'building-2'">
        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
        <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
        <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
        <path d="M10 6h4"/>
        <path d="M10 10h4"/>
        <path d="M10 14h4"/>
        <path d="M10 18h4"/>
      </ng-container>

      <!-- Check Circle 2 -->
      <ng-container *ngSwitchCase="'check-circle-2'">
        <circle cx="12" cy="12" r="10"/>
        <path d="m9 12 2 2 4-4"/>
      </ng-container>

      <!-- Alert Circle -->
      <ng-container *ngSwitchCase="'alert-circle'">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" x2="12" y1="8" y2="12"/>
        <line x1="12" x2="12.01" y1="16" y2="16"/>
      </ng-container>

      <!-- Arrow Right -->
      <ng-container *ngSwitchCase="'arrow-right'">
        <path d="M5 12h14"/>
        <path d="m12 5 7 7-7 7"/>
      </ng-container>

      <!-- Play -->
      <ng-container *ngSwitchCase="'play'">
        <polygon points="6 3 20 12 6 21 6 3" fill="currentColor"/>
      </ng-container>

      <!-- Play Circle -->
      <ng-container *ngSwitchCase="'play-circle'">
        <circle cx="12" cy="12" r="10"/>
        <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"/>
      </ng-container>

      <!-- X -->
      <ng-container *ngSwitchCase="'x'">
        <path d="M18 6 6 18"/>
        <path d="m6 6 12 12"/>
      </ng-container>

      <!-- Search -->
      <ng-container *ngSwitchCase="'search'">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.3-4.3"/>
      </ng-container>

      <!-- Filter -->
      <ng-container *ngSwitchCase="'filter'">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
      </ng-container>

      <!-- Wallet -->
      <ng-container *ngSwitchCase="'wallet'">
        <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/>
        <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>
      </ng-container>

      <!-- Gift -->
      <ng-container *ngSwitchCase="'gift'">
        <rect x="3" y="8" width="18" height="4" rx="1"/>
        <path d="M12 8v13"/>
        <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/>
        <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>
      </ng-container>

      <!-- Clock -->
      <ng-container *ngSwitchCase="'clock'">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </ng-container>

      <!-- Navigation -->
      <ng-container *ngSwitchCase="'navigation'">
        <polygon points="3 11 22 2 13 21 11 13 3 11"/>
      </ng-container>

      <!-- Eye -->
      <ng-container *ngSwitchCase="'eye'">
        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
        <circle cx="12" cy="12" r="3"/>
      </ng-container>

      <!-- Eye Off -->
      <ng-container *ngSwitchCase="'eye-off'">
        <path d="m2 2 20 20"/>
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
      </ng-container>

      <!-- Chevron Down -->
      <ng-container *ngSwitchCase="'chevron-down'">
        <path d="m6 9 6 6 6-6"/>
      </ng-container>

      <!-- Chevron Up -->
      <ng-container *ngSwitchCase="'chevron-up'">
        <path d="m18 15-6-6-6 6"/>
      </ng-container>

      <!-- Check -->
      <ng-container *ngSwitchCase="'check'">
        <path d="M20 6 9 17l-5-5"/>
      </ng-container>

      <!-- Upload Cloud -->
      <ng-container *ngSwitchCase="'upload-cloud'">
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
        <path d="M12 12v9"/>
        <path d="m16 16-4-4-4 4"/>
      </ng-container>

      <!-- Lock -->
      <ng-container *ngSwitchCase="'lock'">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </ng-container>

      <!-- User -->
      <ng-container *ngSwitchCase="'user'">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </ng-container>

      <!-- Trending Up -->
      <ng-container *ngSwitchCase="'trending-up'">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
        <polyline points="16 7 22 7 22 13"/>
      </ng-container>
    </svg>
  `
})
export class IconComponent {
  @Input() name: string = '';
  @Input() className: string = 'w-4 h-4 inline-block';
}
