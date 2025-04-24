import { Component, OnInit } from '@angular/core';
  import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user';
import { PointsTransaction } from '../../models/points-transaction';
import { FideliteService } from '../../services/fidelite.service';
 
 

  @Component({
    selector: 'app-transaction-history',
    templateUrl: './transaction-history.component.html',
    styleUrls: ['./transaction-history.component.css']
  })
  export class TransactionHistoryComponent implements OnInit {
    userId: number | null = null;
    user: User | null = null;
    transactions: PointsTransaction[] = [];
    userMap: { [key: number]: User } = {};

    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private fideliteService: FideliteService
    ) {}

    ngOnInit(): void {
      this.userId = +this.route.snapshot.paramMap.get('userId')!;
      this.loadUser();
      this.loadTransactions();
    }

    loadUser(): void {
      this.fideliteService.getAllUsers().subscribe({
        next: (users) => {
          users.forEach(user => {
            this.userMap[user.id] = user;
          });
          this.user = this.userMap[this.userId!];
        },
        error: (err) => console.error('Erreur lors du chargement des utilisateurs :', err)
      });
    }

    loadTransactions(): void {
      if (this.userId) {
        this.fideliteService.getTransactionHistory(this.userId).subscribe({
          next: (transactions) => {
            this.transactions = transactions;
          },
          error: (err) => console.error('Erreur lors de la récupération de l\'historique :', err)
        });
      }
    }

    goBack(): void {
      this.router.navigate(['/loyalty/fidelities']);
    }
  }