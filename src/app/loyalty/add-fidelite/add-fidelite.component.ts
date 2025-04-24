import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Fidelite } from 'src/app/models/fidelite';
import { User } from 'src/app/models/user';
import { FideliteService } from 'src/app/services/fidelite.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-fidelite',
  templateUrl: './add-fidelite.component.html',
  styleUrls: ['./add-fidelite.component.css']
})
export class AddFideliteComponent implements OnInit {
  fidelite: Fidelite = {
    id: 0,
    points: 0,
    niveau: 'Bronze',
    lastUpdated: new Date(),
    user: null
  };
  users: User[] = [];
  selectedUserId: number | null = null;
  errorMessage: string | null = null;
  isLoadingUsers = true;

  constructor(
    private fideliteService: FideliteService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoadingUsers = true;
    this.fideliteService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoadingUsers = false;
      },
      error: (err: any) => {
        this.errorMessage = err.message;
        this.toastr.error(err.message);
        this.isLoadingUsers = false;
      }
    });
  }

  onSubmit(): void {
    if (this.selectedUserId === null) {
      this.errorMessage = 'Veuillez sélectionner un utilisateur.';
      this.toastr.error('Veuillez sélectionner un utilisateur.');
      return;
    }

    if (this.fidelite.points < 0) {
      this.errorMessage = 'Les points ne peuvent pas être négatifs.';
      this.toastr.error('Les points ne peuvent pas être négatifs.');
      return;
    }

    const selectedUser = this.users.find(user => user.id === this.selectedUserId);
    if (!selectedUser) {
      this.errorMessage = 'Utilisateur non trouvé.';
      this.toastr.error('Utilisateur non trouvé.');
      return;
    }

    this.fidelite.user = selectedUser;
    this.fidelite.lastUpdated = new Date();

    this.fideliteService.saveFidelite(this.fidelite).subscribe({
      next: () => {
        this.toastr.success('Fidélité ajoutée avec succès !');
        this.router.navigate(['/loyalty/fidelities']);
      },
      error: (err: any) => {
        this.errorMessage = err.message;
        this.toastr.error(err.message);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/loyalty/fidelities']);
  }

  clearError(): void {
    this.errorMessage = null;
  }
}