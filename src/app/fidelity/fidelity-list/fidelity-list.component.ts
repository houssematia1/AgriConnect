import { Component, OnInit } from '@angular/core';
import { FidelityService } from '../services/fidelity.service';
import { Fidelite } from 'src/app/models/fidelite';


@Component({
  selector: 'app-fidelity-list',
  templateUrl: './fidelity-list.component.html',
  styleUrls: ['./fidelity-list.component.css']
})
export class FidelityListComponent implements OnInit {
  fidelities: Fidelite[] = [];
  searchTerm: string = '';

  constructor(private fidelityService: FidelityService) {}

  ngOnInit(): void {
    this.loadFidelities();
  }

  loadFidelities(): void {
    this.fidelityService.getFidelities(this.searchTerm).subscribe({
      next: (data) => this.fidelities = data,
      error: (err) => console.error('Error loading fidelities:', err)
    });
  }

  filterFidelities(): void {
    this.loadFidelities();
  }
}