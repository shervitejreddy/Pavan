import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee, Ride, VehicleType } from '../../types/commute';
import { POPULAR_TECH_PARKS } from '../../data/mockData';
import { HYDERABAD_AREAS, HYDERABAD_ZONES } from '../../data/hyderabadAreas';
import { calculateFuelSplit, SplitResult } from '../../utils/calculator';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-schedule-ride-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 class="text-base font-bold text-slate-900">
              Offer a Commute Pool
            </h2>
            <div class="text-xs text-slate-500">
              Schedule your ride, split fuel costs fairly, and earn company green subsidies (₹3 bike / ₹5 car)
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

        <form (ngSubmit)="handleSubmit()" class="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          <!-- Mode Switcher: Bike vs Car -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-2">
              Select Commute Mode
            </label>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                (click)="handlePoolTypeChange('bike')"
                [class]="'p-3.5 rounded-xl border text-left transition-all cursor-pointer ' +
                  (poolType === 'bike'
                    ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                    : 'border-slate-200 hover:border-slate-300 bg-white')"
              >
                <div class="flex items-center gap-2 mb-1">
                  <app-icon name="bike" [className]="'w-5 h-5 ' + (poolType === 'bike' ? 'text-emerald-700' : 'text-slate-500')"></app-icon>
                  <span class="font-bold text-sm text-slate-900">Bike Pooling</span>
                </div>
                <div class="text-xs text-slate-500">
                  1 Pillion Rider · <strong class="text-emerald-700 font-semibold">₹3 Company Benefit</strong> / ride
                </div>
              </button>

              <button
                type="button"
                (click)="handlePoolTypeChange('car')"
                [class]="'p-3.5 rounded-xl border text-left transition-all cursor-pointer ' +
                  (poolType === 'car'
                    ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600'
                    : 'border-slate-200 hover:border-slate-300 bg-white')"
              >
                <div class="flex items-center gap-2 mb-1">
                  <app-icon name="car" [className]="'w-5 h-5 ' + (poolType === 'car' ? 'text-blue-700' : 'text-slate-500')"></app-icon>
                  <span class="font-bold text-sm text-slate-900">Car Pooling</span>
                </div>
                <div class="text-xs text-slate-500">
                  2–4 Seats · <strong class="text-blue-700 font-semibold">₹5 Company Benefit</strong> / ride
                </div>
              </button>
            </div>
          </div>

          <!-- Route Details -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">
                Departure Location (Origin)
              </label>
              <select
                [(ngModel)]="origin"
                (ngModelChange)="handleOriginChange($event)"
                name="origin"
                class="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
              >
                <optgroup *ngFor="let zone of nonAllZones" [label]="'— ' + zone + ' —'">
                  <option *ngFor="let area of getAreasByZone(zone)" [value]="area.name">
                    {{ area.name }} ({{ area.approxKmToHitec === 0 ? 'Hub' : '~' + area.approxKmToHitec + 'km to Tech Hub' }})
                  </option>
                </optgroup>
              </select>
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">
                Destination IT Tech Campus
              </label>
              <select
                [(ngModel)]="destinationCampus"
                name="destinationCampus"
                class="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
              >
                <option *ngFor="let park of popularTechParks" [value]="park">{{ park }}</option>
              </select>
            </div>
          </div>

          <!-- Timing & Distance -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">
                Departure Date
              </label>
              <select
                [(ngModel)]="departureDate"
                name="departureDate"
                class="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
              >
                <option value="Today">Today</option>
                <option value="Tomorrow">Tomorrow</option>
                <option value="Mon-Fri Daily">Mon-Fri Recurring Commute</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">
                Departure Time
              </label>
              <input
                type="text"
                [(ngModel)]="departureTime"
                name="departureTime"
                placeholder="e.g. 08:30 AM"
                class="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">
                Distance: <span class="font-mono tabular-nums font-semibold">{{ distanceKm }} km</span>
              </label>
              <input
                type="range"
                min="2"
                max="40"
                step="0.5"
                [ngModel]="distanceKm"
                (ngModelChange)="onDistanceChange($event)"
                name="distanceKm"
                class="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>

          <!-- Vehicle Specs -->
          <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
            <div class="text-xs font-semibold text-slate-700">
              Vehicle & Fuel Profile
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="block text-[11px] text-slate-500 mb-1">Vehicle Model</label>
                <input
                  type="text"
                  [(ngModel)]="vehicleModel"
                  name="vehicleModel"
                  class="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label class="block text-[11px] text-slate-500 mb-1">Registration Plate</label>
                <input
                  type="text"
                  [(ngModel)]="registrationNumber"
                  name="registrationNumber"
                  class="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-mono uppercase"
                  required
                />
              </div>

              <div>
                <label class="block text-[11px] text-slate-500 mb-1">Fuel Type</label>
                <select
                  [(ngModel)]="fuelType"
                  name="fuelType"
                  class="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                >
                  <option value="petrol">Petrol (₹107.41/L)</option>
                  <option value="electric">Electric (₹8.80/kWh)</option>
                  <option value="diesel">Diesel (₹95.65/L)</option>
                </select>
              </div>
            </div>

            <label *ngIf="poolType === 'bike'" class="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-1">
              <input
                type="checkbox"
                [(ngModel)]="helmetProvided"
                name="helmetProvided"
                class="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span class="font-medium text-emerald-900">
                I will provide a clean, sanitized helmet for my pillion co-commuter (Recommended)
              </span>
            </label>

            <div *ngIf="poolType === 'car'">
              <label class="block text-[11px] text-slate-500 mb-1">Available Passenger Seats</label>
              <select
                [(ngModel)]="totalSeats"
                name="totalSeats"
                class="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
              >
                <option [ngValue]="1">1 Seat</option>
                <option [ngValue]="2">2 Seats</option>
                <option [ngValue]="3">3 Seats</option>
                <option [ngValue]="4">4 Seats</option>
              </select>
            </div>
          </div>

          <!-- Route Highlights / Stops -->
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">
              Add Pickup Waypoints along corridor
            </label>
            <div class="flex gap-2 mb-2">
              <input
                type="text"
                [(ngModel)]="newWaypoint"
                name="newWaypoint"
                placeholder="e.g. Bio-Diversity Junction, Wipro Circle"
                class="flex-1 text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
              />
              <button
                type="button"
                (click)="addWaypoint()"
                class="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                Add Stop
              </button>
            </div>
            <div class="flex flex-wrap gap-1.5">
              <span
                *ngFor="let wp of waypoints; let i = index"
                class="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
              >
                {{ wp }}
                <button
                  type="button"
                  (click)="removeWaypoint(i)"
                  class="text-slate-400 hover:text-slate-700 cursor-pointer ml-1"
                >
                  ×
                </button>
              </span>
            </div>
          </div>

          <!-- Live Fuel Split & Company Benefit Preview Box -->
          <div class="border border-emerald-200 bg-emerald-50/50 rounded-xl p-4 space-y-3">
            <div class="flex items-center justify-between">
              <div class="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <app-icon name="leaf" className="w-4 h-4 text-emerald-700"></app-icon>
                Live Fuel Split & Company Benefit Calculation
              </div>
              <span class="text-[11px] text-emerald-700 font-medium">
                {{ poolType === 'bike' ? '₹3 Company Benefit Active' : '₹5 Company Benefit Active' }}
              </span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div class="bg-white p-2.5 rounded-lg border border-emerald-100">
                <div class="text-[10px] text-slate-500">Trip Fuel Cost</div>
                <div class="text-sm font-bold font-mono tabular-nums text-slate-900">
                  ₹{{ splitData.totalFuelCost.toFixed(1) }}
                </div>
              </div>

              <div class="bg-white p-2.5 rounded-lg border border-emerald-100">
                <div class="text-[10px] text-slate-500">Per Person Split</div>
                <div class="text-sm font-bold font-mono tabular-nums text-slate-700">
                  ₹{{ splitData.baseSplitPerPerson.toFixed(1) }}
                </div>
              </div>

              <div class="bg-white p-2.5 rounded-lg border border-emerald-100">
                <div class="text-[10px] text-emerald-700 font-semibold">Company Pays</div>
                <div class="text-sm font-bold font-mono tabular-nums text-emerald-700">
                  -₹{{ splitData.companySubsidyPerRide.toFixed(0) }} / ride
                </div>
              </div>

              <div class="bg-white p-2.5 rounded-lg border border-emerald-100">
                <div class="text-[10px] text-slate-500">Rider Pays You</div>
                <div class="text-sm font-bold font-mono tabular-nums text-emerald-800">
                  ₹{{ splitData.netRiderPayable.toFixed(1) }}
                </div>
              </div>
            </div>

            <div class="text-[11px] text-emerald-800">
              ✓ <strong>Host Earnings:</strong> You recover full fuel cost: <span class="font-mono tabular-nums font-semibold">₹{{ splitData.hostNetPayout.toFixed(1) }}</span> (Rider fare + Company direct subsidy credit).
            </div>
          </div>

          <!-- Access policy -->
          <label class="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              [(ngModel)]="coworkersOnly"
              name="coworkersOnly"
              class="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span>Restrict ride strictly to employees of {{ currentUser.company }}</span>
          </label>
        </form>

        <!-- Modal Footer -->
        <div class="px-6 py-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <button
            type="button"
            (click)="close.emit()"
            class="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            (click)="handleSubmit()"
            class="px-5 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            <app-icon name="plus" className="w-3.5 h-3.5"></app-icon>
            <span>Publish Pool ({{ poolType === 'bike' ? 'Bike' : 'Car' }})</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class ScheduleRideModalComponent implements OnInit {
  @Input() currentUser!: Employee;
  @Output() close = new EventEmitter<void>();
  @Output() publishRide = new EventEmitter<Partial<Ride>>();

  popularTechParks = POPULAR_TECH_PARKS;
  hyderabadAreas = HYDERABAD_AREAS;
  hyderabadZones = HYDERABAD_ZONES;

  poolType: VehicleType = 'bike';
  origin: string = HYDERABAD_AREAS[0].name;
  destinationCampus: string = '';
  departureDate: string = 'Today';
  departureTime: string = '08:30 AM';
  distanceKm: number = 14.0;
  durationMinutes: number = 32;
  fuelType: 'petrol' | 'electric' | 'diesel' = 'petrol';

  vehicleModel: string = 'Royal Enfield Hunter 350';
  registrationNumber: string = 'TS 09 FL 4821';
  totalSeats: number = 1;
  helmetProvided: boolean = true;
  newWaypoint: string = '';
  waypoints: string[] = ['Cyber Towers Junction', 'Bio-Diversity Flyover', 'Wipro Circle'];
  coworkersOnly: boolean = false;
  notes: string = 'Clean sanitized spare helmet provided. Pillion backrest equipped.';

  ngOnInit() {
    this.destinationCampus = this.currentUser?.campusOffice || POPULAR_TECH_PARKS[0];
  }

  get nonAllZones() {
    return this.hyderabadZones.filter((z) => z !== 'All Zones');
  }

  getAreasByZone(zone: string) {
    return this.hyderabadAreas.filter((a) => a.zone === zone);
  }

  handlePoolTypeChange(type: VehicleType) {
    this.poolType = type;
    if (type === 'bike') {
      this.vehicleModel = 'Royal Enfield Hunter 350';
      this.totalSeats = 1;
      this.fuelType = 'petrol';
      this.notes = 'Clean sanitized spare helmet provided. Pillion backrest equipped.';
    } else {
      this.vehicleModel = 'Tata Nexon EV';
      this.totalSeats = 3;
      this.fuelType = 'electric';
      this.notes = 'AC on 23C. Punctual departure from pickup point.';
    }
  }

  handleOriginChange(newOrigin: string) {
    this.origin = newOrigin;
    const matchedArea = this.hyderabadAreas.find((a) => a.name === newOrigin);
    if (matchedArea) {
      const dist = Math.max(3.5, matchedArea.approxKmToHitec + 2.0);
      this.distanceKm = dist;
      this.durationMinutes = Math.round(Math.max(15, dist * 2.1));
    }
  }

  onDistanceChange(val: number) {
    this.distanceKm = val;
    this.durationMinutes = Math.round(val * 2.2);
  }

  addWaypoint() {
    if (this.newWaypoint.trim() && !this.waypoints.includes(this.newWaypoint.trim())) {
      this.waypoints.push(this.newWaypoint.trim());
      this.newWaypoint = '';
    }
  }

  removeWaypoint(index: number) {
    this.waypoints.splice(index, 1);
  }

  get splitData(): SplitResult {
    return calculateFuelSplit({
      distanceKm: this.distanceKm,
      vehicleType: this.poolType,
      fuelType: this.fuelType,
      riderCount: this.totalSeats,
    });
  }

  handleSubmit() {
    const originArea = this.hyderabadAreas.find((a) => a.name === this.origin);
    const originCoords = originArea?.coords || { lat: 17.4938, lng: 78.3914 };
    const destinationCoords = { lat: 17.4156, lng: 78.3427 };

    const newRideData: Partial<Ride> = {
      id: `ride-${Date.now()}`,
      host: this.currentUser,
      poolType: this.poolType,
      vehicle: {
        type: this.poolType,
        makeModel: this.vehicleModel,
        registrationNumber: this.registrationNumber.toUpperCase(),
        fuelType: this.fuelType,
        mileageKmPerUnit: this.poolType === 'bike' ? 38 : 14,
        totalSeats: this.totalSeats,
        helmetProvided: this.poolType === 'bike' ? this.helmetProvided : false,
      },
      origin: this.origin,
      originCoords,
      destinationCampus: this.destinationCampus,
      destinationCoords,
      pathCoordinates: [
        originCoords,
        {
          lat: (originCoords.lat + destinationCoords.lat) / 2 + 0.005,
          lng: (originCoords.lng + destinationCoords.lng) / 2,
        },
        destinationCoords,
      ],
      departureTime: this.departureTime,
      departureDate: this.departureDate,
      distanceKm: this.distanceKm,
      durationMinutes: this.durationMinutes,
      totalSeats: this.totalSeats,
      availableSeats: this.totalSeats,
      passengers: [],
      fuelRatePerUnit: this.fuelType === 'petrol' ? 107.41 : this.fuelType === 'diesel' ? 95.65 : 8.8,
      totalTripFuelCost: this.splitData.totalFuelCost,
      standardPerRiderSplit: this.splitData.baseSplitPerPerson,
      companySubsidyPerRide: this.splitData.companySubsidyPerRide,
      riderPayableAmount: this.splitData.netRiderPayable,
      hostNetEarnings: this.splitData.hostNetPayout,
      status: 'scheduled',
      routeHighlights: [...this.waypoints],
      notes: this.notes,
      coworkersOnly: this.coworkersOnly,
    };

    this.publishRide.emit(newRideData);
    this.close.emit();
  }
}
