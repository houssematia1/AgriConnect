import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProduitExpirationListComponent, Produit, Promotion } from './produit-expiration-list.component';

describe('ProduitExpirationListComponent', () => {
  let component: ProduitExpirationListComponent;
  let fixture: ComponentFixture<ProduitExpirationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ProduitExpirationListComponent]
    });
    fixture = TestBed.createComponent(ProduitExpirationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with loading state', () => {
    expect(component.isLoadingPromotions).toBeTrue();
  });

  it('should format date correctly', () => {
    const date = '2025-04-21T00:00:00.000+00:00';
    const formattedDate = component.formatDate(date);
    expect(formattedDate).toBe('21 avr. 2025');
  });

  it('should return "Non spécifiée" for undefined date', () => {
    const formattedDate = component.formatDate('');
    expect(formattedDate).toBe('Non spécifiée');
  });

  it('should set promotionExpirationActive if "Expiration Produit" is active', () => {
    component.promotionsAutomatiques = [
      {
        id: 1,
        nom: 'Promotion Expiration Produit',
        pourcentageReduction: 40,
        conditionPromotion: 'EXPIRATION_PRODUIT',
        active: true,
        dateDebut: '2025-04-21T00:00:00.000+00:00',
        dateFin: '2025-04-26T00:00:00.000+00:00',
        produits: [
          { id: 1, nom: 'Produit 1', prix: 10.8, devise: 'TND', dateExpiration: '2025-04-22T00:00:00.000+00:00', promotions: [] }
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
        produits: []
      }
    ];

    component['loadPromotions']();

    expect(component.promotionExpirationActive).toBeTruthy();
    expect(component.promotionExpirationActive?.nom).toBe('Promotion Expiration Produit');
  });

  it('should not set promotionExpirationActive if "Expiration Produit" is not active', () => {
    component.promotionsAutomatiques = [
      {
        id: 1,
        nom: 'Promotion Expiration Produit',
        pourcentageReduction: 40,
        conditionPromotion: 'EXPIRATION_PRODUIT',
        active: false,
        dateDebut: '2025-04-21T00:00:00.000+00:00',
        dateFin: '2025-04-26T00:00:00.000+00:00',
        produits: []
      },
      {
        id: 2,
        nom: 'Black Friday',
        pourcentageReduction: 50,
        conditionPromotion: 'BLACK_FRIDAY',
        active: false,
        dateDebut: '2025-11-25T00:00:00.000+00:00',
        dateFin: '2025-11-28T00:00:00.000+00:00',
        produits: []
      }
    ];

    component['loadPromotions']();

    expect(component.promotionExpirationActive).toBeNull();
  });

  it('should calculate initial price correctly with reduction', () => {
    component.promotionExpirationActive = {
      id: 1,
      nom: 'Promotion Expiration Produit',
      pourcentageReduction: 40,
      conditionPromotion: 'EXPIRATION_PRODUIT',
      active: true,
      dateDebut: '2025-04-21T00:00:00.000+00:00',
      dateFin: '2025-04-26T00:00:00.000+00:00',
      produits: []
    };

    const produit: Produit = {
      id: 1,
      nom: 'Produit 1',
      prix: 10.8,
      devise: 'TND',
      dateExpiration: '2025-04-22T00:00:00.000+00:00',
      promotions: []
    };

    const prixInitial = component.getPrixInitial(produit);
    expect(prixInitial).toBe(18); // 10.8 / (1 - 0.4) = 18
  });

  it('should return current price if no reduction', () => {
    component.promotionExpirationActive = {
      id: 1,
      nom: 'Promotion Expiration Produit',
      pourcentageReduction: 0, // Pas de réduction
      conditionPromotion: 'EXPIRATION_PRODUIT',
      active: true,
      dateDebut: '2025-04-21T00:00:00.000+00:00',
      dateFin: '2025-04-26T00:00:00.000+00:00',
      produits: []
    };

    const produit: Produit = {
      id: 1,
      nom: 'Produit 1',
      prix: 10.8,
      devise: 'TND',
      dateExpiration: '2025-04-22T00:00:00.000+00:00',
      promotions: []
    };

    const prixInitial = component.getPrixInitial(produit);
    expect(prixInitial).toBe(10.8); // Pas de réduction, prix initial = prix actuel
  });
});