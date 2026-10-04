import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../../types/commute';
import { GopoolBrandComponent } from './green-bike-logo.component';
import { IconComponent } from './icon.component';

export type NavTab = 'rides' | 'map' | 'schedule' | 'calculator' | 'benefit' | 'verification';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, GopoolBrandComponent, IconComponent],
  template: `
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Zone 1: Brand title with small green bike image -->
          <div class="flex items-center gap-3">
            <button
              (click)="onSelectTab('rides')"
              class="text-left group cursor-pointer focus:outline-none"
            >
              <app-gopool-brand size="md"></app-gopool-brand>
            </button>
            <div class="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 border-l border-slate-200 pl-3">
              <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Hyderabad IT Hub · ₹3 Bike / ₹5 Car Green Benefit</span>
            </div>
          </div>

          <!-- Zone 2: 4-6 clean text navigation links -->
          <nav class="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              (click)="onSelectTab('rides')"
              [class]="'hover:text-slate-900 transition-colors cursor-pointer py-1 border-b-2 ' +
                (activeTab === 'rides' ? 'border-emerald-600 text-slate-900 font-semibold' : 'border-transparent')"
            >
              Find Rides
            </button>
            <button
              (click)="onSelectTab('map')"
              [class]="'hover:text-slate-900 transition-colors cursor-pointer py-1 border-b-2 flex items-center gap-1 ' +
                (activeTab === 'map' ? 'border-emerald-600 text-slate-900 font-semibold' : 'border-transparent')"
            >
              <span>Live Corridor Map</span>
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>
            <button
              (click)="onSelectTab('schedule')"
              [class]="'hover:text-slate-900 transition-colors cursor-pointer py-1 border-b-2 ' +
                (activeTab === 'schedule' ? 'border-emerald-600 text-slate-900 font-semibold' : 'border-transparent')"
            >
              Offer a Ride
            </button>
            <button
              (click)="onSelectTab('calculator')"
              [class]="'hover:text-slate-900 transition-colors cursor-pointer py-1 border-b-2 ' +
                (activeTab === 'calculator' ? 'border-emerald-600 text-slate-900 font-semibold' : 'border-transparent')"
            >
              Fuel Splitter
            </button>
            <button
              (click)="onSelectTab('benefit')"
              [class]="'hover:text-slate-900 transition-colors cursor-pointer py-1 border-b-2 ' +
                (activeTab === 'benefit' ? 'border-emerald-600 text-slate-900 font-semibold' : 'border-transparent')"
            >
              Green Wallet & Subsidy
            </button>
            <button
              (click)="onSelectTab('verification')"
              [class]="'hover:text-slate-900 transition-colors cursor-pointer py-1 border-b-2 ' +
                (activeTab === 'verification' ? 'border-emerald-600 text-slate-900 font-semibold' : 'border-transparent')"
            >
              Company Verification
            </button>
          </nav>

          <!-- Zone 3: 1-2 primary actions -->
          <div class="flex items-center gap-3">
            <button
              (click)="openSimulator.emit()"
              [class]="'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ' +
                (hasActiveRide
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200')"
              title="Simulate a live commute from start to finish"
            >
              <app-icon name="play-circle" className="w-3.5 h-3.5"></app-icon>
              <span>{{ hasActiveRide ? 'Ongoing Ride' : 'Ride Simulator' }}</span>
            </button>

            <button
              (click)="openUserModal.emit()"
              class="flex items-center gap-2 p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white transition-colors cursor-pointer text-left"
            >
              <div class="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-semibold">
                {{ currentUser.name.charAt(0) }}
              </div>
              <div class="hidden sm:block text-xs">
                <div class="font-semibold text-slate-900 flex items-center gap-1">
                  <span>{{ currentUser.name.split(' ')[0] }}</span>
                  <app-icon
                    *ngIf="currentUser.verificationStatus === 'verified'"
                    name="shield-check"
                    className="w-3 h-3 text-emerald-600 inline"
                  ></app-icon>
                </div>
                <div class="text-slate-500 truncate max-w-[90px]">{{ currentUser.company.split(' ')[0] }}</div>
              </div>
            </button>
          </div>
        </div>

        <!-- Mobile Navigation bar -->
        <div class="lg:hidden flex items-center justify-between py-2 border-t border-slate-100 overflow-x-auto text-xs font-medium text-slate-600 gap-4">
          <button
            (click)="onSelectTab('rides')"
            [class]="'whitespace-nowrap px-2 py-1 cursor-pointer ' + (activeTab === 'rides' ? 'text-emerald-700 font-semibold' : '')"
          >
            Find Rides
          </button>
          <button
            (click)="onSelectTab('map')"
            [class]="'whitespace-nowrap px-2 py-1 cursor-pointer ' + (activeTab === 'map' ? 'text-emerald-700 font-semibold' : '')"
          >
            Live Map
          </button>
          <button
            (click)="onSelectTab('schedule')"
            [class]="'whitespace-nowrap px-2 py-1 cursor-pointer ' + (activeTab === 'schedule' ? 'text-emerald-700 font-semibold' : '')"
          >
            Offer Ride
          </button>
          <button
            (click)="onSelectTab('calculator')"
            [class]="'whitespace-nowrap px-2 py-1 cursor-pointer ' + (activeTab === 'calculator' ? 'text-emerald-700 font-semibold' : '')"
          >
            Fuel Splitter
          </button>
          <button
            (click)="onSelectTab('benefit')"
            [class]="'whitespace-nowrap px-2 py-1 cursor-pointer ' + (activeTab === 'benefit' ? 'text-emerald-700 font-semibold' : '')"
          >
            Green Wallet
          </button>
          <button
            (click)="onSelectTab('verification')"
            [class]="'whitespace-nowrap px-2 py-1 cursor-pointer ' + (activeTab === 'verification' ? 'text-emerald-700 font-semibold' : '')"
          >
            Verification
          </button>
        </div>
      </div>
    </header>
  `
})
export class NavbarComponent {
  @Input() activeTab: NavTab = 'rides';
  @Input() currentUser!: Employee;
  @Input() hasActiveRide: boolean = false;

  @Output() tabChange = new EventEmitter<NavTab>();
  @Output() openUserModal = new EventEmitter<void>();
  @Output() openSimulator = new EventEmitter<void>();

  onSelectTab(tab: NavTab) {
    this.tabChange.emit(tab);
  }
}
