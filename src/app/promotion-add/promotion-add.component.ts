import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { format } from 'date-fns';
import { Router } from '@angular/router';
import { Produit } from '../models/produit.interface';
import { Page } from '../models/page.interface';
import { RefreshService } from '../services/refresh.service';

interface Promotion {
    id: number;
    nom: string;
    pourcentageReduction: number;
    dateDebut: Date | string;
    dateFin: Date | string;
    conditionPromotion: string;
    active: boolean;
    produits?: Produit[];
}

@Component({
    selector: 'app-promotion-add',
    templateUrl: './promotion-add.component.html',
    styleUrls: ['./promotion-add.component.css']
})
export class PromotionAddComponent implements OnInit {
    newPromotion: Promotion = {
        id: 0,
        nom: '',
        pourcentageReduction: 0,
        dateDebut: new Date(),
        dateFin: new Date(),
        conditionPromotion: '',
        active: true,
        produits: []
    };
    successMessage: string | null = null;
    errorMessage: string | null = null;
    isLoading = false;
    categories: string[] = ['fruit', 'légumes', 'légumineuse', 'céréale'];
    products: Produit[] = [];
    selectedCategory: string | null = null;
    selectedProductNames: string[] = [];

    private apiUrl = 'http://localhost:8082/promotions';
    private produitsApiUrl = 'http://localhost:8082/api/produits';

    constructor(
        private http: HttpClient,
        private router: Router,
        private refreshService: RefreshService
    ) {}

    ngOnInit(): void {
        this.loadProductsData();
    }

    loadProductsData(): void {
        this.isLoading = true;
        this.http.get<Page<Produit>>(this.produitsApiUrl, { withCredentials: true })
            .subscribe({
                next: (page: Page<Produit>) => {
                    this.products = page.content.map((product: Produit) => ({
                        ...product,
                        devise: 'TND' as 'TND',
                        categorie: this.getCategoryForProduct(product.nom) as 'fruit' | 'légumes' | 'légumineuse' | 'céréale'
                    }));
                    console.log('Produits chargés dynamiquement :', this.products);
                    this.isLoading = false;
                },
                error: (err) => {
                    console.error('Erreur lors du chargement des produits :', err);
                    this.errorMessage = 'Erreur lors du chargement des produits.';
                    this.clearMessages();
                    this.isLoading = false;
                }
            });
    }

    getCategoryForProduct(nom: string): string {
        const categoryMap: { [key: string]: 'fruit' | 'légumes' | 'légumineuse' | 'céréale' } = {
            'Fraise': 'fruit',
            'Pomme': 'fruit',
            'Carotte': 'légumes',
            'Poireau': 'légumes',
            'Haricot': 'légumineuse',
            'Pois Chiche': 'légumineuse',
            'Blé': 'céréale',
            'Riz': 'céréale'
        };
        return categoryMap[nom] || 'fruit';
    }

    onCategoryChange(event: Event): void {
        const target = event.target as HTMLSelectElement;
        this.selectedCategory = target.value || null;
        this.selectedProductNames = [];
        this.updateSelectedProducts();
    }

    onProductsChange(event: Event): void {
        const target = event.target as HTMLSelectElement;
        this.selectedProductNames = Array.from(target.selectedOptions).map(option => option.value);
        this.updateSelectedProducts();
    }

    updateSelectedProducts(): void {
        if (this.selectedCategory) {
            this.newPromotion.produits = this.products.filter(product => product.categorie === this.selectedCategory);
        } else {
            this.newPromotion.produits = this.products.filter(product => this.selectedProductNames.includes(product.nom));
        }
        console.log('Produits sélectionnés pour la promotion :', this.newPromotion.produits);
    }

    addPromotion(): void {
        if (!this.validatePromotion(this.newPromotion)) return;
        this.isLoading = true;

        // Vérification que des produits sont bien associés à la promotion
        console.log('Produits associés à la promotion avant envoi :', this.newPromotion.produits);

        // Préparation de l'objet à envoyer, en s'assurant que les produits sont correctement formatés
        const { id, ...promotionSansId } = this.newPromotion;
        const payload = {
            ...promotionSansId,
            dateDebut: this.formatDateForInput(promotionSansId.dateDebut),
            dateFin: this.formatDateForInput(promotionSansId.dateFin),
            produitIds: this.newPromotion.produits?.map(product => product.id) // Send a list of product IDs
        };

        // Debug : vérification du payload avant envoi
        console.log('Payload envoyé :', payload);

        // Utilisation du service HttpClient pour envoyer la requête POST
        this.http.post(this.apiUrl + '/add', payload, { withCredentials: true })
            .subscribe({
                next: (response) => {
                    console.log('Réponse reçue:', response);
                    this.showSuccess('Promotion ajoutée avec succès !');
                    this.refreshService.notifyPromotionUpdated();
                    this.resetForm();
                    setTimeout(() => this.router.navigate(['/promotions/list']), 2000);
                },
                error: (err) => {
                    console.error('Erreur lors de l\'ajout de la promotion:', err);
                    this.handleError('Échec de l’ajout de la promotion', err);
                }
            });
    }

    resetForm(): void {
        this.newPromotion = {
            id: 0,
            nom: '',
            pourcentageReduction: 0,
            dateDebut: new Date(),
            dateFin: new Date(),
            conditionPromotion: '',
            active: true,
            produits: []
        };
        this.selectedCategory = null;
        this.selectedProductNames = [];
    }

    validatePromotion(promotion: Promotion): boolean {
        if (!promotion.nom.trim()) {
            this.errorMessage = 'Le nom de l’offre est requis.';
            this.clearMessages();
            return false;
        }
        if (promotion.pourcentageReduction < 0 || promotion.pourcentageReduction > 100) {
            this.errorMessage = 'Le pourcentage de réduction doit être entre 0 et 100.';
            this.clearMessages();
            return false;
        }
        if (new Date(promotion.dateDebut) > new Date(promotion.dateFin)) {
            this.errorMessage = 'La date de fin doit être après la date de début.';
            this.clearMessages();
            return false;
        }
        if (!promotion.produits || promotion.produits.length === 0) {
            this.errorMessage = 'Veuillez sélectionner une catégorie ou au moins un produit.';
            this.clearMessages();
            return false;
        }
        return true;
    }

    formatDateForInput(date: Date | string): string {
        return format(new Date(date), 'yyyy-MM-dd');
    }

    get newPromotionStartDate(): string {
        return this.formatDateForInput(this.newPromotion.dateDebut);
    }

    set newPromotionStartDate(value: string) {
        this.newPromotion.dateDebut = new Date(value);
    }

    get newPromotionEndDate(): string {
        return this.formatDateForInput(this.newPromotion.dateFin);
    }

    set newPromotionEndDate(value: string) {
        this.newPromotion.dateFin = new Date(value);
    }

    private showSuccess(message: string): void {
        this.successMessage = message;
        this.clearMessages();
    }

    private handleError(context: string, error: any): void {
        this.errorMessage = `${context}: ${error.message}`;
        this.clearMessages();
    }

    private clearMessages(): void {
        setTimeout(() => {
            this.successMessage = null;
            this.errorMessage = null;
        }, 5000);
    }
}