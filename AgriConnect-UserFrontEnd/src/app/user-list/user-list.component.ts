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
  searchTerm: string = '';
  selectedRole: string = 'all';

  constructor(
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.filterByRole();
      this.cdr.detectChanges();
    });
  }
  
  filterByRole(): void {
    if (this.selectedRole === 'all') {
    
      return;
    }
    this.users = this.users.filter(u => u.role.trim().toLowerCase() === this.selectedRole);
  }

  onRoleChange(event: any): void {
    this.selectedRole = event.target.value;
    this.loadUsers();
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.userService.searchUsers(this.searchTerm).subscribe(users => {
        this.users = users;
        this.cdr.detectChanges();
      });
    } else {
      this.loadUsers();
    }
  }

  onUpdateUser(user: User): void {
    this.router.navigate(['/users/edit', user.id]);
  }

  onDeleteUser(user: User): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.deleteUser(user.id).subscribe((data:any) => {
        this.loadUsers();
      });
    }
  }
}
