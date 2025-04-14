import { Component, OnInit } from '@angular/core';
import { DonService } from '../Service/don.service';

@Component({
  selector: 'app-don',
  templateUrl: './don.component.html',
  styleUrls: ['./don.component.css']
})
export class DonComponent implements OnInit {
  dons: any[] = [];
  filteredDons: any[] = [];
  showForm = false;
  selectedDon: any = null;
  
  
  // Delete confirmation modal properties
  showDeleteModal = false;
  donToDelete: any = null;
  isDeleting = false;

    // Price filter properties
    minPrice: number | null = null;
    maxPrice: number | null = null;
    priceFilterActive = false;

  constructor(private donService: DonService) {}

  ngOnInit(): void {
    this.loadDons();
  }

  loadDons(): void {
    this.donService.getAllDons().subscribe({
      next: (data) => {
        this.dons = data;
        this.filteredDons = [...data];
      },
      error: (err) => console.error(err)
    });
  }

    // Filter donations by price range
    filterByPrice(): void {
      this.priceFilterActive = true;
      this.filteredDons = this.dons.filter(don => {
        const amount = don.montant;
        const minValid = this.minPrice === null || amount >= this.minPrice;
        const maxValid = this.maxPrice === null || amount <= this.maxPrice;
        return minValid && maxValid;
      });
    }
  
    // Reset price filter
    resetPriceFilter(): void {
      this.minPrice = null;
      this.maxPrice = null;
      this.priceFilterActive = false;
      this.filteredDons = [...this.dons];
    }
  
  openForm(don?: any): void {
    if (don) {
      this.selectedDon = { ...don };
    } else {
      this.selectedDon = {
        titre: '',
        description: '',
        montant: 0,
        status: 'ÊnCours'
      };
    }
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedDon = null;
  }

  submitForm(): void {
    const operation = this.selectedDon?.id 
      ? this.donService.updateDon(this.selectedDon.id, this.selectedDon)
      : this.donService.createDon(this.selectedDon);

    operation.subscribe({
      next: () => {
        this.loadDons();
        this.closeForm();
      },
      error: (err) => console.error(err)
    });
  }

  // Open delete confirmation modal
  openDeleteModal(don: any): void {
    this.donToDelete = don;
    this.showDeleteModal = true;
  }

  // Close delete confirmation modal
  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.donToDelete = null;
    this.isDeleting = false;
  }

  // Perform the actual deletion
  confirmDelete(): void {
    if (!this.donToDelete) return;
    
    this.isDeleting = true;
    const id = this.donToDelete.id;
    
    // Optimistically remove from UI
    const prevDons = [...this.dons];
    this.dons = this.dons.filter(d => d.id !== id);
    
    this.donService.deleteDon(id).subscribe({
      next: () => {
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error('Error deleting donation:', err);
        // Revert if error occurs
        this.dons = prevDons;
        this.closeDeleteModal();
      }
    });
  }
}