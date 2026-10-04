import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ride, Employee } from '../../types/commute';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-active-ride-simulator',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div class="flex items-center gap-2">
            <span class="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <app-icon [name]="isBike ? 'bike' : 'car'" className="w-5 h-5"></app-icon>
            </span>
            <div>
              <h2 class="text-base font-bold text-slate-900">
                Live Ride Simulator
              </h2>
              <div class="text-xs text-slate-500">
                {{ isBike ? 'Bike Pool' : 'Car Pool' }} · {{ ride.distanceKm }} km · {{ ride.vehicle.makeModel }}
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

        <div class="p-6 space-y-6">
          <!-- Progress bar -->
          <div>
            <div class="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>Commute Status:</span>
              <span class="font-semibold text-slate-900 capitalize">
                {{ statusLabel }}
              </span>
            </div>
            <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                class="h-full bg-emerald-600 transition-all duration-500 ease-out"
                [style.width.%]="step === 'completed' ? 100 : progress"
              ></div>
            </div>
          </div>

          <!-- Current Stop & Live Corridor -->
          <div class="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div class="text-xs text-slate-500 mb-1">Current Corridor Location:</div>
            <div class="text-sm font-bold text-slate-900 flex items-center gap-2">
              <app-icon name="map-pin" className="w-4 h-4 text-emerald-600 shrink-0"></app-icon>
              <span>{{ currentWaypoint }}</span>
            </div>

            <div class="mt-3 flex items-center justify-between text-xs text-slate-600 border-t border-slate-200 pt-2 font-mono">
              <span>From: {{ ride.origin.split('(')[0] }}</span>
              <app-icon name="arrow-right" className="w-3.5 h-3.5 text-slate-400"></app-icon>
              <span class="text-emerald-800 font-semibold">{{ ride.destinationCampus.split(',')[0] }}</span>
            </div>
          </div>

          <!-- Step 1: Pre-Ride Briefing -->
          <div *ngIf="step === 'briefing'" class="space-y-4">
            <div class="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs space-y-2">
              <div class="font-bold text-emerald-950 flex items-center gap-1.5">
                <app-icon name="shield-check" className="w-4 h-4 text-emerald-700"></app-icon>
                Campus Security & Verification Check Passed
              </div>
              <div class="text-slate-700">
                Host: <strong>{{ ride.host.name }}</strong> ({{ ride.host.company }})
              </div>
              <div *ngIf="isBike" class="text-slate-700 flex items-center gap-1">
                <span>✓ Safety Rule: Clean sanitized pillion helmet confirmed ready.</span>
              </div>
              <div class="text-emerald-900 font-medium pt-1">
                Eligible for <strong>₹{{ subsidyAmount.toFixed(0) }} company green benefit</strong> upon campus arrival.
              </div>
            </div>

            <button
              type="button"
              (click)="handleStartTransit()"
              class="w-full py-2.5 px-4 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
            >
              <app-icon name="play" className="w-4 h-4 fill-white"></app-icon>
              <span>Start Commute Ride</span>
            </button>
          </div>

          <!-- Step 2: In-Transit with Live Google Map -->
          <div *ngIf="step === 'in_transit'" class="space-y-3">
            <div class="w-full h-56 rounded-xl overflow-hidden border border-slate-200 relative bg-slate-100 shadow-inner">
              <div #simulatorMapContainer class="w-full h-full"></div>

              <div class="absolute top-2 left-2 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-mono font-medium text-slate-800 border border-slate-200 shadow-xs flex items-center gap-1.5 z-10">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Cruising at 38 km/h · {{ ride.distanceKm }} km corridor</span>
              </div>
            </div>

            <div class="text-center text-xs text-slate-500">
              Approaching next campus waypoint along Hyderabad tech corridor.
            </div>
          </div>

          <!-- Step 3: Arrived at Campus -->
          <div *ngIf="step === 'arrived'" class="space-y-4">
            <div class="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-center space-y-2">
              <app-icon name="check-circle-2" className="w-8 h-8 text-emerald-600 mx-auto"></app-icon>
              <div class="text-sm font-bold text-emerald-950">
                Arrived Safely at {{ ride.destinationCampus.split(',')[0] }}!
              </div>
              <div class="text-xs text-emerald-800">
                RFID Campus Gate scan completed. Ready to disburse fair fuel split and company green incentive.
              </div>
            </div>

            <button
              type="button"
              (click)="handleFinishRide()"
              class="w-full py-2.5 px-4 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
            >
              <app-icon name="sparkles" className="w-4 h-4"></app-icon>
              <span>Complete Ride & Disburse Subsidy</span>
            </button>
          </div>

          <!-- Step 4: Completed & Receipt -->
          <div *ngIf="step === 'completed'" class="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-4">
            <div class="text-center">
              <span class="text-[10px] font-semibold text-emerald-700 uppercase tracking-widest">
                OFFICIAL GREEN COMMUTE RECEIPT
              </span>
              <div class="text-base font-bold text-slate-900 mt-1">
                Ride Completed & Settled
              </div>
              <div class="text-xs text-slate-500 font-mono">Ride #{{ ride.id }} · Today</div>
            </div>

            <div class="bg-white p-3 rounded-lg border border-slate-200 space-y-2 text-xs">
              <div class="flex justify-between">
                <span class="text-slate-500">Base Fair Fuel Share:</span>
                <span class="font-mono tabular-nums text-slate-800">₹{{ ride.standardPerRiderSplit.toFixed(1) }}</span>
              </div>

              <div class="flex justify-between font-medium text-emerald-800 bg-emerald-50/70 p-1.5 rounded">
                <span class="flex items-center gap-1">
                  <app-icon name="leaf" className="w-3.5 h-3.5 text-emerald-600"></app-icon>
                  Company Green Subsidy ({{ isBike ? 'Bike Pool ₹3' : 'Car Pool ₹5' }}):
                </span>
                <span class="font-mono tabular-nums font-bold text-emerald-700">
                  +₹{{ subsidyAmount.toFixed(2) }} Credited!
                </span>
              </div>

              <div class="flex justify-between pt-1 border-t border-slate-100 font-semibold text-slate-900">
                <span>Net Commuter Fuel Paid:</span>
                <span class="font-mono tabular-nums text-emerald-700">₹{{ ride.riderPayableAmount.toFixed(1) }}</span>
              </div>
            </div>

            <div class="text-[11px] text-slate-600 text-center">
              ✓ <strong>₹{{ subsidyAmount.toFixed(2) }}</strong> has been credited to your Green Commute Wallet from {{ currentUser.company }}'s sustainability fund!
            </div>

            <button
              type="button"
              (click)="close.emit()"
              class="w-full py-2 px-4 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Close Simulator
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ActiveRideSimulatorComponent implements OnInit, OnDestroy {
  @Input() ride!: Ride;
  @Input() currentUser!: Employee;
  @Output() close = new EventEmitter<void>();
  @Output() completeRide = new EventEmitter<{ ride: Ride; subsidyAmount: number }>();

  @ViewChild('simulatorMapContainer') simulatorMapContainer?: ElementRef<HTMLDivElement>;

  step: 'briefing' | 'in_transit' | 'arrived' | 'completed' = 'briefing';
  progress: number = 0;
  currentWaypointIndex: number = 0;
  private intervalTimer: any;
  private mapInstance: any;
  private markerInstance: any;
  private polylineInstance: any;

  get isBike(): boolean {
    return this.ride.poolType === 'bike';
  }

  get subsidyAmount(): number {
    return this.isBike ? 3.0 : 5.0;
  }

  get waypoints(): string[] {
    return [
      this.ride.origin,
      ...(this.ride.routeHighlights.length > 0 ? this.ride.routeHighlights : ['Bio-Diversity Flyover', 'Durgam Cheruvu Bridge', 'Wipro Circle']),
      this.ride.destinationCampus,
    ];
  }

  get currentWaypoint(): string {
    return this.waypoints[this.currentWaypointIndex] || this.ride.origin;
  }

  get statusLabel(): string {
    switch (this.step) {
      case 'briefing': return 'Pre-Ride Security & Helmet Check';
      case 'in_transit': return `In Transit (${this.progress}% complete)`;
      case 'arrived': return 'Arrived at IT Tech Campus Gate';
      case 'completed': return 'Completed & Subsidy Disbursed!';
    }
  }

  get routeCoordinates(): Array<{ lat: number; lng: number }> {
    return this.ride.pathCoordinates && this.ride.pathCoordinates.length > 0
      ? this.ride.pathCoordinates
      : [
          this.ride.originCoords || { lat: 17.4938, lng: 78.3914 },
          { lat: 17.4580, lng: 78.3790 },
          { lat: 17.4285, lng: 78.3698 },
          this.ride.destinationCoords || { lat: 17.4156, lng: 78.3427 },
        ];
  }

  ngOnInit() {
    this.currentWaypointIndex = 0;
  }

  ngOnDestroy() {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
    }
    if (this.polylineInstance) {
      this.polylineInstance.setMap(null);
    }
  }

  handleStartTransit() {
    this.step = 'in_transit';
    this.progress = 10;
    setTimeout(() => {
      this.initMiniMap();
    }, 100);

    this.intervalTimer = setInterval(() => {
      this.progress += 15;
      if (this.progress >= 100) {
        this.progress = 100;
        clearInterval(this.intervalTimer);
        this.step = 'arrived';
      }
      const nextIdx = Math.min(this.waypoints.length - 1, Math.floor((this.progress / 100) * this.waypoints.length));
      this.currentWaypointIndex = nextIdx;
      this.updateVehiclePosition();
    }, 700);
  }

  handleFinishRide() {
    this.step = 'completed';
    this.completeRide.emit({ ride: this.ride, subsidyAmount: this.subsidyAmount });
  }

  private initMiniMap() {
    const container = this.simulatorMapContainer?.nativeElement;
    if (!container || !(window as any).google?.maps) return;

    const coords = this.routeCoordinates;
    const startPos = coords[0];

    this.mapInstance = new google.maps.Map(container, {
      center: startPos,
      zoom: 13,
      disableDefaultUI: true,
      mapId: 'DEMO_MAP_ID',
    });

    this.polylineInstance = new google.maps.Polyline({
      path: coords,
      strokeColor: '#059669',
      strokeOpacity: 0.9,
      strokeWeight: 5,
      map: this.mapInstance,
    });

    if (google.maps.marker?.AdvancedMarkerElement) {
      const pin = document.createElement('div');
      pin.className = 'p-2 rounded-full bg-emerald-600 text-white shadow-lg border-2 border-white flex items-center justify-center';
      pin.innerHTML = this.isBike
        ? '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>'
        : '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.2 1 12 1 13v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>';

      this.markerInstance = new google.maps.marker.AdvancedMarkerElement({
        map: this.mapInstance,
        position: startPos,
        content: pin,
      });
    }
  }

  private updateVehiclePosition() {
    if (!this.mapInstance || !this.markerInstance) return;
    const coords = this.routeCoordinates;
    const idx = Math.min(coords.length - 1, Math.floor((this.progress / 100) * coords.length));
    const pos = coords[idx];
    this.markerInstance.position = pos;
    this.mapInstance.panTo(pos);
  }
}
