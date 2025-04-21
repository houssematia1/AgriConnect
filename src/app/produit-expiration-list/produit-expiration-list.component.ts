import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

// Interface pour les promotions
export interface Promotion {
  id?: number; // Optionnel car les promotions fictives n'ont pas d'ID
  nom: string;
  pourcentageReduction: number;
  dateDebut: string; // Format ISO
  dateFin: string;   // Format ISO
  conditionPromotion: string | null; // Peut être null pour les promotions manuelles
  active: boolean;
  produits?: Produit[];
  dateActivationPrevue?: string; // Nouveau champ pour la date d'activation prévue
}

// Interface pour les produits
export interface Produit {
  id: number;
  nom: string;
  prix: number;
  devise: string;
  dateExpiration: string; // Format ISO
  promotions: Promotion[];
}

@Component({
  selector: 'app-produit-expiration-list',
  templateUrl: './produit-expiration-list.component.html',
  styleUrls: ['./produit-expiration-list.component.css']
})
export class ProduitExpirationListComponent implements OnInit {
  promotionsAutomatiques: Promotion[] = [];
  promotionExpirationActive: Promotion | null = null; // Promotion "Expiration Produit" active
  isLoadingPromotions = true;
  errorMessagePromotions: string | null = null;
  private readonly useMockDataInProduction = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoadingPromotions = true;
    this.errorMessagePromotions = null;
    this.loadPromotions();
  }

  loadPromotions(): void {
    this.http.get<{ blackFriday: any[], expiration: any[] }>('http://localhost:8082/promotions/dynamic')
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.errorMessagePromotions = 'Erreur lors du chargement des promotions. Veuillez réessayer.';
          this.isLoadingPromotions = false;
          if (this.useMockDataInProduction) {
            this.useMockData();
          }
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (data) => {
          console.log('Données brutes du backend :', data);

          // Combiner les promotions Black Friday et Expiration
          const allPromotions = [...(data.blackFriday || []), ...(data.expiration || [])];

          // Mapper les promotions
          this.promotionsAutomatiques = allPromotions.map(promo => ({
            id: promo.id,
            nom: promo.nom,
            pourcentageReduction: promo.pourcentage_reduction,
            dateDebut: promo.date_debut,
            dateFin: promo.date_fin,
            conditionPromotion: promo.condition_promotion,
            active: promo.active,
            dateActivationPrevue: promo.date_activation_prevue, // Nouveau champ
            produits: promo.produits?.map((produit: any) => ({
              id: produit.id,
              nom: produit.nom,
              prix: Number(produit.prix) || 0,
              devise: produit.devise || 'TND',
              dateExpiration: produit.date_expiration,
              promotions: produit.promotions || []
            })) || []
          }));

          console.log('Promotions automatiques après mapping :', this.promotionsAutomatiques);

          // Recherche de la promotion active "Expiration Produit"
          this.promotionExpirationActive = this.promotionsAutomatiques.find(
            promo => promo.conditionPromotion === 'EXPIRATION_PRODUIT' && promo.active
          ) || null;

          this.isLoadingPromotions = false;
        },
        error: (error) => {
          console.error('Erreur inattendue lors du chargement des promotions:', error);
        }
      });
  }

  useMockData(): void {
    this.promotionsAutomatiques = [
      {
        id: 1,
        nom: 'Promotion Expiration Produit',
        pourcentageReduction: 40,
        conditionPromotion: 'EXPIRATION_PRODUIT',
        active: true,
        dateDebut: '2025-04-21T00:00:00.000+00:00',
        dateFin: '2025-04-26T00:00:00.000+00:00',
        produits: [
          { id: 1, nom: 'Produit 1', prix: 10.8, devise: 'TND', dateExpiration: '2025-04-22T00:00:00.000+00:00', promotions: [] },
          { id: 2, nom: 'Produit 2', prix: 8.64, devise: 'TND', dateExpiration: '2025-04-24T00:00:00.000+00:00', promotions: [] }
        ]
      },
      {
        id: 2,
        nom: 'Black Friday',
        pourcentageReduction: 50,
        conditionPromotion: 'BLACK_FRIDAY',
        active: false,
        dateDebut: '2025-11-25T00:00:00.000+00:00',
        dateFin: '2025-11-28T00:00:00.000+00:00',
        dateActivationPrevue: '2025-11-25',
        produits: [
          { id: 3, nom: 'Produit 3', prix: 20.0, devise: 'TND', dateExpiration: '2025-12-31T00:00:00.000+00:00', promotions: [] }
        ]
      }
    ];

    this.promotionExpirationActive = this.promotionsAutomatiques.find(
      promo => promo.conditionPromotion === 'EXPIRATION_PRODUIT' && promo.active
    ) || null;
  }

  getPrixInitial(produit: Produit): number {
    if (!this.promotionExpirationActive || this.promotionExpirationActive.pourcentageReduction === 0) {
      return produit.prix;
    }
    const reduction = this.promotionExpirationActive.pourcentageReduction;
    const prixInitial = produit.prix / (1 - reduction / 100);
    return Number(prixInitial.toFixed(2));
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Non spécifiée';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Date invalide';
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
}