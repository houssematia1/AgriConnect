import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { format, parse } from 'date-fns';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

// Interface for Promotion data
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

// Interface for promotion statistics
interface PromotionStat {
  promotionId: number;
  promotionName: string;
  usageCount: number;
  totalRevenueImpact: number;
}

// Interface for analytics response
interface AnalyticsResponse {
  promotionStats: PromotionStat[];
  totalPromotionsApplied: number;
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
    id: 0,
    nom: '',
    pourcentageReduction: 0,
    dateDebut: new Date(),
    dateFin: new Date(),
    conditionPromotion: '',
    active: true,
    produits: []
  };
  editMode = false;
  selectedPromotion: Promotion | null = null;
  showingActiveOnly = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  // Objects for template bindings
  promotionAmounts: { [key: number]: number } = {};
  appliedMontants: { [key: number]: number | null } = {};

  // Filter and sort properties
  searchTerm: string = '';
  filterCondition: string = '';
  filterStartDate: string = '';
  filterEndDate: string = '';
  sortColumn: keyof Promotion | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Selected promotion IDs for bulk actions
  selectedPromotionIds: Set<number> = new Set<number>();

  // Chart data for analytics
  promotionStats: PromotionStat[] = [];
  totalPromotionsApplied: number = 0;
  barChartLabels: string[] = [];
  barChartData: any[] = [
    { data: [], label: 'Usage Count', backgroundColor: 'rgba(75, 192, 192, 0.5)', borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 1 },
    { data: [], label: 'Revenue Impact', backgroundColor: 'rgba(255, 99, 132, 0.5)', borderColor: 'rgba(255, 99, 132, 1)', borderWidth: 1 }
  ];
  barChartOptions = {
    responsive: true,
    scales: { y: { beginAtZero: true } }
  };

  private apiUrl = 'http://localhost:8082/promotions';

  constructor(
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    console.log('PromotionListComponent initialized');
    this.loadPromotions();
    this.filteredPromotions = this.promotions;
    this.loadAnalytics();
  }

  loadPromotions(): void {
    console.log('loadPromotions called');
    this.getPromotions().subscribe(
      data => {
        console.log('Promotions loaded successfully:', data);
        this.promotions = data.map(promo => ({
          ...promo,
          id: Number(promo.id),
          dateDebut: new Date(promo.dateDebut),
          dateFin: new Date(promo.dateFin)
        }));
        this.promotions.forEach(promo => {
          console.log(`Promotion ID: ${promo.id}, Type: ${typeof promo.id}, Data:`, promo);
        });
        this.showingActiveOnly = false;
        this.applyFilters();
        this.loadAnalytics();
      },
      error => {
        console.error('Error loading promotions:', error);
        this.errorMessage = `Failed to load promotions. Status: ${error.status}, Details: ${error.error?.error || error.message}`;
        this.clearMessages();
      }
    );
  }

  private showSuccess(message: string): void {
    this.successMessage = message;
    this.clearMessages();
  }

  private handleError(context: string, error: any): void {
    console.error(`${context}:`, error);
    this.errorMessage = `${context}: ${error.error?.message || error.message}`;
    this.clearMessages();
  }

  getPromotions(): Observable<Promotion[]> {
    console.log('getPromotions called');
    return this.http.get<Promotion[]>(this.apiUrl, { withCredentials: true });
  }

  getActivePromotions(): void {
    console.log('getActivePromotions called');
    this.http.get<Promotion[]>(`${this.apiUrl}/actives`).subscribe(
      data => {
        console.log('Active promotions loaded successfully:', data);
        this.promotions = data.map(promo => ({
          ...promo,
          id: Number(promo.id),
          dateDebut: new Date(promo.dateDebut),
          dateFin: new Date(promo.dateFin)
        }));
        this.promotions.forEach(promo => {
          console.log(`Active Promotion ID: ${promo.id}, Type: ${typeof promo.id}, Data:`, promo);
        });
        this.showingActiveOnly = true;
        this.applyFilters();
      },
      error => {
        console.error('Error loading active promotions:', error);
        this.errorMessage = `Failed to load active promotions. Status: ${error.status}, Details: ${error.error?.error || error.message}`;
        this.clearMessages();
      }
    );
  }

  addPromotion(): void {
    const { id, ...promotionSansId } = this.newPromotion;
    const payload = {
      ...promotionSansId,
      dateDebut: this.formatDateForInput(promotionSansId.dateDebut),
      dateFin: this.formatDateForInput(promotionSansId.dateFin)
    };
    this.http.post<Promotion>(`${this.apiUrl}/add`, payload, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    }).subscribe(
      promotion => {
        console.log('Add response:', promotion);
        promotion.id = Number(promotion.id);
        promotion.dateDebut = new Date(promotion.dateDebut);
        promotion.dateFin = new Date(promotion.dateFin);
        this.promotions.push(promotion);
        this.resetForm();
        this.applyFilters();
        this.successMessage = 'Promotion added successfully!';
        this.clearMessages();
      },
      error => {
        console.error('Error adding promotion:', error);
        this.errorMessage = this.extractErrorMessage(error);
        this.clearMessages();
      }
    );
  }

  private extractErrorMessage(error: any): string {
    if (error.error?.message) {
      return error.error.message;
    }
    return `Failed to add promotion. Status: ${error.status}`;
  }

  editPromotion(promotion: Promotion): void {
    console.log('editPromotion called with promotion:', promotion);
    this.editMode = true;
    this.selectedPromotion = { ...promotion, id: Number(promotion.id) };
  }

  updatePromotion(): void {
    if (!this.selectedPromotion || !this.validatePromotion(this.selectedPromotion)) {
      return;
    }
    const id = this.selectedPromotion.id;
    console.log('updatePromotion called with ID:', id, 'and data:', this.selectedPromotion);
    if (!this.isValidId(id)) {
      this.errorMessage = 'Invalid promotion ID.';
      this.clearMessages();
      return;
    }
    const payload = {
      ...this.selectedPromotion,
      dateDebut: this.formatDateForInput(this.selectedPromotion.dateDebut),
      dateFin: this.formatDateForInput(this.selectedPromotion.dateFin)
    };
    this.http.put<Promotion>(`${this.apiUrl}/${id}`, payload).subscribe(
      updatedPromotion => {
        console.log('Update response:', updatedPromotion);
        updatedPromotion.id = Number(updatedPromotion.id);
        updatedPromotion.dateDebut = new Date(updatedPromotion.dateDebut);
        updatedPromotion.dateFin = new Date(updatedPromotion.dateFin);
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
        console.error('Error updating promotion:', error);
        this.errorMessage = `Failed to update promotion. Status: ${error.status}, Message: ${error.error?.error || error.message}`;
        this.clearMessages();
      }
    );
  }

  deletePromotion(id: number): void {
    console.log('deletePromotion called with ID:', id);
    if (!this.isValidId(id)) {
      this.errorMessage = 'Invalid promotion ID.';
      this.clearMessages();
      return;
    }
    const promotion = this.promotions.find(p => p.id === id);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { 
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete "${promotion?.nom}"?`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.delete(`${this.apiUrl}/${id}`).subscribe(
          () => {
            console.log('Promotion deleted successfully, ID:', id);
            this.promotions = this.promotions.filter(p => p.id !== id);
            this.applyFilters();
            this.successMessage = 'Promotion deleted successfully!';
            this.clearMessages();
          },
          error => {
            console.error('Error deleting promotion:', error);
            this.errorMessage = `Failed to delete promotion. Status: ${error.status}, Message: ${error.error?.error || error.message}`;
            this.clearMessages();
          }
        );
      }
    });
  }

  applyPromotion(id: number): void {
    console.log('applyPromotion called with ID:', id);
    if (!this.isValidId(id)) {
      this.errorMessage = 'Invalid promotion ID.';
      this.clearMessages();
      return;
    }
    const montant = this.promotionAmounts[id] || 0;
    if (montant <= 0) {
      this.errorMessage = `Amount for promotion ID ${id} must be greater than 0.`;
      this.clearMessages();
      return;
    }
    this.http.get<number>(`${this.apiUrl}/appliquer/${id}/${montant}`).subscribe(
      newMontant => {
        console.log('Promotion applied successfully, new montant:', newMontant);
        this.appliedMontants[id] = newMontant;
        this.successMessage = `Promotion ID ${id} applied successfully!`;
        this.loadAnalytics();
        this.clearMessages();
      },
      error => {
        console.error('Error applying promotion:', error);
        this.errorMessage = `Failed to apply promotion ID ${id}. Status: ${error.status}, Message: ${error.error?.error || error.message}`;
        this.clearMessages();
      }
    );
  }

  applyExpirationPromotion(): void {
    console.log('applyExpirationPromotion called');
    this.http.post(`${this.apiUrl}/appliquer-expiration`, {}).subscribe(
      () => {
        console.log('Expiration promotion applied successfully');
        this.loadPromotions();
        this.successMessage = 'Expiration promotions applied successfully!';
        this.clearMessages();
      },
      error => {
        console.error('Error applying expiration promotion:', error);
        this.errorMessage = `Failed to apply expiration promotions. Status: ${error.status}, Message: ${error.error?.error || error.message}`;
        this.clearMessages();
      }
    );
  }

  cancelEdit(): void {
    console.log('cancelEdit called');
    this.editMode = false;
    this.selectedPromotion = null;
  }

  resetForm(): void {
    console.log('resetForm called');
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

  clearMessages(): void {
    setTimeout(() => {
      this.successMessage = null;
      this.errorMessage = null;
    }, 3000);
  }

  applyFilters(): void {
    console.log('applyFilters called with searchTerm:', this.searchTerm, 'filterCondition:', this.filterCondition, 'filterStartDate:', this.filterStartDate, 'filterEndDate:', this.filterEndDate);
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
    console.log('Filtered promotions:', this.filteredPromotions);
    if (this.sortColumn) {
      this.sortPromotions(this.sortColumn);
    }
  }

  clearFilters(): void {
    console.log('clearFilters called');
    this.searchTerm = '';
    this.filterCondition = '';
    this.filterStartDate = '';
    this.filterEndDate = '';
    this.applyFilters();
  }

  sortPromotions(column: keyof Promotion): void {
    console.log('sortPromotions called with column:', column);
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.filteredPromotions.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];
      if ((valueA instanceof Date || typeof valueA === 'string') && (valueB instanceof Date || typeof valueB === 'string')) {
        const dateA = new Date(valueA);
        const dateB = new Date(valueB);
        return this.sortDirection === 'asc'
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
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
    console.log('Sorted filtered promotions:', this.filteredPromotions);
  }

  toggleSelection(id: number): void {
    console.log('toggleSelection called with ID:', id);
    if (!this.isValidId(id)) {
      this.errorMessage = 'Invalid promotion ID in selection.';
      this.clearMessages();
      return;
    }
    if (this.selectedPromotionIds.has(id)) {
      this.selectedPromotionIds.delete(id);
    } else {
      this.selectedPromotionIds.add(id);
    }
    console.log('Selected promotion IDs:', Array.from(this.selectedPromotionIds));
  }

  selectAll(): void {
    console.log('selectAll called');
    this.filteredPromotions.forEach(promotion => {
      if (this.isValidId(promotion.id)) {
        this.selectedPromotionIds.add(promotion.id);
      }
    });
    console.log('Selected promotion IDs after selectAll:', Array.from(this.selectedPromotionIds));
  }

  deselectAll(): void {
    console.log('deselectAll called');
    this.selectedPromotionIds.clear();
    console.log('Selected promotion IDs after deselectAll:', Array.from(this.selectedPromotionIds));
  }

  bulkActivate(): void {
    const ids = Array.from(this.selectedPromotionIds);
    console.log('bulkActivate called with IDs:', ids);
    if (ids.length === 0) return;
    if (!ids.every(id => this.isValidId(id))) {
      this.errorMessage = 'One or more selected promotion IDs are invalid.';
      this.clearMessages();
      return;
    }
    this.http.post(`${this.apiUrl}/bulk-activate`, ids).subscribe(
      () => {
        console.log('Bulk activate successful for IDs:', ids);
        this.loadPromotions();
        this.selectedPromotionIds.clear();
        this.successMessage = 'Selected promotions activated successfully!';
        this.clearMessages();
      },
      error => {
        console.error('Error activating promotions:', error);
        this.errorMessage = `Failed to activate selected promotions. Status: ${error.status}, Message: ${error.error?.error || error.message}`;
        this.clearMessages();
      }
    );
  }

  bulkDeactivate(): void {
    const ids = Array.from(this.selectedPromotionIds);
    console.log('bulkDeactivate called with IDs:', ids);
    if (ids.length === 0) return;
    if (!ids.every(id => this.isValidId(id))) {
      this.errorMessage = 'One or more selected promotion IDs are invalid.';
      this.clearMessages();
      return;
    }
    this.http.post(`${this.apiUrl}/bulk-deactivate`, ids).subscribe(
      () => {
        console.log('Bulk deactivate successful for IDs:', ids);
        this.loadPromotions();
        this.selectedPromotionIds.clear();
        this.successMessage = 'Selected promotions deactivated successfully!';
        this.clearMessages();
      },
      error => {
        console.error('Error deactivating promotions:', error);
        this.errorMessage = `Failed to deactivate selected promotions. Status: ${error.status}, Message: ${error.error?.error || error.message}`;
        this.clearMessages();
      }
    );
  }

  bulkDelete(): void {
    const ids = Array.from(this.selectedPromotionIds);
    if (ids.length === 0) return;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { 
        title: 'Confirm Bulk Deletion',
        message: `You're about to delete ${ids.length} promotions.`,
        warning: 'This action is irreversible!'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.post(`${this.apiUrl}/bulk-delete`, ids).subscribe({
          next: () => {
            this.promotions = this.promotions.filter(p => !this.selectedPromotionIds.has(p.id));
            this.applyFilters();
            this.selectedPromotionIds.clear();
            this.showSuccess(`${ids.length} promotions deleted!`);
          },
          error: error => this.handleError('Bulk deletion failed', error)
        });
      }
    });
  }

  exportPromotionsToCSV(): void {
    console.log('exportPromotionsToCSV called');
    const headers = ['ID', 'Name', 'Discount (%)', 'Start Date', 'End Date', 'Condition', 'Active'];
    const csvRows = [headers.join(',')];
    for (const promotion of this.promotions) {
      const row = [
        promotion.id,
        `"${promotion.nom}"`,
        promotion.pourcentageReduction,
        format(new Date(promotion.dateDebut), 'yyyy-MM-dd'),
        format(new Date(promotion.dateFin), 'yyyy-MM-dd'),
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

  validatePromotion(promotion: Promotion): boolean {
    console.log('validatePromotion called with promotion:', promotion);
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
    if (new Date(promotion.dateDebut) > new Date(promotion.dateFin)) {
      this.errorMessage = 'End date must be after start date.';
      this.clearMessages();
      return false;
    }
    if (!promotion.conditionPromotion) {
      this.errorMessage = 'Condition is required.';
      this.clearMessages();
      return false;
    }
    return true;
  }

  formatDateForInput(date: Date | string): string {
    return format(new Date(date), 'yyyy-MM-dd');
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

  loadAnalytics(): void {
    console.log('loadAnalytics called');
    this.http.get<AnalyticsResponse>(`${this.apiUrl}/analytics`).subscribe(
      data => {
        console.log('Analytics loaded successfully:', data);
        this.promotionStats = (data.promotionStats || []).map((stat: PromotionStat) => ({
          ...stat,
          promotionId: Number(stat.promotionId)
        }));
        this.totalPromotionsApplied = data.totalPromotionsApplied || 0;
        this.barChartLabels = this.promotionStats.map(stat => stat.promotionName);
        this.barChartData[0].data = this.promotionStats.map(stat => stat.usageCount);
        this.barChartData[1].data = this.promotionStats.map(stat => stat.totalRevenueImpact);
      },
      error => {
        console.error('Error loading analytics:', error);
        this.errorMessage = `Failed to load analytics data. Status: ${error.status}, Message: ${error.error?.error || error.message}`;
        this.clearMessages();
      }
    );
  }

  isAISuggested(promotion: Promotion): boolean {
    console.log('isAISuggested called for promotion:', promotion.nom);
    return promotion.nom.startsWith('AI Suggested Promotion for ');
  }

  acceptAISuggestion(id: number): void {
    console.log('acceptAISuggestion called with ID:', id);
    if (!this.isValidId(id)) {
      this.errorMessage = 'Invalid promotion ID.';
      this.clearMessages();
      return;
    }
    this.http.put<Promotion>(`${this.apiUrl}/${id}`, { ...this.promotions.find(p => p.id === id), active: true }).subscribe(
      updatedPromotion => {
        console.log('AI suggestion accepted, updated promotion:', updatedPromotion);
        updatedPromotion.id = Number(updatedPromotion.id);
        updatedPromotion.dateDebut = new Date(updatedPromotion.dateDebut);
        updatedPromotion.dateFin = new Date(updatedPromotion.dateFin);
        const index = this.promotions.findIndex(p => p.id === updatedPromotion.id);
        if (index !== -1) {
          this.promotions[index] = updatedPromotion;
        }
        this.applyFilters();
        this.successMessage = 'AI-suggested promotion accepted!';
        this.clearMessages();
      },
      error => {
        console.error('Error accepting AI suggestion:', error);
        this.errorMessage = `Failed to accept AI suggestion. Status: ${error.status}, Message: ${error.error?.error || error.message}`;
        this.clearMessages();
      }
    );
  }

  rejectAISuggestion(id: number): void {
    console.log('rejectAISuggestion called with ID:', id);
    const promotion = this.promotions.find(p => p.id === id);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { 
        title: 'Confirm Rejection',
        message: `Are you sure you want to reject AI suggestion "${promotion?.nom}"?`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (!this.isValidId(id)) {
          this.errorMessage = 'Invalid promotion ID.';
          this.clearMessages();
          return;
        }
        this.http.delete(`${this.apiUrl}/${id}`).subscribe(
          () => {
            console.log('AI suggestion rejected, ID:', id);
            this.promotions = this.promotions.filter(p => p.id !== id);
            this.applyFilters();
            this.successMessage = 'AI-suggested promotion rejected!';
            this.clearMessages();
          },
          error => {
            console.error('Error rejecting AI suggestion:', error);
            this.errorMessage = `Failed to reject AI suggestion. Status: ${error.status}, Message: ${error.error?.error || error.message}`;
            this.clearMessages();
          }
        );
      }
    });
  }

  private isValidId(id: number): boolean {
    const isValid = !isNaN(id) && id > 0;
    console.log(`isValidId called with ID: ${id}, Result: ${isValid}`);
    return isValid;
  }
}