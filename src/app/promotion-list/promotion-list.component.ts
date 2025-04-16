import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { format, parse } from 'date-fns';

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
  filteredPromotions: Promotion[] = [];
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
  successMessage: string | null = null;
  errorMessage: string | null = null;

  // Search and filter properties
  searchTerm: string = '';
  filterCondition: string = '';
  filterStartDate: string = '';
  filterEndDate: string = '';

  // Sorting properties
  sortColumn: keyof Promotion | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Bulk selection properties
  selectedPromotionIds: Set<number> = new Set<number>();

  private apiUrl = 'http://localhost:8082/promotions';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPromotions();
    this.filteredPromotions = this.promotions;
  }

  loadPromotions(): void {
    this.getPromotions().subscribe(
      data => {
        this.promotions = data;
        this.showingActiveOnly = false;
        this.applyFilters();
      },
      error => {
        this.errorMessage = 'Failed to load promotions. Please try again.';
        console.error('Error loading promotions:', error);
        this.clearMessages();
      }
    );
  }

  getPromotions(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(this.apiUrl);
  }

  getActivePromotions(): void {
    this.http.get<Promotion[]>(`${this.apiUrl}/actives`).subscribe(
      data => {
        this.promotions = data;
        this.showingActiveOnly = true;
        this.applyFilters();
      },
      error => {
        this.errorMessage = 'Failed to load active promotions. Please try again.';
        console.error('Error loading active promotions:', error);
        this.clearMessages();
      }
    );
  }

  addPromotion(): void {
    if (!this.validatePromotion(this.newPromotion)) {
      return;
    }
    this.http.post<Promotion>(`${this.apiUrl}/add`, this.newPromotion).subscribe(
      promotion => {
        this.promotions.push(promotion);
        this.resetForm();
        this.applyFilters();
        this.successMessage = 'Promotion added successfully!';
        this.clearMessages();
      },
      error => {
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
    if (!this.selectedPromotion || !this.validatePromotion(this.selectedPromotion)) {
      return;
    }
    this.http.put<Promotion>(`${this.apiUrl}/${this.selectedPromotion.id}`, this.selectedPromotion).subscribe(
      updatedPromotion => {
        const index = this.promotions.findIndex(p => p.id === updatedPromotion.id);
        if (index !== -1) {
          this.promotions[index] = updatedPromotion;
        }
        this.cancelEdit();
        this.applyFilters();
        this.successMessage = 'Promotion updated successfully!';
        this.clearMessages();
      },
      error => {
        this.errorMessage = 'Failed to update promotion. Please try again.';
        console.error('Error updating promotion:', error);
        this.clearMessages();
      }
    );
  }

  deletePromotion(id?: number): void {
    if (id) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(
        () => {
          this.promotions = this.promotions.filter(p => p.id !== id);
          this.applyFilters();
          this.successMessage = 'Promotion deleted successfully!';
          this.clearMessages();
        },
        error => {
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
        newMontant => {
          this.appliedMontant = newMontant;
          this.successMessage = 'Promotion applied successfully!';
          this.clearMessages();
        },
        error => {
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
      error => {
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
    }, 3000);
  }

  // Search and Filter Methods
  applyFilters(): void {
    let filtered = [...this.promotions];

    if (this.searchTerm.trim()) {
      filtered = filtered.filter(promotion =>
        promotion.nom.toLowerCase().includes(this.searchTerm.trim().toLowerCase())
      );
    }

    if (this.filterCondition) {
      filtered = filtered.filter(promotion => promotion.conditionPromotion === this.filterCondition);
    }

    if (this.filterStartDate) {
      const startDate = parse(this.filterStartDate, 'yyyy-MM-dd', new Date());
      filtered = filtered.filter(promotion => new Date(promotion.dateDebut) >= startDate);
    }

    if (this.filterEndDate) {
      const endDate = parse(this.filterEndDate, 'yyyy-MM-dd', new Date());
      filtered = filtered.filter(promotion => new Date(promotion.dateFin) <= endDate);
    }

    this.filteredPromotions = filtered;

    if (this.sortColumn) {
      this.sortPromotions(this.sortColumn);
    }
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterCondition = '';
    this.filterStartDate = '';
    this.filterEndDate = '';
    this.applyFilters();
  }

  // Sorting Methods
  sortPromotions(column: keyof Promotion): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredPromotions.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (valueA instanceof Date && valueB instanceof Date) {
        return this.sortDirection === 'asc'
          ? valueA.getTime() - valueB.getTime()
          : valueB.getTime() - valueA.getTime();
      }

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return this.sortDirection === 'asc'
          ? valueA - valueB
          : valueB - valueA;
      }

      return 0;
    });
  }

  // Bulk Action Methods
  toggleSelection(id: number): void {
    if (this.selectedPromotionIds.has(id)) {
      this.selectedPromotionIds.delete(id);
    } else {
      this.selectedPromotionIds.add(id);
    }
  }

  selectAll(): void {
    this.filteredPromotions.forEach(promotion => {
      if (promotion.id) {
        this.selectedPromotionIds.add(promotion.id);
      }
    });
  }

  deselectAll(): void {
    this.selectedPromotionIds.clear();
  }

  bulkActivate(): void {
    const ids = Array.from(this.selectedPromotionIds);
    if (ids.length === 0) return;

    this.http.post(`${this.apiUrl}/bulk-activate`, ids).subscribe(
      () => {
        this.loadPromotions();
        this.selectedPromotionIds.clear();
        this.successMessage = 'Selected promotions activated successfully!';
        this.clearMessages();
      },
      error => {
        this.errorMessage = 'Failed to activate selected promotions. Please try again.';
        console.error('Error activating promotions:', error);
        this.clearMessages();
      }
    );
  }

  bulkDeactivate(): void {
    const ids = Array.from(this.selectedPromotionIds);
    if (ids.length === 0) return;

    this.http.post(`${this.apiUrl}/bulk-deactivate`, ids).subscribe(
      () => {
        this.loadPromotions();
        this.selectedPromotionIds.clear();
        this.successMessage = 'Selected promotions deactivated successfully!';
        this.clearMessages();
      },
      error => {
        this.errorMessage = 'Failed to deactivate selected promotions. Please try again.';
        console.error('Error deactivating promotions:', error);
        this.clearMessages();
      }
    );
  }

  bulkDelete(): void {
    const ids = Array.from(this.selectedPromotionIds);
    if (ids.length === 0) return;

    this.http.post(`${this.apiUrl}/bulk-delete`, ids).subscribe(
      () => {
        this.promotions = this.promotions.filter(promotion => 
          !(promotion.id && this.selectedPromotionIds.has(promotion.id))
        );
        this.applyFilters();
        this.selectedPromotionIds.clear();
        this.successMessage = 'Selected promotions deleted successfully!';
        this.clearMessages();
      },
      error => {
        this.errorMessage = 'Failed to delete selected promotions. Please try again.';
        console.error('Error deleting promotions:', error);
        this.clearMessages();
      }
    );
  }

  // Export to CSV Method
  exportPromotionsToCSV(): void {
    const headers = ['ID', 'Name', 'Discount (%)', 'Start Date', 'End Date', 'Condition', 'Active'];
    const csvRows = [headers.join(',')];

    for (const promotion of this.promotions) {
      const row = [
        promotion.id,
        `"${promotion.nom}"`,
        promotion.pourcentageReduction,
        format(promotion.dateDebut, 'yyyy-MM-dd'),
        format(promotion.dateFin, 'yyyy-MM-dd'),
        promotion.conditionPromotion,
        promotion.active ? 'Yes' : 'No'
      ];
      csvRows.push(row.join(','));
    }

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'promotions.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  // Validation Method
  validatePromotion(promotion: Promotion): boolean {
    if (!promotion.nom.trim()) {
      this.errorMessage = 'Offer name is required.';
      this.clearMessages();
      return false;
    }

    if (promotion.pourcentageReduction < 0 || promotion.pourcentageReduction > 100) {
      this.errorMessage = 'Discount percentage must be between 0 and 100.';
      this.clearMessages();
      return false;
    }

    if (promotion.dateDebut > promotion.dateFin) {
      this.errorMessage = 'End date must be after start date.';
      this.clearMessages();
      return false;
    }

    return true;
  }

  // Date conversion methods for input binding
  formatDateForInput(date: Date): string {
    return format(date, 'yyyy-MM-dd');
  }

  parseDateFromInput(dateString: string): Date {
    return parse(dateString, 'yyyy-MM-dd', new Date());
  }

  get newPromotionStartDate(): string {
    return this.formatDateForInput(this.newPromotion.dateDebut);
  }

  set newPromotionStartDate(value: string) {
    this.newPromotion.dateDebut = this.parseDateFromInput(value);
  }

  get newPromotionEndDate(): string {
    return this.formatDateForInput(this.newPromotion.dateFin);
  }

  set newPromotionEndDate(value: string) {
    this.newPromotion.dateFin = this.parseDateFromInput(value);
  }

  get selectedPromotionStartDate(): string {
    return this.selectedPromotion ? this.formatDateForInput(this.selectedPromotion.dateDebut) : '';
  }

  set selectedPromotionStartDate(value: string) {
    if (this.selectedPromotion) {
      this.selectedPromotion.dateDebut = this.parseDateFromInput(value);
    }
  }

  get selectedPromotionEndDate(): string {
    return this.selectedPromotion ? this.formatDateForInput(this.selectedPromotion.dateFin) : '';
  }

  set selectedPromotionEndDate(value: string) {
    if (this.selectedPromotion) {
      this.selectedPromotion.dateFin = this.parseDateFromInput(value);
    }
  }
}