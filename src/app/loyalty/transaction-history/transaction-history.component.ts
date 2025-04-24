import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PointsTransaction } from 'src/app/models/points-transaction';
import { User } from 'src/app/models/user';
import { FideliteService } from 'src/app/services/fidelite.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent implements OnInit {
  user: User | null = null;
  transactions: PointsTransaction[] = [];
  filteredTransactions: PointsTransaction[] = [];
  errorMessage: string | null = null;
  isLoadingUser = true;
  isLoadingTransactions = true;
  sortColumn: keyof PointsTransaction | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  filterText: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fideliteService: FideliteService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const userId = +this.route.snapshot.paramMap.get('userId')!;
    if (isNaN(userId)) {
      this.toastr.error('ID utilisateur invalide.');
      this.router.navigate(['/loyalty/fidelities']);
      return;
    }
    this.loadUser(userId);
    this.loadTransactions(userId);
  }

  loadUser(userId: number): void {
    this.isLoadingUser = true;
    this.fideliteService.getUserById(userId).subscribe({
      next: (user) => {
        this.user = user;
        this.isLoadingUser = false;
      },
      error: (err: any) => {
        this.errorMessage = err.message;
        this.toastr.error(err.message);
        this.isLoadingUser = false;
      }
    });
  }

  loadTransactions(userId: number): void {
    this.isLoadingTransactions = true;
    this.fideliteService.getTransactionHistory(userId).subscribe({
      next: (transactions) => {
        this.transactions = transactions.filter((t): t is PointsTransaction => typeof t.id === 'number' && t.id !== null);
        if (transactions.length !== this.transactions.length) {
          this.errorMessage = 'Certaines transactions n\'ont pas pu être chargées en raison d\'un identifiant manquant.';
          this.toastr.warning('Certaines transactions n\'ont pas pu être chargées.');
        }
        this.applyFilterAndSort();
        this.isLoadingTransactions = false;
      },
      error: (err: any) => {
        this.errorMessage = err.message;
        this.toastr.error(err.message);
        this.isLoadingTransactions = false;
      }
    });
  }

  deleteTransaction(id: number): void {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      this.fideliteService.deleteTransaction(id).subscribe({
        next: () => {
          this.toastr.success('Transaction supprimée avec succès !');
          const userId = +this.route.snapshot.paramMap.get('userId')!;
          this.loadTransactions(userId);
        },
        error: (err: any) => {
          this.errorMessage = err.message;
          this.toastr.error(err.message);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/loyalty/fidelities']);
  }

  retryLoad(): void {
    this.errorMessage = null;
    const userId = +this.route.snapshot.paramMap.get('userId')!;
    this.loadUser(userId);
    this.loadTransactions(userId);
  }

  sortTable(column: keyof PointsTransaction): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilterAndSort();
  }

  filterTransactions(): void {
    this.applyFilterAndSort();
  }

  applyFilterAndSort(): void {
    let tempTransactions = [...this.transactions];

    if (this.filterText.trim()) {
      const filterLower = this.filterText.toLowerCase();
      tempTransactions = tempTransactions.filter(transaction =>
        transaction.description.toLowerCase().includes(filterLower) ||
        transaction.points.toString().includes(filterLower)
      );
    }

    if (this.sortColumn) {
      tempTransactions.sort((a, b) => {
        const valueA = a[this.sortColumn!];
        const valueB = b[this.sortColumn!];
        if (this.sortColumn === 'transactionDate') {
          const dateA = new Date(valueA as Date);
          const dateB = new Date(valueB as Date);
          return this.sortDirection === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
        }
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return this.sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        }
        if (typeof valueA === 'number' && typeof valueB === 'number') {
          return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
        }
        return 0;
      });
    }

    this.filteredTransactions = tempTransactions;
  }

  clearFilter(): void {
    this.filterText = '';
    this.applyFilterAndSort();
  }
}