import { Component, OnInit } from '@angular/core';
import { ReclamationService, Reclamation } from './../Service/reclamation.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reclamation',
  templateUrl: './reclamation.component.html',
  styleUrls: ['./reclamation.component.css']
})
export class ReclamationComponent implements OnInit {
  reclamations: Reclamation[] = [];
  filteredReclamations: Reclamation[] = [];
  selectedReclamation: Reclamation | null = null;
  currentDonId!: number;
  isLoading = true;

    // Title filter property
    titleFilter: string = '';

    // Delete confirmation modal properties
    showDeleteModal = false;
    reclamationToDelete: Reclamation | null = null;
    isDeleting = false;

      // Open delete confirmation modal
  openDeleteModal(reclamation: Reclamation): void {
    this.reclamationToDelete = reclamation;
    this.showDeleteModal = true;
  }

  // Close delete confirmation modal
  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.reclamationToDelete = null;
    this.isDeleting = false;
  }

  // Perform the actual deletion
  confirmDelete(): void {
    if (!this.reclamationToDelete) return;
    
    this.isDeleting = true;
    const id = this.reclamationToDelete.id;
    
    // Optimistically remove from both arrays
    const prevReclamations = [...this.reclamations];
    const prevFiltered = [...this.filteredReclamations];
    
    this.reclamations = this.reclamations.filter(r => r.id !== id);
    this.filteredReclamations = this.filteredReclamations.filter(r => r.id !== id);
    
    this.reclamationService.deleteReclamation(id).subscribe({
      next: () => {
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error('Error deleting reclamation:', err);
        // Revert both arrays if error occurs
        this.reclamations = prevReclamations;
        this.filteredReclamations = prevFiltered;
        this.closeDeleteModal();
      }
    });
  }

  constructor(
    private reclamationService: ReclamationService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadAllReclamations();
  }

 loadAllReclamations(): void { //upadte table reclamations when using filter
    this.isLoading = true;
    this.reclamationService.getAllReclamations().subscribe({
      next: (data) => {
        this.reclamations = data;
        this.filteredReclamations = [...data];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching all reclamations', error);
        this.isLoading = false;
      }
    });
  }

  

  
  selectForEdit(reclamation: Reclamation): void {
    this.selectedReclamation = { ...reclamation };
  }

  toggleReclamationForm(): void {
    if (this.selectedReclamation) {
      this.selectedReclamation = null;
    } else {
      this.selectedReclamation = {
        id: 0,
        titre: '',
        description: '',
        type: 'CLASSIC',
        don: { id: this.currentDonId  }
      };
    }
  }
  
  addReclamation(): void {
    if (this.selectedReclamation) {
      const newRecl = {
        ...this.selectedReclamation,
        don: this.selectedReclamation.don 
      };
      const { id, ...reclamationToAdd } = newRecl;
      
      this.reclamationService.addReclamation(reclamationToAdd).subscribe({
        next: (addedReclamation) => {
          // Add the new reclamation to both arrays
          this.reclamations = [addedReclamation, ...this.reclamations];
          this.filteredReclamations = [addedReclamation, ...this.filteredReclamations];
          this.toggleReclamationForm();
          
          // Re-apply the title filter if active
          if (this.titleFilter) {
            this.filterByTitle();
          }
        },
        error: (err) => console.error('Error adding reclamation:', err)
      });
    }
  }

  updateReclamation(): void {
    if (this.selectedReclamation?.id) {
      this.reclamationService.updateReclamation(
        this.selectedReclamation.id,
        this.selectedReclamation
      ).subscribe({
        next: (updatedReclamation) => {
          // Update both arrays
          this.reclamations = this.reclamations.map(r => 
            r.id === updatedReclamation.id ? updatedReclamation : r
          );
          this.filteredReclamations = this.filteredReclamations.map(r => 
            r.id === updatedReclamation.id ? updatedReclamation : r
          );
          this.toggleReclamationForm();
          
          // Re-apply the title filter if active
          if (this.titleFilter) {
            this.filterByTitle();
          }
        },
        error: (err) => {
          console.error('Error updating reclamation:', err);
          alert('Error updating reclamation. Please try again.');
        }
      });
    }
  }
// Example for delete with optimistic update
deleteReclamation(id: number): void {
  if (confirm('Are you sure you want to delete this reclamation?')) {
    // Optimistically remove from UI
    const prevReclamations = [...this.reclamations];
    this.reclamations = this.reclamations.filter(r => r.id !== id);
    
    this.reclamationService.deleteReclamation(id).subscribe({
      error: (err) => {
        console.error('Error deleting reclamation:', err);
        // Revert if error occurs
        this.reclamations = prevReclamations;
        alert('Error deleting reclamation. Please try again.');
      }
    });
  }
}

  // Filter reclamations by title
  filterByTitle(): void {
    if (!this.titleFilter) {
      this.filteredReclamations = [...this.reclamations];
      return;
    }
    
    const searchTerm = this.titleFilter.toLowerCase();
    this.filteredReclamations = this.reclamations.filter(reclamation => 
      reclamation.titre.toLowerCase().includes(searchTerm))
  }
}