import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent {
  user = {
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    numeroDeTelephone: '',
    role: 'user'
  };

  message: string = '';

  constructor(private userService: UserService,private router: Router ) { }

  onSubmit(): void {
    this.userService.registerUser(this.user).subscribe(
      (response) => {
        console.log('User registered:', response);
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Error during registration:', error);
        this.message = 'Erreur lors de l\'inscription';
      }
    );
  }
}
