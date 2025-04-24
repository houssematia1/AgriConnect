import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Fidelite } from 'src/app/models/fidelite';
import { User } from 'src/app/models/user';
import { FideliteService } from 'src/app/services/fidelite.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-fidelity',
  templateUrl: './edit-fidelity.component.html',
  styleUrls: ['./edit-fidelity.component.css']
})
export class EditFidelityComponent implements OnInit {
  fidelite: Fidelite | null = null;
  users: User[] = [];
  selectedUserId: number | null = null;
  errorMessage: string | null = null;
  isLoadingFidelity = true;
  isLoadingUsers = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fideliteService: FideliteService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const fidelityId = id ? +id : null;
    if (fidelityId === null) {
      this.toastr.error('ID de fidélité invalide.');
      this.router.navigate(['/loyalty/fidelities']);
      return;
    }
    this.loadFidelity(fidelityId);
    this.loadUsers();
  }

  loadFidelity(id: number): void {
    this.isLoadingFidelity = true;
    this.fideliteService.getFideliteById(id).subscribe({
      next: (fidelite) => {
        this.fidelite = fidelite;
        this.selectedUserId = fidelite.user?.id ?? null;
        this.isLoadingFidelity = false;
      },
      error: (err: any) => {
        this.errorMessage = err.message;
        this.toastr.error(err.message);
        this.isLoadingFidelity = false;
        this.router.navigate(['/loyalty/fidelities']);
      }
    });
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
    if (!this.fidelite) {
      this.errorMessage = 'Aucune fidélité à modifier.';
      this.toastr.error('Aucune fidélité à modifier.');
      return;
    }

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

    this.fideliteService.updateFidelite(this.fidelite.id!, this.fidelite).subscribe({
      next: () => {
        this.toastr.success('Fidélité mise à jour avec succès !');
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