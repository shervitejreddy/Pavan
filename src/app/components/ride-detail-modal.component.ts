import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ride, Employee } from '../../types/commute';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-ride-detail-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div class="flex items-center gap-2">
            <span class="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <app-icon [name]="isBike ? 'bike' : 'car'" className="w-5 h-5"></app-icon>
            </span>
            <div>
              <h2 class="text-base font-bold text-slate-900">
                {{ isBike ? 'Campus Bike Pool' : 'Campus Car Pool' }}
              </h2>
              <div class="text-xs text-slate-500">
                Ride #{{ ride.id }} · Scheduled for {{ ride.departureDate }} at {{ ride.departureTime }}
              </div>
            </div>
          </div>
          <button
            type="button"
            (click)="close.emit()"
            class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <app-icon name="x" className="w-5 h-5"></app-icon>
          </button>
        </div>

        <div class="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <!-- Route Section -->
          <div class="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div class="text-xs font-semibold text-slate-500 mb-3 tracking-wide">
              Commute Route & Pickup Corridor
            </div>
            <div class="space-y-3">
              <div class="flex items-start gap-3">
                <div class="w-2.5 h-2.5 rounded-full bg-slate-500 mt-1.5 shrink-0"></div>
                <div>
                  <div class="text-xs text-slate-400">Origin / Starting Point</div>
                  <div class="text-sm font-semibold text-slate-900">{{ ride.origin }}</div>
                </div>
              </div>

              <div *ngIf="ride.routeHighlights.length > 0" class="ml-1 pl-4 border-l border-dashed border-slate-300 py-1 space-y-1">
                <div class="text-xs text-slate-500 font-medium">Waypoints / Pickup Stops:</div>
                <div class="flex flex-wrap gap-2 text-xs text-slate-700">
                  <span *ngFor="let hl of ride.routeHighlights" class="bg-white px-2 py-0.5 rounded border border-slate-200">
                    {{ hl }}
                  </span>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></div>
                <div>
                  <div class="text-xs text-emerald-700 font-medium">Destination IT Campus</div>
                  <div class="text-sm font-semibold text-emerald-950">{{ ride.destinationCampus }}</div>
                </div>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <div>
                Distance: <span class="font-mono tabular-nums font-semibold text-slate-900">{{ ride.distanceKm }} km</span>
              </div>
              <div>
                Est. Duration: <span class="font-mono tabular-nums font-semibold text-slate-900">{{ ride.durationMinutes }} mins</span>
              </div>
              <div>
                Departure: <span class="font-semibold text-slate-900">{{ ride.departureTime }}</span>
              </div>
            </div>
          </div>

          <!-- Host & Verification Card -->
          <div class="border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center font-bold text-base">
                {{ ride.host.name.charAt(0) }}
              </div>
              <div>
                <div class="font-semibold text-slate-900 flex items-center gap-1.5">
                  <span>{{ ride.host.name }}</span>
                  <span *ngIf="ride.host.verificationStatus === 'verified'" class="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                    <app-icon name="shield-check" className="w-3.5 h-3.5 text-emerald-600"></app-icon>
                    Verified IT Employee
                  </span>
                </div>
                <div class="text-xs text-slate-600">
                  {{ ride.host.role }} · {{ ride.host.department }}
                </div>
                <div class="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                  <span class="flex items-center gap-1">
                    <app-icon name="building-2" className="w-3 h-3 text-slate-400"></app-icon>
                    {{ ride.host.company }} ({{ ride.host.employeeId }})
                  </span>
                  <span>·</span>
                  <span>★ {{ ride.host.rating }} ({{ ride.host.ridesCompleted }} rides)</span>
                </div>
              </div>
            </div>

            <div class="text-right sm:border-l sm:border-slate-100 sm:pl-4 text-xs text-slate-500">
              <div class="text-slate-400">Vehicle Registered</div>
              <div class="font-medium text-slate-800">{{ ride.vehicle.makeModel }}</div>
              <div class="font-mono text-slate-600 text-[11px]">{{ ride.vehicle.registrationNumber }}</div>
            </div>
          </div>

          <!-- Transparent Fuel Cost Split Breakdown -->
          <div class="border border-slate-200 rounded-xl p-4 bg-white">
            <div class="flex items-center justify-between mb-3">
              <div class="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <app-icon name="fuel" className="w-4 h-4 text-amber-600"></app-icon>
                Transparent Fuel Splitting Breakdown
              </div>
              <div class="text-xs text-slate-500">Non-commercial cost sharing</div>
            </div>

            <div class="space-y-2 text-xs">
              <div class="flex justify-between py-1 border-b border-slate-100">
                <span class="text-slate-600">Total estimated fuel cost for {{ ride.distanceKm }} km trip</span>
                <span class="font-mono tabular-nums font-medium text-slate-900">₹{{ ride.totalTripFuelCost.toFixed(1) }}</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-100">
                <span class="text-slate-600">Occupants split ({{ isBike ? '1 host + 1 pillion' : (ride.totalSeats + 1) + ' people' }})</span>
                <span class="font-mono tabular-nums font-medium text-slate-900">₹{{ ride.standardPerRiderSplit.toFixed(1) }} / person</span>
              </div>
              <div class="flex justify-between py-1.5 border-b border-slate-100 bg-emerald-50/70 px-2 rounded font-medium text-emerald-900">
                <span class="flex items-center gap-1">
                  <app-icon name="leaf" className="w-3.5 h-3.5 text-emerald-600"></app-icon>
                  Company Green Commute Benefit ({{ isBike ? '₹3 for Bike Pool' : '₹5 for Car Pool' }})
                </span>
                <span class="font-mono tabular-nums font-semibold text-emerald-700">
                  -₹{{ ride.companySubsidyPerRide.toFixed(1) }} (Company Pays)
                </span>
              </div>
              <div class="flex justify-between py-2 text-sm font-semibold pt-2">
                <span class="text-slate-900">Net Amount Payable by Commuter:</span>
                <span class="font-mono tabular-nums text-base text-emerald-700">₹{{ ride.riderPayableAmount.toFixed(1) }}</span>
              </div>
            </div>

            <p class="mt-3 text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-2 rounded">
              * Note: Company provides a direct green subsidy of {{ isBike ? '₹3' : '₹5' }} per completed ride under corporate sustainability guidelines to encourage zero single-occupancy travel. Host receives full fuel compensation.
            </p>
          </div>

          <!-- Bike Safety Checklist -->
          <div *ngIf="isBike" class="border border-emerald-100 bg-emerald-50/40 rounded-xl p-4 text-xs space-y-2">
            <div class="font-semibold text-emerald-950 flex items-center gap-1.5">
              <app-icon name="shield-check" className="w-4 h-4 text-emerald-700"></app-icon>
              Campus Two-Wheeler Safety Protocol
            </div>
            <ul class="space-y-1 text-slate-700 list-disc list-inside">
              <li>
                {{ ride.vehicle.helmetProvided
                  ? 'Host provides a sanitized ISI/DOT-certified pillion helmet.'
                  : 'Commuter must bring their own certified helmet.' }}
              </li>
              <li>Both driver and pillion must wear their company RFID badge for campus gate security pass.</li>
              <li>Strict speed adherence (max 40 km/h in campus corridors).</li>
            </ul>
          </div>

          <!-- Booked Passengers / Seat Status -->
          <div>
            <div class="text-xs font-semibold text-slate-700 mb-2 flex items-center justify-between">
              <span>Co-commuters in this pool:</span>
              <span class="font-mono tabular-nums text-slate-500">
                {{ ride.availableSeats }} of {{ ride.totalSeats }} seats open
              </span>
            </div>
            <div *ngIf="ride.passengers.length === 0" class="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-lg text-center">
              No co-riders yet. You will be the first commuter to join this pool!
            </div>
            <div *ngIf="ride.passengers.length > 0" class="space-y-2">
              <div *ngFor="let p of ride.passengers" class="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg text-xs">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[11px]">
                    {{ p.employee.name.charAt(0) }}
                  </div>
                  <div>
                    <div class="font-medium text-slate-900">{{ p.employee.name }}</div>
                    <div class="text-[11px] text-slate-500">{{ p.employee.company }} · Pickup: {{ p.pickupPoint }}</div>
                  </div>
                </div>
                <span class="text-emerald-700 font-medium">Confirmed</span>
              </div>
            </div>
          </div>

          <!-- Booking Interaction for Commuter -->
          <div *ngIf="!isHost && !isPassenger" class="space-y-3 pt-3 border-t border-slate-200">
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">
                Select your preferred pickup point along the route:
              </label>
              <select
                [(ngModel)]="pickupPoint"
                name="pickupPoint"
                class="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
              >
                <option [value]="ride.origin">{{ ride.origin }} (Starting Point)</option>
                <option *ngFor="let hl of ride.routeHighlights" [value]="hl">
                  {{ hl }}
                </option>
              </select>
            </div>

            <label class="flex items-start gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                [(ngModel)]="agreedSafety"
                name="agreedSafety"
                class="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>
                I agree to ride sharing safety standards, prompt arrival at pickup time, and verify that I am an active IT campus employee.
              </span>
            </label>
          </div>
        </div>

        <!-- Modal Footer Controls -->
        <div class="px-6 py-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <button
            type="button"
            (click)="close.emit()"
            class="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Close
          </button>

          <div class="flex items-center gap-2">
            <button
              *ngIf="isHost"
              type="button"
              (click)="onStart()"
              class="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              Start Live Ride (Simulate)
            </button>

            <button
              *ngIf="!isHost && isPassenger"
              type="button"
              (click)="onCancel()"
              class="px-4 py-2 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border border-red-200"
            >
              Cancel My Reservation
            </button>

            <button
              *ngIf="!isHost && !isPassenger"
              type="button"
              (click)="onJoin()"
              [disabled]="isFull || !agreedSafety"
              [class]="'px-5 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ' +
                (isFull || !agreedSafety
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm')"
            >
              {{ isFull ? 'No Seats Available' : 'Confirm & Pay ₹' + ride.riderPayableAmount.toFixed(1) }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RideDetailModalComponent implements OnInit {
  @Input() ride!: Ride;
  @Input() currentUser!: Employee;
  @Output() close = new EventEmitter<void>();
  @Output() joinRide = new EventEmitter<{ ride: Ride; pickupPoint: string }>();
  @Output() cancelBooking = new EventEmitter<string>();
  @Output() startRide = new EventEmitter<Ride>();

  pickupPoint: string = '';
  agreedSafety: boolean = false;

  ngOnInit() {
    this.pickupPoint = this.ride.routeHighlights[0] || this.ride.origin;
  }

  get isHost(): boolean {
    return this.ride.host.id === this.currentUser.id;
  }

  get isPassenger(): boolean {
    return this.ride.passengers.some((p) => p.employee.id === this.currentUser.id);
  }

  get isFull(): boolean {
    return this.ride.availableSeats <= 0;
  }

  get isBike(): boolean {
    return this.ride.poolType === 'bike';
  }

  onStart() {
    this.startRide.emit(this.ride);
    this.close.emit();
  }

  onCancel() {
    this.cancelBooking.emit(this.ride.id);
    this.close.emit();
  }

  onJoin() {
    this.joinRide.emit({ ride: this.ride, pickupPoint: this.pickupPoint });
    this.close.emit();
  }
}
