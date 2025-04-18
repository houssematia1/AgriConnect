import { Component, OnInit } from '@angular/core';
import { ProduitService } from '../services/produit.service';
import { Produit } from '../models/produit.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

interface ProductDisplay {
  id: number;
  name: string;
  price: number;
  devise: string;
  image: string | SafeUrl;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: ProductDisplay[] = [];

  constructor(
    private produitService: ProduitService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts(): void {
    this.produitService.getAll().subscribe({
      next: (response: any) => {
        const produits = response.content || response;
        this.products = produits.map((produit: Produit) => ({
          id: produit.id!,
          name: produit.nom,
          price: produit.prix,
          devise: produit.devise || 'XAF',
          image: produit.image
            ? this.sanitizer.bypassSecurityTrustUrl(`http://localhost:8082/api/produits/images/${produit.image}`)
            : '/assets/img/placeholder.jpg'
        }));
      },
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img.src !== '/assets/img/placeholder.jpg') {
      img.src = '/assets/img/placeholder.jpg';
    }
  }
}
