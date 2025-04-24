import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Fidelite, User } from '../../models/fidelite';
import { FideliteService } from '../../services/fidelite.service';


@Component({
  selector: 'app-fidelities-list',
  templateUrl: './fidelities-list.component.html',
  styleUrls: ['./fidelities-list.component.css']
})
export class FidelitiesListComponent implements OnInit {
  fidelites: Fidelite[] = [];
  userMap: { [key: number]: User } = {};

  constructor(private fideliteService: FideliteService, private router: Router) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.fideliteService.getAllFidelites().subscribe({
      next: (fidelites) => {
        this.fidelites = fidelites;
        this.loadUsers();
      },
      error: (err: any) => console.error('Erreur lors du chargement des fidélités :', err) // Added type for err
    });
  }

  loadUsers(): void {
    this.fideliteService.getAllUsers().subscribe({
      next: (users) => {
        users.forEach(user => {
          this.userMap[user.id] = user;
        });
      },
      error: (err: any) => console.error('Erreur lors du chargement des utilisateurs :', err) // Added type for err
    });
  }

  editFidelity(id: number): void {
    this.router.navigate(['/loyalty/fidelities/edit', id]);
  }

  deleteFidelity(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette fidélité ?')) {
      this.fideliteService.deleteFidelite(id).subscribe({ // Changed deleteFidelity to deleteFidelite
        next: () => {
          alert('Fidélité supprimée avec succès !');
          this.loadData();
        },
        error: (err: any) => console.error('Erreur lors de la suppression de la fidélité :', err) // Added type for err
      });
    }
  }

  viewHistory(userId: number): void {
    this.router.navigate(['/loyalty/fidelities/history', userId]);
  }

  addFidelity(): void {
    this.router.navigate(['/loyalty/fidelities/add']);
  }

  getUserById(userId: number): User | null {
    return this.userMap[userId] || null;
  }
}