import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-green-bike-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      [class]="className"
      role="img"
      aria-label="Green Bike Logo"
    >
      <!-- Rear Wheel -->
      <circle cx="12" cy="34" r="8" stroke="#059669" stroke-width="3" fill="#ECFDF5" />
      <circle cx="12" cy="34" r="2.5" fill="#10B981" />
      <path d="M12 26V42M4 34H20" stroke="#A7F3D0" stroke-width="1.5" stroke-linecap="round" />

      <!-- Front Wheel -->
      <circle cx="36" cy="34" r="8" stroke="#059669" stroke-width="3" fill="#ECFDF5" />
      <circle cx="36" cy="34" r="2.5" fill="#10B981" />
      <path d="M36 26V42M28 34H44" stroke="#A7F3D0" stroke-width="1.5" stroke-linecap="round" />

      <!-- Frame Geometry in Emerald Green -->
      <path
        d="M12 34L22 19H28L36 34"
        stroke="#059669"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M22 19L16 34"
        stroke="#10B981"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M16 34H36"
        stroke="#047857"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M22 34L28 19"
        stroke="#10B981"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- Handlebar -->
      <path
        d="M34 13H29L32 23"
        stroke="#047857"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- Saddle -->
      <path
        d="M18 16H25"
        stroke="#065F46"
        stroke-width="3.5"
        stroke-linecap="round"
      />
      <!-- Pedal Crank Accent -->
      <circle cx="24" cy="34" r="3.5" stroke="#10B981" stroke-width="2" fill="#ECFDF5" />
    </svg>
  `
})
export class GreenBikeIconComponent {
  @Input() className: string = 'w-6 h-6';
}

@Component({
  selector: 'app-gopool-brand',
  standalone: true,
  imports: [CommonModule, GreenBikeIconComponent],
  template: `
    <div [class]="'inline-flex items-center gap-2 ' + className">
      <div class="shrink-0 p-1 rounded-lg bg-emerald-50 border border-emerald-200/80 shadow-xs flex items-center justify-center">
        <app-green-bike-icon [className]="iconSizeClass"></app-green-bike-icon>
      </div>
      <span *ngIf="showText" [class]="textSizeClass + ' font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors'">
        Gopool
      </span>
    </div>
  `
})
export class GopoolBrandComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showText: boolean = true;
  @Input() className: string = '';

  get iconSizeClass(): string {
    return this.size === 'sm' ? 'w-5 h-5' : this.size === 'lg' ? 'w-8 h-8' : 'w-6 h-6';
  }

  get textSizeClass(): string {
    return this.size === 'sm' ? 'text-lg' : this.size === 'lg' ? 'text-2xl' : 'text-xl';
  }
}
