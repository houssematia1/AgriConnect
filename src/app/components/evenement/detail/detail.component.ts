import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EvenementService } from 'src/app/services/evenement.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-evenement-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class EvenementDetailComponent implements OnInit, AfterViewInit {
  evenement: any;
  
  map!: L.Map;

  constructor(
    private route: ActivatedRoute,
    private evenementService: EvenementService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    this.evenementService.getById(id).subscribe(data => {
      this.evenement = data;
      // Initialise la carte après réception de l'événement
      setTimeout(() => this.initMap(), 100);
    });
  }

  ngAfterViewInit(): void {
    // rien ici, tout est dans initMap() après réception des données
  }

  initMap(): void {
    if (this.evenement?.lieu?.includes(',')) {
      const [lat, lng] = this.evenement.lieu.split(',').map(Number);
      this.map = L.map('map-detail').setView([lat, lng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(this.map);

      L.marker([lat, lng]).addTo(this.map);
    }
  }

  getCategorieNames(): string {
    if (!this.evenement.categories || this.evenement.categories.length === 0) return 'Aucune';
    return this.evenement.categories.map((c: any) => c.nom).join(', ');
  }
  resume: string = '';

generateResume(): void {
  if (!this.evenement?.id) return;

  this.evenementService.resumeEvenement(this.evenement.id).subscribe(
    (response) => {
      this.resume = response.summary;
    },
    (error) => {
      console.error('Erreur lors de la génération du résumé', error);
    }
  );
}

}
