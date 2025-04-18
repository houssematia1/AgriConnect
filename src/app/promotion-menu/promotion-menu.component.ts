import { Component } from '@angular/core';

@Component({
  selector: 'app-promotion-menu',
  templateUrl: './promotion-menu.component.html',
  styleUrls: ['./promotion-menu.component.css']
})
export class PromotionMenuComponent {
  navLinks = [
    { path: '/promotions/list', label: 'Liste des Promotions' },
    { path: '/promotions/add', label: 'Ajouter une Promotion' },
    { path: '/promotions/analytics', label: 'Analyse des Promotions' }
  ];

  onImageError(event: Event): void {
    console.error('Failed to load image:', (event.target as HTMLImageElement).src);
  }

  onImageLoad(event: Event): void {
    console.log('Image loaded successfully:', (event.target as HTMLImageElement).src);
  }
}