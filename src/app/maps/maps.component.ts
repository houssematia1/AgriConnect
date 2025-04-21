import { Component, AfterViewInit, ViewEncapsulation } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import 'leaflet-routing-machine';
import 'leaflet-control-geocoder';

@Component({
  selector: 'app-map',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class MapsComponent implements AfterViewInit {
  
  private map: any;
  private markerA: L.Marker | null = null;
  private markerB: L.Marker | null = null;
  private routeControl: any;

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove(); // 🧹 Destroy the Leaflet instance
    }
  }

  private initMap(): void {
    if (this.map) {
      return; // 💡 Prevent re-initializing the map if it already exists
    }

    this.map = L.map('map').setView([34.0007, 9.4859], 6)    // tunisia

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    
    // Listen for map clicks
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.handleMapClick(e.latlng);
    });
  }

  private handleMapClick(latlng: L.LatLng): void {
    // L.Icon.Default.mergeOptions({
    //   iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    //   iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    //   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
    // });

    if (!this.markerA) {
      this.markerA = L.marker(latlng, { draggable: true }).addTo(this.map).bindPopup('Start').openPopup();
    } else if (!this.markerB) {
      this.markerB = L.marker(latlng, { draggable: true }).addTo(this.map).bindPopup('Destination').openPopup();
      this.calculateRoute();
    } else {
      // Reset markers and route
      this.map.removeLayer(this.markerA);
      this.map.removeLayer(this.markerB);
      if (this.routeControl) {
        this.map.removeControl(this.routeControl);
      }
      this.markerA = null;
      this.markerB = null;
    }
  }

  private calculateRoute(): void {
    if (!this.markerA || !this.markerB) return;

    const start = this.markerA.getLatLng();
    const end = this.markerB.getLatLng();

    // Remove previous route
    if (this.routeControl) {
      this.map.removeControl(this.routeControl);
    }

    this.routeControl = L.Routing.control({
      waypoints: [start, end],
      routeWhileDragging: true,
      show: false,
      addWaypoints: false,
      createMarker: () => null, // we'll use our own markers
    }).addTo(this.map);

    this.routeControl.on('routesfound', function (e: any) {
      const distance = (e.routes[0].summary.totalDistance / 1000).toFixed(2);
      const duration = (e.routes[0].summary.totalTime / 60).toFixed(1);
      console.log(`Distance: ${distance} km, Duration: ${duration} mins`);
    });
  }
}
