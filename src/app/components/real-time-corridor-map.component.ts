import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ride } from '../../types/commute';
import { HYDERABAD_AREAS, HYDERABAD_ZONES, HyderabadArea } from '../../data/hyderabadAreas';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-real-time-corridor-map',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
      <!-- Real-Time Map Header -->
      <div class="px-5 py-3.5 border-b border-slate-200 bg-slate-50/80 flex flex-col gap-3">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
            <div>
              <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>All Areas of Hyderabad Commute Radar</span>
                <span class="text-[11px] font-mono text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded font-normal">
                  {{ hyderabadAreas.length }} Areas Connected
                </span>
              </h3>
              <div class="text-xs text-slate-500">
                Western IT · North-West · Central · Secunderabad · East / Uppal · South / Airport
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 text-xs">
            <button
              type="button"
              (click)="toggleAreaMarkers()"
              class="px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg cursor-pointer flex items-center gap-1 shadow-2xs font-medium"
            >
              <app-icon [name]="showAllAreaMarkers ? 'eye-off' : 'eye'" className="w-3.5 h-3.5"></app-icon>
              <span>{{ showAllAreaMarkers ? 'Hide Area Badges' : 'Show All Areas' }}</span>
            </button>

            <div *ngIf="selectedRide" class="hidden md:flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-lg border border-emerald-200">
              <span class="font-semibold">Tracking:</span>
              <span class="truncate max-w-[120px]">{{ selectedRide.origin.split('(')[0] }}</span>
              <span>→</span>
              <span class="truncate max-w-[100px]">{{ selectedRide.destinationCampus.split('-')[0] }}</span>
            </div>
          </div>
        </div>

        <!-- Zone Selector Strip on Map -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <span class="text-[11px] text-slate-400 shrink-0 font-medium mr-1">Zone:</span>
          <button
            *ngFor="let zone of hyderabadZones"
            type="button"
            (click)="selectZone(zone)"
            [class]="'px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ' +
              (selectedZone === zone
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900')"
          >
            {{ zone }}
          </button>
        </div>
      </div>

      <!-- Map Viewport Container -->
      <div class="w-full h-[420px] sm:h-[500px] relative bg-slate-100">
        <div #mapContainer class="w-full h-full"></div>

        <!-- Fallback message if Google Maps not loaded -->
        <div *ngIf="!isMapsAvailable" class="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 p-6 text-center text-slate-600">
          <app-icon name="map-pin" className="w-8 h-8 text-emerald-600 mb-2"></app-icon>
          <div class="font-bold text-slate-900 text-sm">Interactive Hyderabad Corridor Map</div>
          <div class="text-xs text-slate-500 mt-1 max-w-sm">
            Tracking active tech corridors across HITEC City, Gachibowli, Financial District, and Greater Hyderabad.
          </div>
        </div>

        <!-- Live GPS Telemetry Overlay Box -->
        <div
          *ngIf="selectedRide && currentLiveCoords"
          class="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-3 shadow-md max-w-xs text-xs space-y-1"
        >
          <div class="flex items-center justify-between text-[11px] text-slate-500">
            <span class="flex items-center gap-1 text-emerald-700 font-semibold">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
              Live Telemetry Active
            </span>
            <span class="font-mono text-slate-700 font-medium">36 km/h</span>
          </div>
          <div class="font-semibold text-slate-900 truncate">
            {{ selectedRide.vehicle.makeModel }} ({{ selectedRide.vehicle.registrationNumber }})
          </div>
          <div class="text-[11px] text-slate-600">
            Corridor: {{ selectedRide.routeHighlights[0] || 'Durgam Cheruvu / Bio-Diversity' }}
          </div>
          <div class="text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-100 flex justify-between">
            <span>Lat: {{ currentLiveCoords.lat.toFixed(4) }}</span>
            <span>Lng: {{ currentLiveCoords.lng.toFixed(4) }}</span>
          </div>
        </div>
      </div>

      <!-- Corridor Legend & Quick Hyderabad Areas -->
      <div class="px-5 py-3 border-t border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-4 text-slate-600">
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-full bg-emerald-600 inline-block"></span>
            <span>Bike Pool (₹3 Benefit)</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
            <span>Car Pool (₹5 Benefit)</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-slate-900 inline-block"></span>
            <span>Hyderabad Area Pin</span>
          </div>
        </div>

        <div class="flex items-center gap-1.5">
          <span class="text-slate-400">Popular Corridors:</span>
          <button
            *ngFor="let r of popularRideCorridors"
            type="button"
            (click)="selectRide.emit(r)"
            [class]="'px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ' +
              (selectedRide?.id === r.id
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200')"
          >
            {{ r.origin.split(' ')[0] }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class RealTimeCorridorMapComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input() rides: Ride[] = [];
  @Input() selectedRide: Ride | null = null;
  @Output() selectRide = new EventEmitter<Ride>();
  @Output() selectAreaFilter = new EventEmitter<string>();

  @ViewChild('mapContainer') mapContainer?: ElementRef<HTMLDivElement>;

  hyderabadAreas = HYDERABAD_AREAS;
  hyderabadZones = HYDERABAD_ZONES;
  selectedZone: string = 'All Zones';
  showAllAreaMarkers: boolean = true;
  isMapsAvailable: boolean = true;
  vehicleStep: number = 0;

  private mapInstance: any;
  private polylines: any[] = [];
  private markers: any[] = [];
  private vehicleMarker: any;
  private intervalTimer: any;
  private infoWindow: any;

  get popularRideCorridors(): Ride[] {
    return this.rides.slice(0, 4);
  }

  get currentLiveCoords(): { lat: number; lng: number } | null {
    if (this.selectedRide?.pathCoordinates && this.selectedRide.pathCoordinates.length > 0) {
      return this.selectedRide.pathCoordinates[this.vehicleStep % this.selectedRide.pathCoordinates.length];
    }
    return null;
  }

  ngOnInit() {
    this.intervalTimer = setInterval(() => {
      if (this.selectedRide?.pathCoordinates && this.selectedRide.pathCoordinates.length > 1) {
        this.vehicleStep = (this.vehicleStep + 1) % this.selectedRide.pathCoordinates.length;
        this.updateLiveVehicleMarker();
      }
    }, 2500);
  }

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.mapInstance) {
      if (changes['selectedRide'] || changes['rides']) {
        this.renderMapLayers();
      }
    }
  }

  ngOnDestroy() {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
    }
    this.clearMapLayers();
  }

  toggleAreaMarkers() {
    this.showAllAreaMarkers = !this.showAllAreaMarkers;
    this.renderAreaMarkers();
  }

  selectZone(zone: string) {
    this.selectedZone = zone;
    this.renderAreaMarkers();
    this.fitBounds();
  }

  private initMap() {
    const container = this.mapContainer?.nativeElement;
    if (!container) return;

    if (!(window as any).google?.maps) {
      // Retry in 300ms if script is still loading
      setTimeout(() => this.initMap(), 300);
      return;
    }

    try {
      this.mapInstance = new google.maps.Map(container, {
        center: { lat: 17.4350, lng: 78.4100 },
        zoom: 11.5,
        mapId: 'DEMO_MAP_ID',
        gestureHandling: 'greedy',
        disableDefaultUI: false,
      });

      this.infoWindow = new google.maps.InfoWindow();
      this.renderMapLayers();
    } catch (e) {
      console.warn('Map initialization note:', e);
      this.isMapsAvailable = false;
    }
  }

  private clearMapLayers() {
    this.polylines.forEach((p) => p.setMap(null));
    this.polylines = [];
    this.markers.forEach((m) => {
      if (m.setMap) m.setMap(null);
      else if (m.map) m.map = null;
    });
    this.markers = [];
    if (this.vehicleMarker) {
      if (this.vehicleMarker.map) this.vehicleMarker.map = null;
      this.vehicleMarker = null;
    }
  }

  private renderMapLayers() {
    if (!this.mapInstance || !(window as any).google?.maps) return;
    this.clearMapLayers();

    // 1. Draw Polylines
    const targetRides = this.selectedRide ? [this.selectedRide] : this.rides;
    targetRides.forEach((ride) => {
      if (!ride.pathCoordinates || ride.pathCoordinates.length < 2) return;
      const isSelected = this.selectedRide?.id === ride.id;
      const isBike = ride.poolType === 'bike';

      const polyline = new google.maps.Polyline({
        path: ride.pathCoordinates,
        geodesic: true,
        strokeColor: isSelected ? (isBike ? '#059669' : '#2563EB') : '#94A3B8',
        strokeOpacity: isSelected ? 0.95 : 0.45,
        strokeWeight: isSelected ? 6 : 3,
        map: this.mapInstance,
      });

      this.polylines.push(polyline);
    });

    // 2. Render Rides Origin and Destination Markers
    this.rides.forEach((ride) => {
      const isSelected = this.selectedRide?.id === ride.id;
      const isBike = ride.poolType === 'bike';

      // Pickup origin
      if (ride.originCoords) {
        if (google.maps.marker?.AdvancedMarkerElement) {
          const pin = document.createElement('div');
          pin.className = `p-1.5 rounded-full shadow-lg transition-transform cursor-pointer flex items-center justify-center ${
            isSelected ? 'ring-4 ring-emerald-400 scale-125 z-20' : 'hover:scale-110 z-10'
          } ${isBike ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'}`;
          pin.innerHTML = isBike
            ? '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>'
            : '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.2 1 12 1 13v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>';

          const marker = new google.maps.marker.AdvancedMarkerElement({
            map: this.mapInstance,
            position: ride.originCoords,
            content: pin,
            title: `Pickup: ${ride.origin}`,
          });

          marker.addListener('click', () => {
            this.showRidePopup(ride);
            this.selectRide.emit(ride);
          });
          this.markers.push(marker);
        }
      }

      // Campus destination
      if (ride.destinationCoords) {
        if (google.maps.marker?.AdvancedMarkerElement) {
          const pin = document.createElement('div');
          pin.className = `px-2 py-1 rounded-md text-[11px] font-bold shadow-md cursor-pointer transition-transform ${
            isSelected
              ? 'bg-emerald-950 text-emerald-300 ring-2 ring-emerald-400 scale-110 z-20'
              : 'bg-white text-slate-900 border border-slate-300'
          }`;
          pin.textContent = ride.destinationCampus.split('-')[0].trim();

          const marker = new google.maps.marker.AdvancedMarkerElement({
            map: this.mapInstance,
            position: ride.destinationCoords,
            content: pin,
            title: `Campus: ${ride.destinationCampus}`,
          });

          marker.addListener('click', () => {
            this.showRidePopup(ride);
            this.selectRide.emit(ride);
          });
          this.markers.push(marker);
        }
      }
    });

    // 3. Render Area Markers
    this.renderAreaMarkers();

    // 4. Render Live Vehicle Marker
    this.updateLiveVehicleMarker();

    // 5. Fit map bounds
    this.fitBounds();
  }

  private renderAreaMarkers() {
    if (!this.mapInstance || !this.showAllAreaMarkers || !(window as any).google?.maps) return;

    // Remove existing area markers
    this.markers = this.markers.filter((m) => {
      if (m.isAreaMarker) {
        if (m.map) m.map = null;
        return false;
      }
      return true;
    });

    const areasToRender = this.selectedZone === 'All Zones'
      ? this.hyderabadAreas
      : this.hyderabadAreas.filter((a) => a.zone === this.selectedZone);

    areasToRender.forEach((area) => {
      const isSelectedZone = this.selectedZone === area.zone;
      if (google.maps.marker?.AdvancedMarkerElement) {
        const pin = document.createElement('div');
        pin.className = `px-1.5 py-0.5 rounded text-[10px] font-semibold shadow-xs cursor-pointer transition-transform hover:scale-110 flex items-center gap-1 ${
          isSelectedZone
            ? 'bg-slate-900 text-white border border-slate-700 ring-1 ring-emerald-400'
            : 'bg-white/95 text-slate-700 border border-slate-300 backdrop-blur-xs'
        }`;
        pin.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span><span>${area.shortName}</span>`;

        const marker = new google.maps.marker.AdvancedMarkerElement({
          map: this.mapInstance,
          position: area.coords,
          content: pin,
          title: `${area.name} (~${area.approxKmToHitec}km to Tech Hub)`,
        });
        (marker as any).isAreaMarker = true;

        marker.addListener('click', () => {
          this.showAreaPopup(area);
        });

        this.markers.push(marker);
      }
    });
  }

  private updateLiveVehicleMarker() {
    if (!this.mapInstance || !this.selectedRide || !this.currentLiveCoords || !(window as any).google?.maps) {
      if (this.vehicleMarker) {
        this.vehicleMarker.map = null;
        this.vehicleMarker = null;
      }
      return;
    }

    if (!this.vehicleMarker && google.maps.marker?.AdvancedMarkerElement) {
      const pin = document.createElement('div');
      pin.className = 'relative flex items-center justify-center';
      pin.innerHTML = `
        <div class="w-9 h-9 rounded-full bg-emerald-500/30 animate-ping absolute"></div>
        <div class="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg border-2 border-white relative z-10">
          <svg class="w-4 h-4 transform rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
        </div>
      `;

      this.vehicleMarker = new google.maps.marker.AdvancedMarkerElement({
        map: this.mapInstance,
        position: this.currentLiveCoords,
        content: pin,
      });
    } else if (this.vehicleMarker) {
      this.vehicleMarker.position = this.currentLiveCoords;
    }
  }

  private fitBounds() {
    if (!this.mapInstance || !(window as any).google?.maps) return;

    if (this.selectedRide?.pathCoordinates && this.selectedRide.pathCoordinates.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      this.selectedRide.pathCoordinates.forEach((pt) => bounds.extend(pt));
      this.mapInstance.fitBounds(bounds, { top: 60, right: 60, bottom: 60, left: 60 });
    } else if (this.selectedZone !== 'All Zones') {
      const zoneAreas = this.hyderabadAreas.filter((a) => a.zone === this.selectedZone);
      if (zoneAreas.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        zoneAreas.forEach((a) => bounds.extend(a.coords));
        this.mapInstance.fitBounds(bounds, { top: 60, right: 60, bottom: 60, left: 60 });
      }
    } else {
      this.mapInstance.panTo({ lat: 17.4350, lng: 78.4100 });
      this.mapInstance.setZoom(11.5);
    }
  }

  private showRidePopup(ride: Ride) {
    if (!this.infoWindow || !ride.originCoords) return;
    const isBike = ride.poolType === 'bike';
    const content = `
      <div style="font-family: system-ui, sans-serif; padding: 4px; max-width: 220px; color: #0f172a;">
        <div style="font-weight: 700; font-size: 13px; margin-bottom: 4px;">
          ${isBike ? '🏍️ ' : '🚗 '} ${ride.vehicle.makeModel}
        </div>
        <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">
          ${ride.origin.split('(')[0]} → ${ride.destinationCampus.split('-')[0]}
        </div>
        <div style="font-size: 12px; font-weight: 700; color: #059669; margin-bottom: 6px;">
          You Pay: ₹${ride.riderPayableAmount.toFixed(1)} (₹${ride.companySubsidyPerRide} company benefit)
        </div>
        <div style="font-size: 11px; color: #64748b;">
          Host: ${ride.host.name} (${ride.host.company})
        </div>
      </div>
    `;
    this.infoWindow.setContent(content);
    this.infoWindow.setPosition(ride.originCoords);
    this.infoWindow.open(this.mapInstance);
  }

  private showAreaPopup(area: HyderabadArea) {
    if (!this.infoWindow) return;
    const content = `
      <div style="font-family: system-ui, sans-serif; padding: 4px; max-width: 240px; color: #0f172a;">
        <div style="font-weight: 700; font-size: 13px; margin-bottom: 4px; color: #0f172a;">
          📍 ${area.name}
        </div>
        <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">
          Zone: ${area.zone}
        </div>
        <div style="font-size: 11px; font-weight: 600; color: #047857; margin-bottom: 6px;">
          ${area.approxKmToHitec === 0 ? 'HITEC City Tech Epicenter' : '~' + area.approxKmToHitec + ' km to HITEC City / Financial Dist'}
        </div>
        <div style="font-size: 10px; color: #475569; margin-bottom: 8px;">
          <strong>Key Landmarks:</strong> ${area.popularLandmarks.slice(0, 3).join(', ')}
        </div>
      </div>
    `;
    this.infoWindow.setContent(content);
    this.infoWindow.setPosition(area.coords);
    this.infoWindow.open(this.mapInstance);
  }
}
