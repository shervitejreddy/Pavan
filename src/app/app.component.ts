import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee, Ride, VerificationRequest, GreenTransaction, VehicleType } from '../types/commute';
import { MOCK_CURRENT_USER, INITIAL_RIDES, INITIAL_VERIFICATION_REQUESTS, INITIAL_TRANSACTIONS } from '../data/mockData';
import { NavbarComponent, NavTab } from './components/navbar.component';
import { HeroBannerComponent, FilterMode } from './components/hero-banner.component';
import { RideCardComponent } from './components/ride-card.component';
import { RideDetailModalComponent } from './components/ride-detail-modal.component';
import { ScheduleRideModalComponent } from './components/schedule-ride-modal.component';
import { CostSplitterCalculatorComponent } from './components/cost-splitter-calculator.component';
import { GreenBenefitDashboardComponent } from './components/green-benefit-dashboard.component';
import { CompanyVerificationPortalComponent } from './components/company-verification-portal.component';
import { ActiveRideSimulatorComponent } from './components/active-ride-simulator.component';
import { UserProfileModalComponent } from './components/user-profile-modal.component';
import { RealTimeCorridorMapComponent } from './components/real-time-corridor-map.component';
import { IconComponent } from './components/icon.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroBannerComponent,
    RideCardComponent,
    RideDetailModalComponent,
    ScheduleRideModalComponent,
    CostSplitterCalculatorComponent,
    GreenBenefitDashboardComponent,
    CompanyVerificationPortalComponent,
    ActiveRideSimulatorComponent,
    UserProfileModalComponent,
    RealTimeCorridorMapComponent,
    IconComponent,
  ],
  template: `
    <div class="min-h-screen bg-slate-50 flex flex-col font-sans">
      <!-- Navbar -->
      <app-navbar
        [activeTab]="activeTab"
        [currentUser]="currentUser"
        [hasActiveRide]="activeSimulatorRide !== null"
        (tabChange)="onTabChange($event)"
        (openUserModal)="isUserModalOpen = true"
        (openSimulator)="openSimulatorDirectly()"
      ></app-navbar>

      <!-- Main Body Container -->
      <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <!-- Tab 1: Find Rides / Main Feed -->
        <div *ngIf="activeTab === 'rides'" class="space-y-8 animate-in fade-in duration-200">
          <!-- Hero Banner with Filter & Areas Explorer -->
          <app-hero-banner
            [currentUser]="currentUser"
            [searchQuery]="searchQuery"
            (searchQueryChange)="searchQuery = $event"
            [filterMode]="filterMode"
            (filterModeChange)="filterMode = $event"
            [totalAvailableSeats]="totalAvailableSeats"
            (openScheduleModal)="isScheduleModalOpen = true"
          ></app-hero-banner>

          <!-- Interactive Live Map Preview Bar -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <div>
                <h2 class="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>Cyberabad Tech Corridor Live Map</span>
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </h2>
                <p class="text-xs text-slate-500">
                  Real-time GPS routing across HITEC City, Financial District, and Knowledge City
                </p>
              </div>
              <button
                type="button"
                (click)="showLiveMapInFeed = !showLiveMapInFeed"
                class="text-xs text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer underline flex items-center gap-1"
              >
                <span>{{ showLiveMapInFeed ? 'Collapse Map' : 'Expand Interactive Radar' }}</span>
              </button>
            </div>

            <div *ngIf="showLiveMapInFeed">
              <app-real-time-corridor-map
                [rides]="rides"
                [selectedRide]="selectedRide"
                (selectRide)="selectedRide = $event"
                (selectAreaFilter)="onAreaFilterSelected($event)"
              ></app-real-time-corridor-map>
            </div>
          </div>

          <!-- Rides Listing Grid -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <div>
                <h2 class="text-lg font-bold text-slate-900 tracking-tight">
                  Available Tech Campus Pools
                </h2>
                <div class="text-xs text-slate-500">
                  Showing {{ filteredRides.length }} verified employee rides · Non-commercial fuel splitting
                </div>
              </div>

              <div class="text-xs text-slate-500">
                <span class="font-semibold text-slate-800">{{ totalAvailableSeats }}</span> total seats open
              </div>
            </div>

            <div *ngIf="filteredRides.length === 0" class="bg-white border border-slate-200 rounded-xl p-8 text-center">
              <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <app-icon name="alert-circle" className="w-6 h-6"></app-icon>
              </div>
              <h3 class="text-sm font-semibold text-slate-900 mb-1">No rides found matching your filters</h3>
              <p class="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                Try clearing your search query or switching to all pools to see open car and bike pools across Hyderabad.
              </p>
              <button
                type="button"
                (click)="resetFilters()"
                class="px-3.5 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>

            <div *ngIf="filteredRides.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <app-ride-card
                *ngFor="let ride of filteredRides"
                [ride]="ride"
                [currentUserId]="currentUser.id"
                (selectRide)="selectedRide = $event"
                (joinRide)="handleJoinRide($event)"
              ></app-ride-card>
            </div>
          </div>
        </div>

        <!-- Tab 2: Full Screen Live Corridor Map -->
        <div *ngIf="activeTab === 'map'" class="space-y-6 animate-in fade-in duration-200">
          <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 class="text-lg font-bold text-slate-900">
                Greater Hyderabad Live Tech Corridor Radar
              </h1>
              <p class="text-xs text-slate-500">
                Interactive real-time routing across 30+ Hyderabad commuter hubs to Cyberabad & Financial District
              </p>
            </div>
            <button
              type="button"
              (click)="isScheduleModalOpen = true"
              class="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
            >
              <app-icon name="plus" className="w-3.5 h-3.5"></app-icon>
              <span>Add Your Ride to Radar</span>
            </button>
          </div>

          <app-real-time-corridor-map
            [rides]="rides"
            [selectedRide]="selectedRide"
            (selectRide)="selectedRide = $event"
            (selectAreaFilter)="onAreaFilterSelected($event)"
          ></app-real-time-corridor-map>
        </div>

        <!-- Tab 3: Offer a Ride Form Trigger -->
        <div *ngIf="activeTab === 'schedule'" class="max-w-2xl mx-auto py-8 text-center animate-in fade-in duration-200">
          <div class="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs">
            <div class="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-xs">
              <app-icon name="bike" className="w-8 h-8"></app-icon>
            </div>
            <h2 class="text-xl font-bold text-slate-900 mb-2">Offer a Commute Ride in Hyderabad</h2>
            <p class="text-xs text-slate-500 max-w-md mx-auto mb-6">
              Share your empty vehicle seats with verified colleagues heading to HITEC City, Financial District, or Knowledge City. Earn non-commercial fuel recovery plus <strong class="text-emerald-700">₹3/ride (bike)</strong> or <strong class="text-emerald-700">₹5/ride (car)</strong> company green benefit.
            </p>
            <button
              type="button"
              (click)="isScheduleModalOpen = true"
              class="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer shadow-sm inline-flex items-center gap-2"
            >
              <app-icon name="plus" className="w-4 h-4"></app-icon>
              <span>Open Ride Scheduler</span>
            </button>
          </div>
        </div>

        <!-- Tab 4: Cost Splitter Calculator -->
        <div *ngIf="activeTab === 'calculator'" class="animate-in fade-in duration-200">
          <app-cost-splitter-calculator></app-cost-splitter-calculator>
        </div>

        <!-- Tab 5: Green Benefit Dashboard & Wallet -->
        <div *ngIf="activeTab === 'benefit'" class="animate-in fade-in duration-200">
          <app-green-benefit-dashboard
            [currentUser]="currentUser"
            [transactions]="transactions"
            (redeemFunds)="handleRedeemFunds($event)"
          ></app-green-benefit-dashboard>
        </div>

        <!-- Tab 6: Company Verification Portal -->
        <div *ngIf="activeTab === 'verification'" class="animate-in fade-in duration-200">
          <app-company-verification-portal
            [currentUser]="currentUser"
            [verificationRequests]="verificationRequests"
            (approveRequest)="handleApproveVerification($event)"
            (rejectRequest)="handleRejectVerification($event)"
            (submitNewVerification)="handleSubmitNewVerification($event)"
          ></app-company-verification-portal>
        </div>
      </main>

      <!-- Footer -->
      <footer class="mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <span class="font-bold text-slate-800">Gopool Hyderabad</span>
            <span>·</span>
            <span>IT Campus Commute & Corporate Green Commute Benefit Program</span>
          </div>
          <div class="flex items-center gap-4 text-slate-400">
            <span>Corporate Green Subsidies: ₹3 Bike / ₹5 Car</span>
            <span>·</span>
            <span>HITEC City · Financial District · Gachibowli</span>
          </div>
        </div>
      </footer>

      <!-- Modals -->
      <!-- 1. Ride Detail Modal -->
      <app-ride-detail-modal
        *ngIf="selectedRide"
        [ride]="selectedRide"
        [currentUser]="currentUser"
        (close)="selectedRide = null"
        (joinRide)="handleJoinRide($event.ride, $event.pickupPoint)"
        (cancelBooking)="handleCancelBooking($event)"
        (startRide)="handleStartSimulation($event)"
      ></app-ride-detail-modal>

      <!-- 2. Schedule Ride Modal -->
      <app-schedule-ride-modal
        *ngIf="isScheduleModalOpen"
        [currentUser]="currentUser"
        (close)="isScheduleModalOpen = false"
        (publishRide)="handlePublishRide($event)"
      ></app-schedule-ride-modal>

      <!-- 3. User Profile Modal -->
      <app-user-profile-modal
        *ngIf="isUserModalOpen"
        [currentUser]="currentUser"
        (close)="isUserModalOpen = false"
        (selectUser)="handleSelectUser($event)"
      ></app-user-profile-modal>

      <!-- 4. Active Ride Simulator -->
      <app-active-ride-simulator
        *ngIf="isSimulatorOpen && activeSimulatorRide"
        [ride]="activeSimulatorRide"
        [currentUser]="currentUser"
        (close)="isSimulatorOpen = false"
        (completeRide)="handleCompleteRide($event.ride, $event.subsidyAmount)"
      ></app-active-ride-simulator>

      <!-- Toast Notification -->
      <div
        *ngIf="toastMessage"
        class="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 text-xs max-w-sm animate-in slide-in-from-bottom duration-200"
      >
        <div class="font-bold flex items-center gap-1.5 text-emerald-400">
          <app-icon name="check-circle-2" className="w-4 h-4"></app-icon>
          <span>{{ toastMessage.title }}</span>
        </div>
        <div *ngIf="toastMessage.subtitle" class="text-slate-300 mt-1">
          {{ toastMessage.subtitle }}
        </div>
      </div>
    </div>
  `
})
export class AppComponent implements OnInit {
  activeTab: NavTab = 'rides';
  currentUser: Employee = MOCK_CURRENT_USER;
  rides: Ride[] = INITIAL_RIDES;
  verificationRequests: VerificationRequest[] = INITIAL_VERIFICATION_REQUESTS;
  transactions: GreenTransaction[] = INITIAL_TRANSACTIONS;

