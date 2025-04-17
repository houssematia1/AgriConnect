import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-google-maps',
  template: `
    <div>
      <agm-map [latitude]="latitude" [longitude]="longitude" [zoom]="zoom">
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

  ngOnInit(): void {
    // Logic for initialization, if needed
  }
}
