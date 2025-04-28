import { Component, OnInit } from '@angular/core';
import { EvenementService } from 'src/app/services/evenement.service';

@Component({
  selector: 'app-evenement-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class EvenementListComponent implements OnInit {
  evenements: any[] = [];
  searchTerm: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  isLoading = true;
  error: string | null = null;

  constructor(private evenementService: EvenementService) {}

  ngOnInit(): void {
    this.evenementService.getAll().subscribe({
      next: (data: any[]) => {
        this.evenements = Array.isArray(data)
          ? data.map(e => {
              const newStatut = this.calculateStatut(e);

              if (e.statut !== newStatut) {
                const updated = {
                  ...e,
                  statut: newStatut,
                  categories: e.categories?.map((c: any) => ({ id: c.id })) || []
                };
                this.evenementService.update(e.id, updated).subscribe(); // mise à jour silencieuse
                e.statut = newStatut;
              }

              return {
                ...e,
                categories: e.categories?.map((c: any) => ({ ...c })) || []
              };
            })
          : [];

        this.isLoading = false;
      },
      error: err => {
        this.error = 'Erreur lors du chargement des événements.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  calculateStatut(event: any): string {
    const now = new Date();
    const debut = new Date(event.dateDebut);
    const fin = new Date(event.dateFin);

    if (!event.dateDebut || !event.dateFin) return 'PLANIFIE';
    if (now < debut) return 'PLANIFIE';
    if (now >= debut && now <= fin) return 'EN_COURS';
    if (now > fin) return 'TERMINE';
    return 'PLANIFIE';
  }

  delete(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cet événement ?')) {
      this.evenementService.delete(id).subscribe(() => {
        this.evenements = this.evenements.filter((e: any) => e.id !== id);
      });
    }
  }

  getCategorieNames(event: any): string {
    if (!event.categories || event.categories.length === 0) return 'Aucune';
    return event.categories.map((c: any) => c.nom).join(', ');
  }

  get filteredEvenements(): any[] {
    return (this.evenements || []).filter((e: any) =>
      (e?.nom || '').toLowerCase().includes((this.searchTerm || '').toLowerCase())
    );
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.evenements.sort((a: any, b: any) => {
      const aVal = a[column]?.toLowerCase?.() || a[column];
      const bVal = b[column]?.toLowerCase?.() || b[column];
      if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }
}
