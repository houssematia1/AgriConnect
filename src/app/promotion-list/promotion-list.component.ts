import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { format, parse } from 'date-fns';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { PromotionUpdateService } from '../services/promotion/promotion-update.service';

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
  selector: 'app-promotion-list',
  templateUrl: './promotion-list.component.html',
  styleUrls: ['./promotion-list.component.css']
})
export class PromotionListComponent implements OnInit {
  promotions: Promotion[] = [];
  filteredPromotions: Promotion[] = [];
  paginatedPromotions: Promotion[] = [];
  editMode = false;
  selectedPromotion: Promotion | null = null;
  showingActiveOnly = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoading = false;

  promotionAmounts: { [key: number]: number } = {};
  appliedMontants: { [key: number]: number | null } = {};

  searchTerm = '';
  filterCondition = '';
  filterStartDate = '';
  filterEndDate = '';
  sortColumn: keyof Promotion | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  selectedPromotionIds: Set<number> = new Set<number>();

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  private apiUrl = 'http://localhost:8082/promotions';

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private promotionUpdateService: PromotionUpdateService
  ) {}

  ngOnInit(): void {
    this.loadPromotions();
  }

  loadPromotions(): void {
    this.isLoading = true;
    this.getPromotions().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(
      data => {
        this.promotions = data.map(promo => ({
          ...promo,
          id: Number(promo.id),
          dateDebut: new Date(promo.dateDebut),
          dateFin: new Date(promo.dateFin)
        }));
        this.showingActiveOnly = false;
        this.applyFilters();
      },
      error => {
        this.errorMessage = `Échec du chargement des promotions: ${error.message}`;
        this.clearMessages();
      }
    );
  }

  private showSuccess(message: string): void {
    this.successMessage = message;
    this.clearMessages();
  }

  private handleError(context: string, error: any): void {
    this.errorMessage = `${context}: ${error.message}`;
    this.clearMessages();
  }

  getPromotions(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(this.apiUrl, { withCredentials: true });
  }

  getActivePromotions(): void {
    this.isLoading = true;
    this.http.get<Promotion[]>(`${this.apiUrl}/actives`).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(
      data => {
        this.promotions = data.map(promo => ({
          ...promo,
          id: Number(promo.id),
          dateDebut: new Date(promo.dateDebut),
          dateFin: new Date(promo.dateFin)
        }));
        this.showingActiveOnly = true;
        this.applyFilters();
      },
      error => {
        this.errorMessage = `Échec du chargement des promotions actives: ${error.message}`;
        this.clearMessages();
      }
    );
  }

  editPromotion(promotion: Promotion): void {
    this.editMode = true;
    this.selectedPromotion = { ...promotion, id: Number(promotion.id) };
  }

  updatePromotion(): void {
    if (!this.selectedPromotion || !this.validatePromotion(this.selectedPromotion)) return;
    this.isLoading = true;
    const id = this.selectedPromotion.id;
    const payload = {
      ...this.selectedPromotion,
      dateDebut: this.formatDateForInput(this.selectedPromotion.dateDebut),
      dateFin: this.formatDateForInput(this.selectedPromotion.dateFin)
    };
    this.http.put<Promotion>(`${this.apiUrl}/${id}`, payload).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(
      updatedPromotion => {
        updatedPromotion.id = Number(updatedPromotion.id);
        updatedPromotion.dateDebut = new Date(updatedPromotion.dateDebut);
        updatedPromotion.dateFin = new Date(updatedPromotion.dateFin);
        const index = this.promotions.findIndex(p => p.id === updatedPromotion.id);
        if (index !== -1) {
          this.promotions[index] = updatedPromotion;
        }
        this.cancelEdit();
        this.applyFilters();
        this.showSuccess('Promotion mise à jour avec succès !');
        this.promotionUpdateService.notifyUpdates(); // Notification
      },
      error => this.handleError('Échec de la mise à jour de la promotion', error)
    );
  }
  deletePromotion(id: number): void {
    if (!this.isValidId(id)) {
      this.errorMessage = 'ID de promotion invalide.';
      this.clearMessages();
      return;
    }
    const promotion = this.promotions.find(p => p.id === id);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmer la suppression',
        message: `Voulez-vous vraiment supprimer "${promotion?.nom}" ?`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.http.delete(`${this.apiUrl}/${id}`).pipe(
          finalize(() => this.isLoading = false)
        ).subscribe(
          () => {
            this.promotions = this.promotions.filter(p => p.id !== id);
            this.applyFilters();
            this.showSuccess('Promotion supprimée avec succès !');
            this.promotionUpdateService.notifyUpdates(); // Notification
          },
          error => this.handleError('Échec de la suppression de la promotion', error)
        );
      }
    });
  }

  applyPromotion(id: number): void {
    if (!this.isValidId(id)) {
      this.errorMessage = 'ID de promotion invalide.';
      this.clearMessages();
      return;
    }
    const montant = this.promotionAmounts[id] || 0;
    if (montant <= 0) {
      this.errorMessage = `Le montant pour la promotion ID ${id} doit être supérieur à 0.`;
      this.clearMessages();
      return;
    }
    this.isLoading = true;
    this.http.get<number>(`${this.apiUrl}/appliquer/${id}/${montant}`).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(
      newMontant => {
        this.appliedMontants[id] = newMontant;
        this.showSuccess(`Promotion ID ${id} appliquée avec succès !`);
      },
      error => this.handleError(`Échec de l’application de la promotion ID ${id}`, error)
    );
  }

  applyExpirationPromotion(): void {
    this.isLoading = true;
    this.http.post(`${this.apiUrl}/appliquer-expiration`, {}).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(
      () => {
        this.loadPromotions();
        this.showSuccess('Promotions expirées appliquées avec succès !');
      },
      error => this.handleError('Échec de l’application des promotions expirées', error)
    );
  }

  cancelEdit(): void {
    this.editMode = false;
    this.selectedPromotion = null;
  }

  clearMessages(): void {
    setTimeout(() => {
      this.successMessage = null;
      this.errorMessage = null;
    }, 5000);
  }

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
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredPromotions.length / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedPromotions = this.filteredPromotions.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterCondition = '';
    this.filterStartDate = '';
    this.filterEndDate = '';
    this.currentPage = 1;
    this.applyFilters();
  }

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
    this.updatePagination();
  }

  toggleSelection(id: number): void {
    if (!this.isValidId(id)) {
      this.errorMessage = 'ID de promotion invalide dans la sélection.';
      this.clearMessages();
      return;
    }
    if (this.selectedPromotionIds.has(id)) {
      this.selectedPromotionIds.delete(id);
    } else {
      this.selectedPromotionIds.add(id);
    }
  }

  selectAll(): void {
    this.paginatedPromotions.forEach(promotion => {
      if (this.isValidId(promotion.id)) {
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
    if (!ids.every(id => this.isValidId(id))) {
      this.errorMessage = 'Un ou plusieurs IDs de promotion sélectionnés sont invalides.';
      this.clearMessages();
      return;
    }
    this.isLoading = true;
    this.http.post(`${this.apiUrl}/bulk-activate`, ids).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(
      () => {
        this.loadPromotions();
        this.selectedPromotionIds.clear();
        this.showSuccess('Promotions sélectionnées activées avec succès !');
        this.promotionUpdateService.notifyUpdates(); // Notification
      },
      error => this.handleError('Échec de l’activation des promotions sélectionnées', error)
    );
  }


  bulkDeactivate(): void {
    const ids = Array.from(this.selectedPromotionIds);
    if (ids.length === 0) return;
    if (!ids.every(id => this.isValidId(id))) {
      this.errorMessage = 'Un ou plusieurs IDs de promotion sélectionnés sont invalides.';
      this.clearMessages();
      return;
    }
    this.isLoading = true;
    this.http.post(`${this.apiUrl}/bulk-deactivate`, ids).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(
      () => {
        this.loadPromotions();
        this.selectedPromotionIds.clear();
        this.showSuccess('Promotions sélectionnées désactivées avec succès !');
      },
      error => this.handleError('Échec de la désactivation des promotions sélectionnées', error)
    );
  }

  bulkDelete(): void {
    const ids = Array.from(this.selectedPromotionIds);
    if (ids.length === 0) return;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmer la suppression en masse',
        message: `Vous êtes sur le point de supprimer ${ids.length} promotions.`,
        warning: 'Cette action est irréversible !'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.http.post(`${this.apiUrl}/bulk-delete`, ids).pipe(
          finalize(() => this.isLoading = false)
        ).subscribe(
          () => {
            this.promotions = this.promotions.filter(p => !this.selectedPromotionIds.has(p.id));
            this.applyFilters();
            this.selectedPromotionIds.clear();
            this.showSuccess(`${ids.length} promotions supprimées !`);
          },
          error => this.handleError('Échec de la suppression en masse', error)
        );
      }
    });
  }

  exportPromotionsToCSV(): void {
    const headers = ['ID', 'Nom', 'Réduction (%)', 'Date Début', 'Date Fin', 'Condition', 'Active'];
    const csvRows = [headers.join(',')];
    for (const promotion of this.promotions) {
      const row = [
        promotion.id,
        `"${promotion.nom}"`,
        promotion.pourcentageReduction,
        format(new Date(promotion.dateDebut), 'yyyy-MM-dd'),
        format(new Date(promotion.dateFin), 'yyyy-MM-dd'),
        promotion.conditionPromotion,
        promotion.active ? 'Oui' : 'Non'
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

  parseDateFromInput(dateString: string): Date {
    return parse(dateString, 'yyyy-MM-dd', new Date());
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

  isAISuggested(promotion: Promotion): boolean {
    return promotion.nom.startsWith('AI Suggested Promotion for ');
  }

  acceptAISuggestion(id: number): void {
    if (!this.isValidId(id)) {
      this.errorMessage = 'ID de promotion invalide.';
      this.clearMessages();
      return;
    }
    this.isLoading = true;
    this.http.put<Promotion>(`${this.apiUrl}/${id}`, { ...this.promotions.find(p => p.id === id), active: true }).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(
      updatedPromotion => {
        updatedPromotion.id = Number(updatedPromotion.id);
        updatedPromotion.dateDebut = new Date(updatedPromotion.dateDebut);
        updatedPromotion.dateFin = new Date(updatedPromotion.dateFin);
        const index = this.promotions.findIndex(p => p.id === updatedPromotion.id);
        if (index !== -1) {
          this.promotions[index] = updatedPromotion;
        }
        this.applyFilters();
        this.showSuccess('Suggestion IA acceptée !');
        this.promotionUpdateService.notifyUpdates(); // Notification
      },
      error => this.handleError('Échec de l’acceptation de la suggestion IA', error)
    );
  }


  rejectAISuggestion(id: number): void {
    const promotion = this.promotions.find(p => p.id === id);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmer le rejet',
        message: `Voulez-vous vraiment rejeter la suggestion IA "${promotion?.nom}" ?`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (!this.isValidId(id)) {
          this.errorMessage = 'ID de promotion invalide.';
          this.clearMessages();
          return;
        }
        this.isLoading = true;
        this.http.delete(`${this.apiUrl}/${id}`).pipe(
          finalize(() => this.isLoading = false)
        ).subscribe(
          () => {
            this.promotions = this.promotions.filter(p => p.id !== id);
            this.applyFilters();
            this.showSuccess('Suggestion IA rejetée !');
          },
          error => this.handleError('Échec du rejet de la suggestion IA', error)
        );
      }
    });
  }

  private isValidId(id: number): boolean {
    return !isNaN(id) && id > 0;
  }
}