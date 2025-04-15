import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Promotion {
  id?: number;
  nom: string;
  pourcentageReduction: number;
  dateDebut: Date;
  dateFin: Date;
  conditionPromotion: string;
  active: boolean;
}

@Component({
  selector: 'app-promotion-list',
  templateUrl: './promotion-list.component.html',
  styleUrls: ['./promotion-list.component.css']
})
export class PromotionListComponent implements OnInit {
  promotions: Promotion[] = [];
  newPromotion: Promotion = {
    nom: '',
    pourcentageReduction: 0,
    dateDebut: new Date(),
    dateFin: new Date(),
    conditionPromotion: '',
    active: true
  };
  editMode = false;
  selectedPromotion: Promotion | null = null;
  montant: number = 0;
  appliedMontant: number | null = null;
  showingActiveOnly = false;
  successMessage: string | null = null; // New property for success message
  errorMessage: string | null = null;   // New property for error message

  private apiUrl = 'http://localhost:8082/promotions';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPromotions();
  }

  loadPromotions(): void {
    this.getPromotions().subscribe(data => {
      this.promotions = data;
      this.showingActiveOnly = false;
    });
  }

  getPromotions(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(this.apiUrl);
  }

  getActivePromotions(): void {
    this.http.get<Promotion[]>(`${this.apiUrl}/actives`).subscribe(data => {
      this.promotions = data;
      this.showingActiveOnly = true;
    });
  }

  addPromotion(): void {
    this.http.post<Promotion>(`${this.apiUrl}/add`, this.newPromotion).subscribe(
      (promotion) => {
        this.promotions.push(promotion);
        this.resetForm();
        this.successMessage = 'Promotion added successfully!';
        this.clearMessages();
      },
      (error) => {
        this.errorMessage = 'Failed to add promotion. Please try again.';
        console.error('Error adding promotion:', error);
        this.clearMessages();
      }
    );
  }

  editPromotion(promotion: Promotion): void {
    this.editMode = true;
    this.selectedPromotion = { ...promotion };
  }

  updatePromotion(): void {
    if (this.selectedPromotion) {
      this.http.put<Promotion>(`${this.apiUrl}/${this.selectedPromotion.id}`, this.selectedPromotion).subscribe(
        (updatedPromotion) => {
          const index = this.promotions.findIndex(p => p.id === updatedPromotion.id);
          if (index !== -1) {
            this.promotions[index] = updatedPromotion;
          }
          this.cancelEdit();
          this.successMessage = 'Promotion updated successfully!';
          this.clearMessages();
        },
        (error) => {
          this.errorMessage = 'Failed to update promotion. Please try again.';
          console.error('Error updating promotion:', error);
          this.clearMessages();
        }
      );
    }
  }

  deletePromotion(id?: number): void {
    if (id) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(
        () => {
          this.promotions = this.promotions.filter(p => p.id !== id);
          this.successMessage = 'Promotion deleted successfully!';
          this.clearMessages();
        },
        (error) => {
          this.errorMessage = 'Failed to delete promotion. Please try again.';
          console.error('Error deleting promotion:', error);
          this.clearMessages();
        }
      );
    }
  }

  applyPromotion(id?: number): void {
    if (id && this.montant > 0) {
      this.http.get<number>(`${this.apiUrl}/appliquer/${id}/${this.montant}`).subscribe(
        (newMontant) => {
          this.appliedMontant = newMontant;
          this.successMessage = 'Promotion applied successfully!';
          this.clearMessages();
        },
        (error) => {
          this.errorMessage = 'Failed to apply promotion. Please try again.';
          console.error('Error applying promotion:', error);
          this.clearMessages();
        }
      );
    }
  }

  applyExpirationPromotion(): void {
    this.http.post(`${this.apiUrl}/appliquer-expiration`, {}).subscribe(
      () => {
        this.loadPromotions();
        this.successMessage = 'Expiration promotions applied successfully!';
        this.clearMessages();
      },
      (error) => {
        this.errorMessage = 'Failed to apply expiration promotions. Please try again.';
        console.error('Error applying expiration promotion:', error);
        this.clearMessages();
      }
    );
  }

  cancelEdit(): void {
    this.editMode = false;
    this.selectedPromotion = null;
  }

  resetForm(): void {
    this.newPromotion = {
      nom: '',
      pourcentageReduction: 0,
      dateDebut: new Date(),
      dateFin: new Date(),
      conditionPromotion: '',
      active: true
    };
  }

  clearMessages(): void {
    setTimeout(() => {
      this.successMessage = null;
      this.errorMessage = null;
    }, 3000); // Clear messages after 3 seconds
  }
}