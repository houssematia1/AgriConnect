import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ProduitService } from '../services/produit.service';
import { RecommendationService } from '../services/recommendation.service';
import { Produit } from '../models/produit.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import Swiper, { Navigation } from 'swiper';
import { Router } from '@angular/router';

interface ProductDisplay {
  id: number;
  name: string;
  price: number;
  devise: string;
  image: string | SafeUrl;
  quantity: number;
}

interface Category {
  name: string;
  image: string;
}

@Component({
  selector: 'app-homeclient',
  templateUrl: './homeclient.component.html',
  styleUrls: ['./homeclient.component.css']
})
export class HomeclientComponent implements OnInit, AfterViewInit {
  products: ProductDisplay[] = [];
  recommendedProducts: ProductDisplay[] = [];
  categories: Category[] = [
    { name: 'FRUITS', image: '/assets/template/images/fuits.jpg' },
    { name: 'LEGUMES', image: '/assets/template/images/vegetables.jpg' },
    { name: 'CEREALES', image: '/assets/template/images/grain.jpg' },
    { name: 'AUTRE', image: '/assets/template/images/others.jpg' }
  ];

  constructor(
    private produitService: ProduitService,
    private recommendationService: RecommendationService,
    private sanitizer: DomSanitizer,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadRecommendedProducts();
  }

  ngAfterViewInit(): void {
    new Swiper('.category-carousel', {
      modules: [Navigation],
      slidesPerView: 4,
      spaceBetween: 20,
      navigation: {
        nextEl: '.category-carousel-prev',
        prevEl: '.category-carousel-next',
      },
      breakpoints: {
        320: { slidesPerView: 1 },
        576: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        992: { slidesPerView: 4 }
      }
    });
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
          image: produit.image && produit.image.trim() !== ''
            ? this.sanitizer.bypassSecurityTrustUrl(produit.image)
            : '/assets/img/placeholder.jpg',
          quantity: 1
        }));
      },
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });
  }
  goToCategorie(categ: string) {
    this.router.navigate(['/produitCategorieparClient'], { queryParams: { categ } });
  }

  loadRecommendedProducts(): void {
    const userId = 1; // À remplacer par l'ID de l'utilisateur connecté
    this.recommendationService.getRecommendationsBasedOnHistory(userId, 6).subscribe({
      next: (produits: Produit[]) => {
        this.recommendedProducts = produits.map((produit: Produit) => ({
          id: produit.id!,
          name: produit.nom,
          price: produit.prix,
          devise: produit.devise || 'XAF',
          image: produit.image && produit.image.trim() !== ''
            ? this.sanitizer.bypassSecurityTrustUrl(produit.image)
            : '/assets/img/placeholder.jpg',
          quantity: 1
        }));
      },
      error: (err) => {
        console.error('Error loading recommended products:', err);
      }
    });
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img.src !== '/assets/img/placeholder.jpg') {
      img.src = '/assets/img/placeholder.jpg';
    }
  }

  addToCart(product: ProductDisplay): void {
    console.log(`Added ${product.name} to cart: ID=${product.id}, Quantity=${product.quantity}`);
    // Integrate with CartService: this.cartService.addToCart({ ...product });
  }

  toggleWishlist(product: ProductDisplay): void {
    console.log(`Toggled wishlist for ${product.name} (ID: ${product.id})`);
    // Integrate with WishlistService: this.wishlistService.toggle(product.id);
  }

  trackByProductId(index: number, product: ProductDisplay): number {
    return product.id;
  }
}