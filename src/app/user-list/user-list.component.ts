import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, User } from '../user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  allUsers: User[] = [];
  searchTerm: string = '';
  selectedRole: string = 'all';
  totalUsers: number = 0;

  page: number = 1;
  pageSize: number = 10;
  pages: number[] = [];
  isSidebarOpen: boolean = true;

  constructor(
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.allUsers = users;
      this.totalUsers = users.length;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    let filtered = [...this.allUsers];

    if (this.selectedRole !== 'all') {
      filtered = filtered.filter(user =>
        user.role.trim().toLowerCase() === this.selectedRole
      );
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.trim().toLowerCase();
      filtered = filtered.filter(user =>
        `${user.nom} ${user.prenom} ${user.email}`.toLowerCase().includes(term)
      );
    }

    this.totalUsers = filtered.length;
    const start = (this.page - 1) * this.pageSize;
    const end = this.page * this.pageSize;
    this.users = filtered.slice(start, end);
    this.pages = Array.from({ length: Math.ceil(this.totalUsers / this.pageSize) }, (_, i) => i + 1);
    this.cdr.detectChanges();
  }

  onSearch(): void {
    this.page = 1;
    this.applyFilters();
  }

  onRoleChange(): void {
    this.page = 1;
    this.applyFilters();
  }

  goToPage(p: number): void {
    this.page = p;
    this.applyFilters();
  }

  nextPage(): void {
    if (this.page < this.pages.length) {
      this.page++;
      this.applyFilters();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.applyFilters();
    }
  }

  onUpdateUser(user: User): void {
    this.router.navigate(['/users/edit', user.id]);
  }

  onDeleteUser(user: User): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.deleteUser(user.id).subscribe(() => {
        this.loadUsers();
      });
    }
  }

  onAddUser(): void {
    this.router.navigate(['/users/add']);
  }

  onLogout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  onBlockUser(user: User): void {
    if (confirm(`Voulez-vous bloquer ${user.nom} ${user.prenom} ?`)) {
      this.userService.blockUser(user.id, true).subscribe(() => {
        this.loadUsers();
      });
    }
  }

  onUnblockUser(user: User): void {
    if (confirm(`Voulez-vous débloquer ${user.nom} ${user.prenom} ?`)) {
      this.userService.blockUser(user.id, false).subscribe(() => {
        this.loadUsers();
      });
    }
  }
}
