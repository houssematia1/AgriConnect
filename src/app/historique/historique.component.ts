import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('800ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class HistoriqueComponent implements OnInit, OnDestroy {
  userId: number | null = null;
  user: any = {
    prenom: 'John',
    nom: 'Doe',
  };
  history: any[] = [];
  filteredHistory: any[] = [];
  searchTerm: string = '';
  filters: any = {
    status: '',
    type: '',
    startDate: null,
    endDate: null,
  };
  activeFilters: { key: string; value: string }[] = [];
  isSidebarCollapsed = false;
  searchQuery = '';
  selectedStatus = '';
  selectedDate = '';

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('userId');
      this.userId = id ? +id : null;
      this.loadUser();
      this.loadHistory();
    });

    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(term => {
        this.searchTerm = term;
        this.applyFilters();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUser() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      if (user.id === this.userId) {
        this.user = { prenom: user.prenom, nom: user.nom };
      } else {
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadHistory() {
    // TODO: Implement API call to load history
    this.history = [
      {
        id: '12345',
        date: new Date('2025-04-12'),
        status: 'delivered',
        type: 'express',
        details: 'Type: Express',
      },
      {
        id: '12346',
        date: new Date('2025-04-11'),
        status: 'in_progress',
        type: 'standard',
        details: 'Type: Standard',
      },
      {
        id: '12347',
        date: new Date('2025-04-10'),
        status: 'cancelled',
        type: 'express',
        details: 'Type: Express',
      },
    ];
    this.filteredHistory = [...this.history];
  }

  onSearchChange(term: string) {
    this.searchSubject.next(term);
  }

  applyFilters() {
    this.filteredHistory = this.history.filter(entry => {
      const matchesSearch =
        !this.searchTerm ||
        entry.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        entry.details.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = !this.filters.status || entry.status === this.filters.status;
      const matchesType = !this.filters.type || entry.type === this.filters.type;

      const entryDate = new Date(entry.date);
      const matchesStartDate =
        !this.filters.startDate || entryDate >= new Date(this.filters.startDate);
      const matchesEndDate =
        !this.filters.endDate || entryDate <= new Date(this.filters.endDate);

      return matchesSearch && matchesStatus && matchesType && matchesStartDate && matchesEndDate;
    });

    this.updateActiveFilters();
  }

  updateActiveFilters() {
    this.activeFilters = [];
    if (this.filters.status) {
      this.activeFilters.push({ key: 'status', value: `Status: ${this.filters.status}` });
    }
    if (this.filters.type) {
      this.activeFilters.push({ key: 'type', value: `Type: ${this.filters.type}` });
    }
    if (this.filters.startDate) {
      this.activeFilters.push({
        key: 'startDate',
        value: `Start Date: ${new Date(this.filters.startDate).toLocaleDateString()}`,
      });
    }
    if (this.filters.endDate) {
      this.activeFilters.push({
        key: 'endDate',
        value: `End Date: ${new Date(this.filters.endDate).toLocaleDateString()}`,
      });
    }
  }

  removeFilter(key: string) {
    this.filters[key] = key === 'status' || key === 'type' ? '' : null;
    this.applyFilters();
  }

  resetFilters() {
    this.filters = {
      status: '',
      type: '',
      startDate: null,
      endDate: null,
    };
    this.searchTerm = '';
    this.searchSubject.next('');
    this.filteredHistory = [...this.history];
    this.activeFilters = [];
  }

  goBack() {
    if (this.userId) {
      this.router.navigate(['/profile', this.userId]);
    } else {
      this.router.navigate(['/login']);
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  viewDetails(entry: any): void {
    // TODO: Implement view details functionality
    console.log('Viewing details for entry:', entry);
  }
}
