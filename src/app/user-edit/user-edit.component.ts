import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, User } from '../user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  user: User = {
    id: 0,
    nom: '',
    prenom: '',
    email: '',
    numeroDeTelephone: '',
    role: '',
    isBlocked: false
  };

  message: string = '';
  userId: number = 0;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    this.userService.getUsers().subscribe(users => {
      const found = users.find(u => u.id === this.userId);
      if (found) {
        this.user = { ...found };
      }
    });
  }

  onSubmit(): void {
    // ✅ Supprimer manuellement motDePasse du payload
    const payload: any = { ...this.user };
    delete payload.motDePasse;

    this.userService.updateUser(payload).subscribe({
      next: () => {
        this.router.navigate(['/users']);
      },
      error: () => {
        this.message = '❌ Erreur lors de la mise à jour';
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }
}
