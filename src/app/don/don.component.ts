import { Component, OnInit } from '@angular/core';
import { DonService } from '../Service/don.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';


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
  formError: string = ''; // Add this line for error messages

  titleError = '';
descriptionError = '';
amountError = '';



  // Delete confirmation modal properties
  showDeleteModal = false;
  donToDelete: any = null;
  isDeleting = false;

  // Price filter properties
  minPrice: number | null = null;
  maxPrice: number | null = null;
  priceFilterActive = false;

  // Add below in the class
currentPage = 1;
itemsPerPage = 3;
paginatedDons: any[] = [];

updatePagination(): void {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.paginatedDons = this.filteredDons.slice(startIndex, endIndex);
}

goToPage(page: number): void {
  this.currentPage = page;
  this.updatePagination();
}

get totalPages(): number {
  return Math.ceil(this.filteredDons.length / this.itemsPerPage);
}


  constructor(private donService: DonService) { }

  ngOnInit(): void {
    this.loadDons();
  }

  loadDons(): void {
    this.donService.getAllDons().subscribe({
      next: (data) => {
        this.dons = data;
        if (this.priceFilterActive) {
          this.filterByPrice();
        } else {
          this.filteredDons = [...data];
          this.updatePagination(); // <--- Add this
        }
      },
      error: (err) => console.error(err)
    });
  }
  
  filterByPrice(): void {
    this.priceFilterActive = true;
    this.filteredDons = this.dons.filter(don => {
      const amount = don.montant;
      const minValid = this.minPrice === null || amount >= this.minPrice;
      const maxValid = this.maxPrice === null || amount <= this.maxPrice;
      return minValid && maxValid;
    });
    this.currentPage = 1; // Reset to first page on new filter
    this.updatePagination(); // <--- Add this
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
        montant: 50,
        status: 'PENDING' // Automatically set to PENDING
      };
    }
    this.showForm = true;
    this.formError = '';
  }


  closeForm(): void {
    this.showForm = false;
    this.selectedDon = null;
  }

  sendEmailNotification(don: any): void {
    const templateParams = {
      titre: don.titre,
      description: don.description,
      montant: don.montant,
      status: don.status
    };
  
    emailjs.send('service_hwpmkie', 'template_3sqa30h', templateParams, '-Lx1zIceFm_4w94MZ')
      .then((response: EmailJSResponseStatus) => {
        console.log('Email sent successfully!', response.status, response.text);
      }, (error) => {
        console.error('Failed to send email.', error);
      });
  }

  submitForm(): void {
    this.titleError = '';
    this.descriptionError = '';
    this.amountError = '';
  
    let valid = true;
  
    if (!this.selectedDon.titre || this.selectedDon.titre.trim().length < 3) {
      this.titleError = 'Title must be at least 3 characters long.';
      valid = false;
    }
  
    if (!this.selectedDon.description || this.selectedDon.description.trim().length < 5) {
      this.descriptionError = 'Description must be at least 5 characters long.';
      valid = false;
    }
  
    if (!this.selectedDon.id && this.selectedDon.montant < 50) {
      this.amountError = 'The minimum donation amount is 50.';
      valid = false;
    }
  
    if (!valid) return;
  
    // Set status to PENDING for new donations
    if (!this.selectedDon.id) {
      this.selectedDon.status = 'PENDING';
    }
  
    const operation = this.selectedDon?.id 
      ? this.donService.updateDon(this.selectedDon.id, this.selectedDon)
      : this.donService.createDon(this.selectedDon);
  
    operation.subscribe({
      next: (result) => {
        if (!this.selectedDon.id) {
          this.dons.push(result);
          this.sendEmailNotification(result); // ✅ move here after result is available
          if (this.priceFilterActive) this.filterByPrice();
        }
        this.loadDons();
        this.closeForm();
      },
      error: (err) => {
        console.error(err);
        this.loadDons();
      }
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
  // Modify confirmDelete() method
  confirmDelete(): void {
    if (!this.donToDelete) return;

    this.isDeleting = true;
    const id = this.donToDelete.id;

    // Optimistically update both arrays
    const prevDons = [...this.dons];
    const prevFiltered = [...this.filteredDons];

    this.dons = this.dons.filter(d => d.id !== id);
    this.filteredDons = this.filteredDons.filter(d => d.id !== id);

    this.donService.deleteDon(id).subscribe({
      next: () => {
        this.closeDeleteModal();
        // Force refresh filters
        if (this.priceFilterActive) this.filterByPrice();
      },
      error: (err) => {
        console.error('Error deleting donation:', err);
        // Revert both arrays
        this.dons = prevDons;
        this.filteredDons = prevFiltered;
        this.closeDeleteModal();
      }
    });
  }

  downloadPDF(): void {
    const doc = new jsPDF();
  
    doc.text('Donations List', 14, 15);
    
    const headers = [['Title', 'Description', 'Amount', 'Status']];
    const rows = this.filteredDons.map(don => [
      don.titre,
      don.description,
      don.montant,
      don.status
    ]);
  
    autoTable(doc, {
      head: headers,
      body: rows,
      startY: 20
    });
  
    doc.save('donations-list.pdf');
  }
  

}