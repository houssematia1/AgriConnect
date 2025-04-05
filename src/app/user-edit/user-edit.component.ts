import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, User } from '../user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  userForm: FormGroup;
  userId!: number;
  user!: User;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
   
    this.userForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', Validators.required],
      numeroDeTelephone: [''],
      role: [''],
      adresseLivraison: ['']
    });
  }

  ngOnInit(): void {
   
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('ID utilisateur récupéré :', this.userId);

    
    this.userService.getUsers().subscribe(users => {
      console.log('Liste des utilisateurs récupérée :', users);
      this.user = users.find(u => u.id === this.userId)!;
      if (this.user) {
        console.log('Utilisateur trouvé :', this.user);
        this.userForm.patchValue(this.user);
      } else {
        console.warn('Aucun utilisateur trouvé pour l\'ID', this.userId);
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const updatedUser = { ...this.user, ...this.userForm.value };
      console.log('Données envoyées pour update :', updatedUser);
      this.userService.updateUser(updatedUser).subscribe(() => {
        this.router.navigate(['/users']);
      });
    }
  }
}
