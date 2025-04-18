import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { format } from 'date-fns';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

interface Promotion {
  id: number;
  nom: string;
  pourcentageReduction: number;
  dateDebut: Date | string;
  dateFin: Date | string;
  conditionPromotion: string;
  active: boolean;
  produits?: any[];
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

  private apiUrl = 'http://localhost:8082/promotions';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {}

  addPromotion(): void {
    if (!this.validatePromotion(this.newPromotion)) return;
    this.isLoading = true;
    const { id, ...promotionSansId } = this.newPromotion;
    const payload = {
      ...promotionSansId,
      dateDebut: this.formatDateForInput(promotionSansId.dateDebut),
      dateFin: this.formatDateForInput(promotionSansId.dateFin)
    };
    this.http.post<Promotion>(`${this.apiUrl}/add`, payload, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    }).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(
      () => {
        this.showSuccess('Promotion ajoutée avec succès !');
        this.resetForm();
        setTimeout(() => this.router.navigate(['/promotions/list']), 2000);
      },
      error => this.handleError('Échec de l’ajout de la promotion', error)
    );
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
    if (!promotion.conditionPromotion) {
      this.errorMessage = 'La condition est requise.';
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