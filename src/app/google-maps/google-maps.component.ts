import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-google-maps',
  template: `
    <div>
      <agm-map 
        *ngIf="isGoogleMapsLoaded" 
        [latitude]="latitude" 
        [longitude]="longitude" 
        [zoom]="zoom">
        <agm-marker [latitude]="latitude" [longitude]="longitude"></agm-marker>
      </agm-map>
    </div>
  `,
  styleUrls: ['./google-maps.component.css']
})
export class GoogleMapsComponent implements OnInit {
  latitude: number = 48.8566;  // Coordonnées de Paris (modifiable)
  longitude: number = 2.3522;  // Coordonnées de Paris (modifiable)
  zoom: number = 12;  // Niveau de zoom
  isGoogleMapsLoaded: boolean = false;

  ngOnInit(): void {
    // Check if Google Maps API is loaded
    this.waitForGoogleMaps();
  }

  private waitForGoogleMaps() {
    if (typeof google === 'object' && typeof google.maps === 'object') {
      this.isGoogleMapsLoaded = true;
    } else {
      setTimeout(() => this.waitForGoogleMaps(), 100);
    }
  }
}
