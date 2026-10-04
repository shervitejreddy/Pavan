import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleType } from '../../types/commute';
import { calculateFuelSplit, DEFAULT_FUEL_RATES, DEFAULT_MILEAGE, SplitResult } from '../../utils/calculator';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-cost-splitter-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto shadow-sm">
      <div class="border-b border-slate-200 pb-5 mb-6">
        <h2 class="text-xl font-bold tracking-tight text-slate-900">
          Fair Fuel Split & Corporate Green Subsidy Calculator
        </h2>
        <p class="text-sm text-slate-500 mt-1">
          Calculate your non-commercial commute expense, fair cost sharing, and the ₹3 (Bike) / ₹5 (Car) company green incentive.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Controls Column -->
        <div class="lg:col-span-6 space-y-6">
          <!-- Mode Switcher -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-2">
              Select Commute Mode
            </label>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                (click)="handleVehicleChange('bike')"
                [class]="'p-3 rounded-xl border text-left cursor-pointer transition-all ' +
                  (vehicleType === 'bike'
                    ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                    : 'border-slate-200 hover:border-slate-300')"
              >
                <div class="flex items-center gap-1.5 font-bold text-sm text-slate-900 mb-0.5">
                  <app-icon name="bike" className="w-4 h-4 text-emerald-600"></app-icon>
                  <span>Bike Pooling</span>
                </div>
                <div class="text-[11px] text-slate-500">
                  1 Pillion · <strong class="text-emerald-700 font-semibold">₹3/ride company benefit</strong>
                </div>
              </button>

              <button
                type="button"
                (click)="handleVehicleChange('car')"
                [class]="'p-3 rounded-xl border text-left cursor-pointer transition-all ' +
                  (vehicleType === 'car'
                    ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600'
                    : 'border-slate-200 hover:border-slate-300')"
              >
                <div class="flex items-center gap-1.5 font-bold text-sm text-slate-900 mb-0.5">
                  <app-icon name="car" className="w-4 h-4 text-blue-600"></app-icon>
                  <span>Car Pooling</span>
                </div>
                <div class="text-[11px] text-slate-500">
                  Shared seats · <strong class="text-blue-700 font-semibold">₹5/ride company benefit</strong>
                </div>
              </button>
            </div>
          </div>

          <!-- Distance Slider -->
          <div>
            <div class="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
              <span>One-way Commute Distance</span>
              <span class="font-mono tabular-nums font-bold text-slate-900 text-sm">{{ distanceKm }} km</span>
            </div>
            <input
              type="range"
              min="2"
              max="45"
              step="0.5"
              [(ngModel)]="distanceKm"
              class="w-full accent-emerald-600 cursor-pointer"
            />
            <div class="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>2 km (Local)</span>
              <span>14 km (KPHB / Kondapur to Financial Dist)</span>
              <span>45 km (Pocharam SEZ)</span>
            </div>
          </div>

          <!-- Fuel & Efficiency -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">
                Powertrain
              </label>
              <select
                [ngModel]="fuelType"
                (ngModelChange)="handleFuelTypeChange($event)"
                class="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
              >
                <option value="petrol">Petrol (₹{{ defaultFuelRates.petrol }}/L)</option>
                <option value="electric">EV (₹{{ defaultFuelRates.electric }}/kWh)</option>
                <option value="diesel">Diesel (₹{{ defaultFuelRates.diesel }}/L)</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">
                Mileage ({{ fuelType === 'electric' ? 'km/kWh' : 'km/L' }})
              </label>
              <input
                type="number"
                min="5"
                max="80"
                [(ngModel)]="mileage"
                class="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono"
              />
            </div>
          </div>

          <div *ngIf="vehicleType === 'car'">
            <label class="block text-xs font-medium text-slate-700 mb-1">
              Co-riders sharing the car: <strong class="font-mono">{{ riders }}</strong>
            </label>
            <div class="flex gap-2">
              <button
                *ngFor="let n of [1, 2, 3, 4]"
                type="button"
                (click)="riders = n"
                [class]="'flex-1 py-1.5 text-xs font-medium rounded-lg border cursor-pointer transition-colors ' +
                  (riders === n
                    ? 'border-blue-600 bg-blue-50 text-blue-800'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300')"
              >
                {{ n }} Rider{{ n > 1 ? 's' : '' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Results & Benefit Breakdown Column -->
        <div class="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div class="text-xs font-semibold text-slate-700 mb-3 flex items-center justify-between">
              <span>Per-Ride Financial Breakdown</span>
              <span class="text-[11px] text-emerald-700 font-medium">Verified IT Benefit</span>
            </div>

            <!-- Calculations List -->
            <div class="space-y-2.5 text-xs">
              <div class="flex justify-between py-1 border-b border-slate-200">
                <span class="text-slate-600">Total Trip Fuel Cost:</span>
                <span class="font-mono tabular-nums font-semibold text-slate-900">
                  ₹{{ split.totalFuelCost.toFixed(2) }}
                </span>
              </div>

              <div class="flex justify-between py-1 border-b border-slate-200">
                <span class="text-slate-600">
                  Equal Split ({{ split.totalOccupants }} occupants):
                </span>
                <span class="font-mono tabular-nums text-slate-700">
                  ₹{{ split.baseSplitPerPerson.toFixed(2) }} / person
                </span>
              </div>

              <div class="flex justify-between py-1.5 px-2 bg-emerald-100/60 rounded-md border border-emerald-200 text-emerald-950 font-medium">
                <span class="flex items-center gap-1">
                  <app-icon name="leaf" className="w-3.5 h-3.5 text-emerald-700"></app-icon>
                  Company Green Commute Subsidy:
                </span>
                <span class="font-mono tabular-nums font-bold text-emerald-800">
                  -₹{{ split.companySubsidyPerRide.toFixed(2) }} (Paid by Company)
                </span>
              </div>

              <div class="flex justify-between items-baseline pt-2">
                <div>
                  <div class="text-sm font-bold text-slate-900">Net Commuter Cost:</div>
                  <div class="text-[11px] text-slate-500">Per one-way commute</div>
                </div>
                <div class="text-2xl font-extrabold text-emerald-700 font-mono tabular-nums">
                  ₹{{ split.netRiderPayable.toFixed(2) }}
                </div>
              </div>
            </div>

            <!-- Comparison against Cab/Auto -->
            <div class="mt-5 pt-4 border-t border-slate-200 space-y-3">
              <div class="text-xs font-semibold text-slate-700">
                IT Commuter Savings Comparison
              </div>

              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="p-2.5 bg-white rounded-lg border border-slate-200">
                  <div class="text-[10px] text-slate-400">Solo Cab / Bike Taxi</div>
                  <div class="text-sm font-bold text-slate-700 font-mono tabular-nums line-through">
                    ₹{{ split.soloCabCostEstimate }}
                  </div>
                </div>

                <div class="p-2.5 bg-white rounded-lg border border-emerald-200">
                  <div class="text-[10px] text-emerald-700 font-medium">Gopool</div>
                  <div class="text-sm font-bold text-emerald-700 font-mono tabular-nums">
                    ₹{{ split.netRiderPayable.toFixed(1) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Monthly Projection -->
          <div class="mt-5 p-3.5 bg-white border border-emerald-200 rounded-lg space-y-1.5">
            <div class="flex items-center justify-between text-xs">
              <span class="font-medium text-slate-700">Est. Monthly IT Commute Savings:</span>
              <span class="font-mono tabular-nums font-bold text-emerald-700 text-sm">
                ₹{{ monthlySavings.toLocaleString() }} / mo
              </span>
            </div>
            <div class="flex items-center justify-between text-[11px] text-slate-500">
              <span>Company Subsidies Deposited:</span>
              <span class="font-mono tabular-nums text-slate-800 font-medium">
                +₹{{ monthlyCompanySubsidy }} to Green Wallet
              </span>
            </div>
            <div class="flex items-center justify-between text-[11px] text-slate-500">
              <span>CO2 Emissions Prevented:</span>
              <span class="font-mono tabular-nums text-emerald-700 font-medium">
                {{ monthlyCo2SavedKg.toFixed(1) }} kg CO2 / mo
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CostSplitterCalculatorComponent {
  vehicleType: VehicleType = 'bike';
  distanceKm: number = 14.0;
  fuelType: 'petrol' | 'electric' | 'diesel' = 'petrol';
  riders: number = 1;
  mileage: number = 38;
  fuelPrice: number = DEFAULT_FUEL_RATES.petrol;
  defaultFuelRates = DEFAULT_FUEL_RATES;

  handleVehicleChange(type: VehicleType) {
    this.vehicleType = type;
    const newFuel = type === 'bike' ? 'petrol' : 'electric';
    this.fuelType = newFuel;
    this.mileage = DEFAULT_MILEAGE[type][newFuel];
    this.fuelPrice = DEFAULT_FUEL_RATES[newFuel];
    this.riders = type === 'bike' ? 1 : 2;
  }

  handleFuelTypeChange(newFuel: 'petrol' | 'electric' | 'diesel') {
    this.fuelType = newFuel;
    this.mileage = DEFAULT_MILEAGE[this.vehicleType][newFuel];
    this.fuelPrice = DEFAULT_FUEL_RATES[newFuel];
  }

  get split(): SplitResult {
    return calculateFuelSplit({
      distanceKm: this.distanceKm,
      vehicleType: this.vehicleType,
      fuelType: this.fuelType,
      mileageKmPerUnit: this.mileage,
      fuelPricePerUnit: this.fuelPrice,
      riderCount: this.riders,
    });
  }

  get monthlySavings(): number {
    const workingDays = 22 * 2;
    return (this.split.soloCabCostEstimate - this.split.netRiderPayable) * workingDays;
  }

  get monthlyCompanySubsidy(): number {
    return this.split.companySubsidyPerRide * 22 * 2;
  }

  get monthlyCo2SavedKg(): number {
    return this.split.co2SavedKg * 22 * 2;
  }
}
