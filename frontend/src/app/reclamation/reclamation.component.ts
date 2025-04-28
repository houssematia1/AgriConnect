import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ReclamationService, Reclamation, Don } from '../Service/reclamation.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-reclamation',
  templateUrl: './reclamation.component.html',
  styleUrls: ['./reclamation.component.css']
})
export class ReclamationComponent implements OnInit {
  @ViewChild('pieChart') pieChartRef!: ElementRef<HTMLCanvasElement>;
  private pieChart!: Chart;
  reclamations: Reclamation[] = [];
  filteredReclamations: Reclamation[] = [];
  paginatedReclamations: Reclamation[] = []; // For paginated display
  selectedReclamation: Reclamation | null = null;
  dons: Don[] = []; // List of all available dons
  selectedDonId: number | null = null; // Selected don ID for the dropdown
  currentDonId!: number;
  isLoading = true;
  titleFilter = '';
  selectedFile: File | null = null;
  showDeleteModal = false;
  reclamationToDelete: Reclamation | null = null;
  isDeleting = false;
  originalDonId: number | null = null; // Stores the original donId for comparison
  
  // Pagination properties
  currentPage = 1;
  itemsPerPage = 5;

  constructor(
    private reclamationService: ReclamationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.currentDonId = Number(this.route.snapshot.paramMap.get('donId')) || 0;
    this.loadAllReclamations();
    this.loadAllDons(); // Fetch all dons for the dropdown
    
  }


  private initPieChart(): void {
    const ctx = this.pieChartRef.nativeElement.getContext('2d');
    if (!ctx) return;
    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });
  }

  private updatePieChart(): void {
    if (!this.pieChartRef?.nativeElement) return; // Ensure element exists
  
    if (!this.pieChart) {
      this.initPieChart();
    }
  
    const counts: Record<string, number> = {};
    this.filteredReclamations.forEach(r => {
      const key = r.type;
      counts[key] = (counts[key] || 0) + 1;
    });
  
    const labels = Object.keys(counts);
    const data = labels.map(l => counts[l]);
    const colors = labels.map(() => this.getRandomColor());
  
    if (this.pieChart) {
      this.pieChart.data.labels = labels;
      this.pieChart.data.datasets![0].data = data;
      this.pieChart.data.datasets![0].backgroundColor = colors;
      this.pieChart.update();
    }
  }

  private getRandomColor(): string {
    const r = Math.floor(Math.random() * 200) + 20;
    const g = Math.floor(Math.random() * 200) + 20;
    const b = Math.floor(Math.random() * 200) + 20;
    return `rgb(${r},${g},${b})`;
  }

  loadAllReclamations(): void {
    this.isLoading = true;
    this.reclamationService.getAllReclamations().subscribe({
      next: (data) => {
        this.reclamations = data;
        this.filteredReclamations = [...data];
        this.paginate();
        this.isLoading = false;
        this.updatePieChart(); // Initialize or update chart after data loads
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
  

  loadAllDons(): void {
    this.reclamationService.getAllDons().subscribe({
      next: (data) => {
        this.dons = data;
        console.log('Dons loaded:', this.dons);
      },
      error: () => {
        console.error('Failed to load dons');
      }
    });
  }

  toggleReclamationForm(): void {
    if (this.selectedReclamation) {
      this.resetForm();
    } else {
      this.selectedReclamation = {
        id: 0,
        titre: '',
        description: '',
        type: 'CLASSIC',
        don: this.currentDonId > 0 ? { id: this.currentDonId } : undefined
      };
      this.selectedDonId = this.selectedReclamation.don?.id || null;
      this.originalDonId = null; // New reclamation has no original don
    }
  }

  private resetForm(): void {
    this.selectedReclamation = null;
    this.selectedFile = null;
    this.selectedDonId = null;
    this.originalDonId = null;
  }

  onFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) this.selectedFile = file;
  }

  addReclamation(): void {
    if (!this.selectedReclamation) return;
    const formData = new FormData();
    formData.append('titre', this.selectedReclamation.titre);
    formData.append('description', this.selectedReclamation.description);
    formData.append('type', this.selectedReclamation.type);
    if (this.selectedDonId) {
      formData.append('donId', String(this.selectedDonId));
    }
    if (this.selectedFile) formData.append('image', this.selectedFile);

    this.reclamationService.addReclamation(formData).subscribe({
      next: (added) => {
        this.reclamations.unshift(added);
        this.applyFilters();
        this.resetForm();
      }
    });
  }

  selectForEdit(r: Reclamation): void {
    this.selectedReclamation = { ...r };
    this.selectedDonId = r.don?.id || null;
    this.originalDonId = r.don?.id || null;
    this.selectedFile = null;
  }

  updateReclamation(): void {
    if (!this.selectedReclamation?.id) return;
    const formData = new FormData();
    formData.append('titre', this.selectedReclamation.titre);
    formData.append('description', this.selectedReclamation.description);
    formData.append('type', this.selectedReclamation.type);
    if (this.selectedFile) formData.append('image', this.selectedFile);

    this.reclamationService.updateReclamation(this.selectedReclamation.id, formData).pipe(
      switchMap(updated => {
        if (this.selectedDonId !== this.originalDonId && this.selectedDonId != null) {
          return this.reclamationService.assignReclamationToDon(updated.id, this.selectedDonId);
        }
        return of(updated);
      })
    ).subscribe({
      next: (result) => {
        this.reclamations = this.reclamations.map(x => x.id === result.id ? result : x);
        this.applyFilters();
        this.resetForm();
      }
    });
  }

  openDeleteModal(r: Reclamation): void {
    this.reclamationToDelete = r;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.isDeleting = false;
    this.reclamationToDelete = null;
  }

  confirmDelete(): void {
    if (!this.reclamationToDelete) return;
    this.isDeleting = true;
    const id = this.reclamationToDelete.id;
    const prevAll = [...this.reclamations];
    const prevFilt = [...this.filteredReclamations];

    this.reclamations = this.reclamations.filter(x => x.id !== id);
    this.applyFilters();

    this.reclamationService.deleteReclamation(id).subscribe({
      next: () => this.closeDeleteModal(),
      error: () => {
        this.reclamations = prevAll;
        this.filteredReclamations = prevFilt;
        this.paginate();
        this.closeDeleteModal();
      }
    });
  }

  filterByTitle(): void {
    this.applyFilters();
  }

  // Helper method to apply all filters and update pagination
  private applyFilters(): void {
    if (!this.titleFilter) {
      this.filteredReclamations = [...this.reclamations];
    } else {
      const term = this.titleFilter.toLowerCase();
      this.filteredReclamations = this.reclamations.filter(x =>
        x.titre.toLowerCase().includes(term)
      );
    }
    // Reset to first page when filters change
    this.currentPage = 1;
    this.paginate();
  }

  // Pagination methods
  paginate(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedReclamations = this.filteredReclamations.slice(start, start + this.itemsPerPage);
    
    // If current page is empty and not the first page, go to last available page
    if (this.paginatedReclamations.length === 0 && this.currentPage > 1) {
      this.currentPage = this.totalPages || 1;
      this.paginate();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginate();
    }
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredReclamations.length / this.itemsPerPage));
  }

  changeItemsPerPage(items: number): void {
    this.itemsPerPage = items;
    this.currentPage = 1;
    this.paginate();
  }
}