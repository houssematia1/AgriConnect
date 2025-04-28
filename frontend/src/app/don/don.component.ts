// src/app/don/don.component.ts

import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { DonService, Don, TypeDon, Status } from '../Service/don.service';
import jsPDF from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-don',
  templateUrl: './don.component.html',
  styleUrls: ['./don.component.css']
})
export class DonComponent implements OnInit, AfterViewInit {
  dons: Don[] = [];
  filteredDons: Don[] = [];
  showForm = false;
  selectedDon!: Don;
  titleError = '';
  descriptionError = '';
  amountError = '';
  quantiteError = '';
  showDeleteModal = false;
  donToDelete!: Don;
  isDeleting = false;
  minPrice: number | null = null;
  maxPrice: number | null = null;
  priceFilterActive = false;
  currentPage = 1;
  itemsPerPage = 3;
  paginatedDons: Don[] = [];
  showConfirmationModal = false;

  @ViewChild('pieChart') pieChartRef!: ElementRef<HTMLCanvasElement>;
  private pieChart!: Chart;

  constructor(private donService: DonService) { }

  ngOnInit(): void {
    this.loadDons();
  }

  ngAfterViewInit(): void {
    this.initPieChart();
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
    const counts: Record<string, number> = {};
    this.filteredDons.forEach(d => {
      counts[d.status] = (counts[d.status] || 0) + 1;
    });
    const labels = Object.keys(counts);
    const data = labels.map(l => counts[l]);
    const colors = labels.map(() => this.randomColor());
    this.pieChart.data.labels = labels;
    this.pieChart.data.datasets![0].data = data;
    this.pieChart.data.datasets![0].backgroundColor = colors;
    this.pieChart.update();
  }

  private randomColor(): string {
    const r = Math.floor(Math.random() * 200) + 20;
    const g = Math.floor(Math.random() * 200) + 20;
    const b = Math.floor(Math.random() * 200) + 20;
    return `rgb(${r},${g},${b})`;
  }

  private applyFilter(): void {
    if (this.priceFilterActive) this.onFilterByPrice();
    else {
      this.filteredDons = [...this.dons];
      this.paginate();
    }
    this.updatePieChart();
  }

  loadDons(): void {
    this.donService.getAllDons().subscribe({
      next: data => {
        this.dons = data;
        this.applyFilter();
      },
      error: err => console.error(err)
    });
  }

  onFilterByPrice(): void {
    this.priceFilterActive = true;
    this.filteredDons = this.dons.filter(d => {
      const minOk = this.minPrice == null || (d.montant ?? 0) >= this.minPrice;
      const maxOk = this.maxPrice == null || (d.montant ?? 0) <= this.maxPrice;
      return minOk && maxOk;
    });
    this.currentPage = 1;
    this.paginate();
    this.updatePieChart();
  }

  resetPriceFilter(): void {
    this.minPrice = this.maxPrice = null;
    this.priceFilterActive = false;
    this.applyFilter();
  }

  paginate(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedDons = this.filteredDons.slice(start, start + this.itemsPerPage);
    // Make sure we don't have an empty page if we're on a page that no longer exists
    if (this.paginatedDons.length === 0 && this.currentPage > 1) {
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
    return Math.max(1, Math.ceil(this.filteredDons.length / this.itemsPerPage));
  }
  
  // Add a method to handle changing items per page if needed
  changeItemsPerPage(items: number): void {
    this.itemsPerPage = items;
    this.currentPage = 1; // Reset to first page when changing items per page
    this.paginate();
  }

  openForm(don?: Don): void {
    if (don) {
      this.selectedDon = { ...don };
    } else {
      this.selectedDon = {
        id: 0,
        titre: '',
        description: '',
        montant: 50,
        quantite: 1,
        status: 'PENDING',
        typeDon: 'MONETAIRE'
      };
    }
    this.titleError = this.descriptionError = this.amountError = this.quantiteError = '';
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedDon = undefined as any;
  }

  submitForm(): void {
    this.titleError = this.descriptionError = this.amountError = this.quantiteError = '';
    let valid = true;
    if (!this.selectedDon.titre.trim()) {
      this.titleError = 'Title is required';
      valid = false;
    }
    if (!this.selectedDon.description.trim()) {
      this.descriptionError = 'Description is required';
      valid = false;
    }
    if (this.selectedDon.typeDon === 'MONETAIRE') {
      if ((this.selectedDon.montant ?? 0) < 50) {
        this.amountError = 'Minimum amount is 50';
        valid = false;
      }
      delete this.selectedDon.quantite;
    } else {
      if ((this.selectedDon.quantite ?? 0) < 1) {
        this.quantiteError = 'Minimum quantity is 1';
        valid = false;
      }
      delete this.selectedDon.montant;
    }
    if (!valid) return;

    const operation = this.selectedDon.id
      ? this.donService.updateDon(this.selectedDon.id, this.selectedDon)
      : this.donService.createDon(this.selectedDon);

    operation.subscribe({
      next: res => {
        if (!this.selectedDon.id) {
          this.sendEmailNotification(res);
          this.showConfirmationModal = true;
        }
        this.loadDons();
        this.closeForm();
      },
      error: err => {
        console.error(err);
        this.loadDons();
      }
    });
  }

  sendEmailNotification(don: Don): void {
    const params = {
      titre: don.titre,
      description: don.description,
      montant: don.montant,
      status: don.status
    };
    emailjs.send('service_mfxc8ew', 'template_57r5mgg', params, 'TuDAGt_ql_e9ca-4g')
      .then((resp: EmailJSResponseStatus) => console.log('Email sent', resp))
      .catch(err => console.error('Email error', err));
  }

  openDeleteModal(don: Don): void {
    this.donToDelete = don;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.isDeleting = false;
  }

  confirmDelete(): void {
    this.isDeleting = true;
    this.donService.deleteDon(this.donToDelete.id).subscribe({
      next: () => {
        this.loadDons();
        this.closeDeleteModal();
      },
      error: () => {
        this.loadDons();
        this.closeDeleteModal();
      }
    });
  }

  downloadPDF(): void {
    const doc = new jsPDF();
    const headers = [['Title', 'Description', 'Value', 'Status']];
    const rows: (string | number)[][] = this.filteredDons.map(d => {
      const value = d.typeDon === 'MONETAIRE'
        ? (d.montant ?? 0)
        : (d.quantite ?? 0);
      return [d.titre, d.description, value, d.status];
    });
    autoTable(doc, {
      head: headers,
      body: rows as RowInput[],
      startY: 20
    });
    doc.save('donations-list.pdf');
  }
  
}