  showLiveMapInFeed: boolean = true;
  searchQuery: string = '';
  filterMode: FilterMode = 'all';

  selectedRide: Ride | null = null;
  isScheduleModalOpen: boolean = false;
  isUserModalOpen: boolean = false;
  isSimulatorOpen: boolean = false;
  activeSimulatorRide: Ride | null = null;

  toastMessage: { title: string; subtitle?: string; type?: 'success' | 'info' } | null = null;
  private toastTimer: any;

  ngOnInit() {
    this.activeSimulatorRide = this.rides[0];
  }

  showToast(title: string, subtitle?: string, type: 'success' | 'info' = 'success') {
    this.toastMessage = { title, subtitle, type };
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastMessage = null;
    }, 4500);
  }

  get filteredRides(): Ride[] {
    return this.rides.filter((ride) => {
      if (this.filterMode === 'bike' && ride.poolType !== 'bike') return false;
      if (this.filterMode === 'car' && ride.poolType !== 'car') return false;
      if (this.filterMode === 'my_company' && ride.host.company !== this.currentUser.company) return false;

      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase();
        const matchOrigin = ride.origin.toLowerCase().includes(q);
        const matchDest = ride.destinationCampus.toLowerCase().includes(q);
        const matchHost = ride.host.name.toLowerCase().includes(q);
        const matchCompany = ride.host.company.toLowerCase().includes(q);
        const matchWaypoint = ride.routeHighlights.some((h) => h.toLowerCase().includes(q));
        if (!matchOrigin && !matchDest && !matchHost && !matchCompany && !matchWaypoint) return false;
      }

      return true;
    });
  }

  get totalAvailableSeats(): number {
    return this.rides.reduce((sum, r) => sum + r.availableSeats, 0);
  }

  onTabChange(tab: NavTab) {
    this.activeTab = tab;
  }

  onAreaFilterSelected(areaName: string) {
    this.searchQuery = areaName;
    this.activeTab = 'rides';
  }

  resetFilters() {
    this.searchQuery = '';
    this.filterMode = 'all';
  }

  openSimulatorDirectly() {
    if (!this.activeSimulatorRide && this.rides.length > 0) {
      this.activeSimulatorRide = this.rides[0];
    }
    this.isSimulatorOpen = true;
  }

  handleJoinRide(ride: Ride, pickupPoint?: string) {
    const isAlreadyPassenger = ride.passengers.some((p) => p.employee.id === this.currentUser.id);
    if (isAlreadyPassenger) {
      this.showToast('Already Reserved', 'You already have a seat booked in this pool.', 'info');
      return;
    }
    if (ride.availableSeats <= 0) {
      this.showToast('Pool is Full', 'All seats in this ride have been taken.', 'info');
      return;
    }

    const updatedRide: Ride = {
      ...ride,
      availableSeats: ride.availableSeats - 1,
      passengers: [
        ...ride.passengers,
        {
          employee: this.currentUser,
          status: 'confirmed',
          pickupPoint: pickupPoint || ride.routeHighlights[0] || ride.origin,
          joinedAt: 'Just now',
          farePaid: ride.riderPayableAmount,
          companySubsidyReceived: ride.companySubsidyPerRide,
        },
      ],
    };

    this.rides = this.rides.map((r) => (r.id === ride.id ? updatedRide : r));

    const newTx: GreenTransaction = {
      id: `tx-${Date.now()}`,
      rideId: ride.id,
      date: 'Just now',
      type: 'fuel_split_paid',
      amount: ride.riderPayableAmount,
      poolType: ride.poolType,
      description: `Fuel split share for ${ride.poolType === 'bike' ? 'Bike Pool' : 'Car Pool'} with ${ride.host.name}`,
      status: 'debited',
    };
    this.transactions = [newTx, ...this.transactions];

    this.showToast(
      'Pool Seat Reserved!',
      `You paid ₹${ride.riderPayableAmount.toFixed(1)} (Company subsidised ₹${ride.companySubsidyPerRide.toFixed(0)}). Pickup at ${pickupPoint || ride.origin}.`
    );
  }

  handleCancelBooking(rideId: string) {
    this.rides = this.rides.map((r) => {
      if (r.id === rideId) {
        return {
          ...r,
          availableSeats: r.availableSeats + 1,
          passengers: r.passengers.filter((p) => p.employee.id !== this.currentUser.id),
        };
      }
      return r;
    });
    this.showToast('Reservation Cancelled', 'Your seat has been released to campus colleagues.', 'info');
  }

  handlePublishRide(newRideData: Partial<Ride>) {
    const fullRide = newRideData as Ride;
    this.rides = [fullRide, ...this.rides];
    this.showToast(
      'Ride Published Successfully!',
      `Your ${fullRide.poolType === 'bike' ? 'Bike' : 'Car'} pool is now live for tech park commuters. You earn ₹${fullRide.companySubsidyPerRide.toFixed(0)} green subsidy upon completion.`
    );
  }

  handleStartSimulation(ride: Ride) {
    this.activeSimulatorRide = ride;
    this.isSimulatorOpen = true;
  }

  handleCompleteRide(completedRide: Ride, subsidyAmount: number) {
    this.currentUser = {
      ...this.currentUser,
      greenWalletBalance: this.currentUser.greenWalletBalance + subsidyAmount,
      ridesCompleted: this.currentUser.ridesCompleted + 1,
      co2SavedKg: Math.round((this.currentUser.co2SavedKg + (completedRide.poolType === 'bike' ? 1.4 : 2.2)) * 10) / 10,
    };

    const subsidyTx: GreenTransaction = {
      id: `tx-subsidy-${Date.now()}`,
      rideId: completedRide.id,
      date: 'Just now',
      type: completedRide.poolType === 'bike' ? 'bike_subsidy' : 'car_subsidy',
      amount: subsidyAmount,
      poolType: completedRide.poolType,
      description: `Corporate Green Subsidy (₹${subsidyAmount.toFixed(0)}) from ${this.currentUser.company} Benefit Fund`,
      status: 'credited',
    };

    this.transactions = [subsidyTx, ...this.transactions];
    this.rides = this.rides.map((r) => (r.id === completedRide.id ? { ...r, status: 'completed' } : r));

    this.showToast(
      'Ride Completed & Green Subsidy Disbursed!',
      `₹${subsidyAmount.toFixed(2)} corporate green benefit was credited directly to your Green Wallet!`
    );
  }

  handleApproveVerification(requestId: string) {
    this.verificationRequests = this.verificationRequests.map((req) =>
      req.id === requestId ? { ...req, status: 'approved' as const } : req
    );
    this.showToast('Employee Verified!', 'Employee badge authenticated. Corporate green subsidy activated for this user.');
  }

  handleRejectVerification(requestId: string) {
    this.verificationRequests = this.verificationRequests.map((req) =>
      req.id === requestId ? { ...req, status: 'rejected' as const } : req
    );
    this.showToast('Request Rejected', 'Verification documentation did not match corporate HR records.', 'info');
  }

  handleSubmitNewVerification(newReq: Partial<VerificationRequest>) {
    this.verificationRequests = [newReq as VerificationRequest, ...this.verificationRequests];
    this.showToast('Verification Request Submitted', 'HR review queued. Verification takes under 1 hour.');
  }

  handleRedeemFunds(data: { amount: number; method: string }) {
    this.currentUser = {
      ...this.currentUser,
      greenWalletBalance: Math.max(0, this.currentUser.greenWalletBalance - data.amount),
    };

    const redeemTx: GreenTransaction = {
      id: `tx-redeem-${Date.now()}`,
      rideId: 'manual-redemption',
      date: 'Just now',
      type: 'wallet_redemption',
      amount: data.amount,
      description: `Voucher Redemption to ${data.method}`,
      status: 'debited',
    };

    this.transactions = [redeemTx, ...this.transactions];
    this.showToast(
      'Voucher Disbursed Successfully!',
      `₹${data.amount.toFixed(2)} voucher sent to your registered email (${this.currentUser.email}).`
    );
  }

  handleSelectUser(user: Employee) {
    this.currentUser = user;
    this.showToast(
      'Identity Switched (Demo)',
      `You are now viewing Gopool as ${user.name} (${user.company}).`
    );
  }
}
