import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../types/commute';
import { HYDERABAD_AREAS, HYDERABAD_ZONES, HyderabadArea } from '../../data/hyderabadAreas';
import { IconComponent } from './icon.component';

export type FilterMode = 'all' | 'bike' | 'car' | 'my_company';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="space-y-6">
      <!-- Editorial Hero Block -->
      <div class="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 text-white min-h-[220px] sm:min-h-[260px] flex flex-col justify-end p-6 sm:p-8 shadow-sm">
        <!-- Background Image with Measured Scrim -->
        <div class="absolute inset-0 z-0">
          <img
            src="/assets/images/hyderabad_tech_corridor_hero_1790960681822.jpg"
            alt="Hyderabad HITEC City and Financial District Tech Corridor"
            class="w-full h-full object-cover object-center opacity-35"
            (error)="onImageError($event)"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/40"></div>
        </div>

        <!-- Content -->
        <div class="relative z-10 max-w-3xl">
          <div class="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2 tracking-wide uppercase">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Hyderabad IT Tech Corridor Commute Program</span>
          </div>

          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 text-balance">
            Gopool: Hyderabad IT Campus Ride Sharing Benefit
          </h1>

          <p class="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed mb-6">
            Connecting Hyderabad tech commuters across HITEC City, Financial District, Knowledge City, and Gachibowli. Split fuel costs with verified IT colleagues while companies sponsor <strong class="text-emerald-300 font-semibold">₹3 per bike pool</strong> and <strong class="text-emerald-300 font-semibold">₹5 per car pool</strong>.
          </p>

          <!-- Quick proof statistics inline -->
          <div class="flex flex-wrap items-center gap-6 text-xs text-slate-300 pt-3 border-t border-slate-800">
            <div>
              <span class="text-slate-400">Corporate Subsidy: </span>
              <strong class="text-emerald-400 font-mono">₹3 Bike · ₹5 Car</strong>
            </div>
            <div>
              <span class="text-slate-400">Hyderabad Hub: </span>
              <strong class="text-white">Cyberabad & Financial District</strong>
            </div>
            <div>
              <span class="text-slate-400">Open Seats Today: </span>
              <strong class="text-emerald-400 font-mono">{{ totalAvailableSeats }} seats</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Search & Filter Bar -->
      <div class="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <!-- Search Input -->
        <div class="relative flex-1">
          <app-icon name="search" className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"></app-icon>
          <input
            type="text"
            [ngModel]="searchQuery"
            (ngModelChange)="onSearchChange($event)"
            placeholder="Search by Hyderabad pickup (e.g. KPHB, Kondapur, Manikonda, Banjara Hills) or campus..."
            class="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
          />
        </div>

        <!-- Filter Segmented Controls -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            type="button"
            (click)="onFilterChange('all')"
            [class]="'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ' +
              (filterMode === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900')"
          >
            All Pools
          </button>

          <button
            type="button"
            (click)="onFilterChange('bike')"
            [class]="'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ' +
              (filterMode === 'bike' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900')"
          >
            <app-icon name="bike" className="w-3.5 h-3.5"></app-icon>
            <span>Bike Pools (₹3 Benefit)</span>
          </button>

          <button
            type="button"
            (click)="onFilterChange('car')"
            [class]="'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ' +
              (filterMode === 'car' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900')"
          >
            <app-icon name="car" className="w-3.5 h-3.5"></app-icon>
            <span>Car Pools (₹5 Benefit)</span>
          </button>

          <button
            type="button"
            (click)="onFilterChange('my_company')"
            [class]="'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ' +
              (filterMode === 'my_company' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900')"
          >
            {{ currentUser.company.split(' ')[0] }} Only
          </button>

          <button
            type="button"
            (click)="openScheduleModal.emit()"
            class="ml-auto md:ml-2 px-3.5 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 shadow-xs"
          >
            <app-icon name="plus" className="w-3.5 h-3.5"></app-icon>
            <span>Offer Ride</span>
          </button>
        </div>
      </div>

      <!-- Hyderabad Areas Quick Explorer -->
      <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <app-icon name="map-pin" className="w-4 h-4 text-emerald-600"></app-icon>
            <span class="text-xs font-bold text-slate-900">
              Hyderabad Commute Corridors & Pickups ({{ hyderabadAreas.length }} Areas)
            </span>
          </div>
          <div class="text-[11px] text-slate-500">
            Click any area to filter live tech park rides & calculate split
          </div>
        </div>

        <!-- Zone Selector Pills -->
        <div class="flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-thin">
          <button
            *ngFor="let zone of hyderabadZones"
            type="button"
            (click)="selectedZone = zone"
            [class]="'px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ' +
              (selectedZone === zone ? 'bg-emerald-700 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900')"
          >
            {{ zone }}
          </button>
        </div>

        <!-- Area Chips for selected zone -->
        <div class="flex flex-wrap gap-1.5 pt-2">
          <button
            *ngFor="let area of displayedAreas"
            type="button"
            (click)="toggleAreaFilter(area.shortName)"
            [class]="'px-2.5 py-1 text-xs rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ' +
              (isAreaSelected(area.shortName)
                ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold ring-1 ring-emerald-500'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300')"
          >
            <span>{{ area.shortName }}</span>
            <span class="text-[10px] text-slate-400 font-mono">
              {{ area.approxKmToHitec === 0 ? 'Hub' : area.approxKmToHitec + 'km' }}
            </span>
          </button>

          <button
            *ngIf="selectedZone === 'All Zones'"
            type="button"
            (click)="showAllAreas = !showAllAreas"
            class="px-2.5 py-1 text-xs rounded-lg border border-dashed border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-semibold cursor-pointer flex items-center gap-1"
          >
            <span>{{ showAllAreas ? 'Show Less' : '+' + (hyderabadAreas.length - 16) + ' More Areas' }}</span>
            <app-icon [name]="showAllAreas ? 'chevron-up' : 'chevron-down'" className="w-3 h-3"></app-icon>
          </button>
        </div>
      </div>
    </div>
  `
})
export class HeroBannerComponent {
  @Input() currentUser!: Employee;
  @Input() searchQuery: string = '';
  @Input() filterMode: FilterMode = 'all';
  @Input() totalAvailableSeats: number = 0;

  @Output() searchQueryChange = new EventEmitter<string>();
  @Output() filterModeChange = new EventEmitter<FilterMode>();
  @Output() openScheduleModal = new EventEmitter<void>();

  hyderabadAreas = HYDERABAD_AREAS;
  hyderabadZones = HYDERABAD_ZONES;
  selectedZone: string = 'All Zones';
  showAllAreas: boolean = false;

  get displayedAreas(): HyderabadArea[] {
    if (this.selectedZone === 'All Zones') {
      return this.showAllAreas ? this.hyderabadAreas : this.hyderabadAreas.slice(0, 16);
    }
    return this.hyderabadAreas.filter((a) => a.zone === this.selectedZone);
  }

  isAreaSelected(shortName: string): boolean {
    return this.searchQuery.toLowerCase().includes(shortName.toLowerCase());
  }

  toggleAreaFilter(shortName: string) {
    if (this.isAreaSelected(shortName)) {
      this.searchQueryChange.emit('');
    } else {
      this.searchQueryChange.emit(shortName);
    }
  }

  onSearchChange(val: string) {
    this.searchQueryChange.emit(val);
  }

  onFilterChange(mode: FilterMode) {
    this.filterModeChange.emit(mode);
  }

  onImageError(e: Event) {
    (e.target as HTMLElement).style.display = 'none';
  }
}
