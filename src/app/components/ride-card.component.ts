import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ride } from '../../types/commute';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-ride-card',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <article class="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
      <div>
        <!-- Unboxed clean metadata kicker with typographic separators -->
        <div class="flex items-center justify-between text-xs text-slate-500 mb-3">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="font-semibold text-slate-700 flex items-center gap-1">
              <app-icon [name]="isBike ? 'bike' : 'car'" [className]="'w-3.5 h-3.5 ' + (isBike ? 'text-emerald-600' : 'text-blue-600')"></app-icon>
              {{ isBike ? 'Bike Pool' : 'Car Pool' }}
            </span>
            <span aria-hidden="true">·</span>
            <span>{{ ride.departureTime }}</span>
            <span aria-hidden="true">·</span>
            <span class="font-mono tabular-nums">{{ ride.distanceKm }} km</span>
            <span aria-hidden="true">·</span>
            <span>{{ ride.durationMinutes }} min est.</span>
          </div>

          <div class="text-right">
            <span *ngIf="isHost" class="text-slate-600 font-medium">You are host</span>
            <span *ngIf="!isHost && isPassenger" class="text-emerald-700 font-medium flex items-center gap-1">
              <app-icon name="check-circle-2" className="w-3 h-3 text-emerald-600"></app-icon> Booked
            </span>
            <span *ngIf="!isHost && !isPassenger" class="text-slate-600 font-medium">
              <strong class="font-mono tabular-nums text-slate-900">{{ ride.availableSeats }}</strong> {{ isBike ? 'pillion seat' : 'seats left' }}
            </span>
          </div>
        </div>

        <!-- Route Header -->
        <div class="space-y-1 mb-4">
          <div class="flex items-start gap-2">
            <span class="w-2 h-2 rounded-full bg-slate-400 mt-1.5 shrink-0"></span>
            <div class="text-sm font-semibold text-slate-900 leading-snug">
              {{ ride.origin }}
            </div>
          </div>
          <div class="ml-1 pl-2 border-l border-dashed border-slate-200 py-0.5 text-xs text-slate-400">
            via {{ ride.routeHighlights[0] || 'Direct tech corridor' }}
          </div>
          <div class="flex items-start gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
            <div class="text-sm font-semibold text-emerald-900 leading-snug">
              {{ ride.destinationCampus }}
            </div>
          </div>
        </div>

        <!-- Host Verified Credentials -->
        <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs mb-4">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-semibold text-xs border border-slate-200">
              {{ ride.host.name.charAt(0) }}
            </div>
            <div>
              <div class="font-medium text-slate-900 flex items-center gap-1">
                <span>{{ ride.host.name }}</span>
                <span *ngIf="ride.host.verificationStatus === 'verified'" title="Verified IT Employee">
                  <app-icon name="shield-check" className="w-3.5 h-3.5 text-emerald-600"></app-icon>
                </span>
              </div>
              <div class="text-slate-500 text-[11px]">
                {{ ride.host.company }} · {{ ride.host.role.split(' ')[0] }}
              </div>
            </div>
          </div>

          <div class="text-right text-[11px] text-slate-500">
            <div>★ <span class="font-mono tabular-nums text-slate-800 font-medium">{{ ride.host.rating }}</span></div>
            <div>{{ ride.host.ridesCompleted }} rides</div>
          </div>
        </div>

        <!-- Vehicle & Safety Specs -->
        <div class="text-xs text-slate-600 mb-4 bg-slate-50/70 rounded-lg p-2.5 space-y-1">
          <div class="flex justify-between">
            <span class="text-slate-500">Vehicle:</span>
            <span class="font-medium text-slate-800">{{ ride.vehicle.makeModel }}</span>
          </div>
          <div *ngIf="isBike" class="flex justify-between">
            <span class="text-slate-500">Safety Helmet:</span>
            <span [class]="ride.vehicle.helmetProvided ? 'text-emerald-700 font-medium' : 'text-amber-700'">
              {{ ride.vehicle.helmetProvided ? '✓ Sanitized Helmet Provided' : 'Bring your own helmet' }}
            </span>
          </div>
          <div *ngIf="ride.coworkersOnly" class="flex justify-between">
            <span class="text-slate-500">Access:</span>
            <span class="text-blue-700 font-medium">Only {{ ride.host.company }} staff</span>
          </div>
        </div>
      </div>

      <!-- Financial Split & Corporate Green Subsidy Engine -->
      <div class="pt-3 border-t border-slate-200">
        <div class="flex items-end justify-between mb-3">
          <div>
            <div class="text-[11px] text-slate-500">
              Fuel split: <span class="line-through font-mono tabular-nums">₹{{ ride.standardPerRiderSplit.toFixed(1) }}</span>
            </div>
            <div class="text-xs text-emerald-700 font-medium flex items-center gap-1">
              <span>Company benefit:</span>
              <span class="font-mono tabular-nums font-semibold">-₹{{ ride.companySubsidyPerRide.toFixed(0) }}</span>
            </div>
          </div>

          <div class="text-right">
            <div class="text-[11px] text-slate-500">You pay</div>
            <div class="text-lg font-bold text-slate-900 font-mono tabular-nums">
              ₹{{ ride.riderPayableAmount.toFixed(1) }}
            </div>
          </div>
        </div>

        <!-- Primary Action Buttons -->
        <div class="grid grid-cols-2 gap-2">
          <button
            type="button"
            (click)="selectRide.emit(ride)"
            class="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer text-center whitespace-nowrap"
          >
            Cost & Route
          </button>

          <button
            *ngIf="isHost"
            type="button"
            (click)="selectRide.emit(ride)"
            class="px-3 py-2 text-xs font-medium text-slate-900 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors cursor-pointer text-center whitespace-nowrap"
          >
            Manage Ride
          </button>

          <button
            *ngIf="!isHost && isPassenger"
            type="button"
            (click)="selectRide.emit(ride)"
            class="px-3 py-2 text-xs font-medium text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors cursor-pointer text-center whitespace-nowrap"
          >
            View Pass
          </button>

          <button
            *ngIf="!isHost && !isPassenger"
            type="button"
            (click)="joinRide.emit(ride)"
            [disabled]="isFull"
            [class]="'px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer text-center whitespace-nowrap ' +
              (isFull
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm')"
          >
            {{ isFull ? 'Pool Full' : isBike ? 'Reserve Pillion' : 'Join Pool' }}
          </button>
        </div>
      </div>
    </article>
  `
})
export class RideCardComponent {
  @Input() ride!: Ride;
  @Input() currentUserId: string = '';

  @Output() selectRide = new EventEmitter<Ride>();
  @Output() joinRide = new EventEmitter<Ride>();

  get isHost(): boolean {
    return this.ride.host.id === this.currentUserId;
  }

  get isPassenger(): boolean {
    return this.ride.passengers.some((p) => p.employee.id === this.currentUserId);
  }

  get isFull(): boolean {
    return this.ride.availableSeats <= 0;
  }

  get isBike(): boolean {
    return this.ride.poolType === 'bike';
  }
}
