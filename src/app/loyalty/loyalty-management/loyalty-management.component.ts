import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loyalty-management',
  templateUrl: './loyalty-management.component.html',
  styleUrls: ['./loyalty-management.component.css']
})
export class LoyaltyManagementComponent {
  constructor(private router: Router) {}

  navigateToFidelities(): void {
    this.router.navigate(['/loyalty/fidelities']);
  }
}