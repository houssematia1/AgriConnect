import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationError, ActivatedRoute } from '@angular/router';
import { Fidelite, User } from '../../models/fidelite';
import { FideliteService } from '../../services/fidelite.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-fidelities-list',
  templateUrl: './fidelities-list.component.html',
  styleUrls: ['./fidelities-list.component.css']
})
export class FidelitiesListComponent implements OnInit {
  fidelites: Fidelite[] = [];
  userMap: { [key: number]: User } = {};
  isLoadingFidelites = true;
  isLoadingUsers = true;
  errorMessage: string | null = null;

  constructor(
    private fideliteService: FideliteService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        console.log('NavigationStart:', event.url);
      } else if (event instanceof NavigationEnd) {
        console.log('NavigationEnd:', event.url);
      } else if (event instanceof NavigationError) {
        console.error('NavigationError:', event.error);
      }
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoadingFidelites = true;
    this.errorMessage = null;
    this.fideliteService.getAllFidelites().subscribe({
      next: (fidelites) => {
        this.fidelites = fidelites;
        this.isLoadingFidelites = false;
        this.loadUsers();
      },
      error: (err: any) => {
        this.errorMessage = err.message;
        this.toastr.error(err.message);
        this.isLoadingFidelites = false;
      }
    });
  }

  loadUsers(): void {
    this.isLoadingUsers = true;
    this.fideliteService.getAllUsers().subscribe({
      next: (users) => {
        this.userMap = {};
        users.forEach(user => {
          this.userMap[user.id] = user;
        });
        this.isLoadingUsers = false;
      },
      error: (err: any) => {
        this.errorMessage = err.message;
        this.toastr.error(err.message);
        this.isLoadingUsers = false;
      }
    });
  }

  addFidelity(): void {
    console.log('Navigating to /loyalty/fidelities/add');
    this.router.navigate(['add'], { relativeTo: this.route }).then(success => {
      if (!success) {
        console.error('Navigation to /loyalty/fidelities/add failed');
      } else {
        console.log('Navigation to /loyalty/fidelities/add succeeded');
      }
    });
  }

  editFidelity(id: number): void {
    this.router.navigate(['edit', id], { relativeTo: this.route });
  }

  deleteFidelity(id: number): void {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette fidélité ?')) {
      this.fideliteService.deleteFidelite(id).subscribe({
        next: () => {
          this.toastr.success('Fidélité supprimée avec succès !');
          this.loadData();
        },
        error: (err: any) => {
          this.errorMessage = err.message;
          this.toastr.error(err.message);
        }
      });
    }
  }

  viewHistory(userId: number | undefined): void {
    if (userId === undefined) {
      this.toastr.error('ID utilisateur invalide.');
      return;
    }
    this.router.navigate(['history', userId], { relativeTo: this.route });
  }

  retryLoad(): void {
    this.errorMessage = null;
    this.loadData();
  }

  getUserById(userId: number): User | null {
    return this.userMap[userId] || null;
  }
}