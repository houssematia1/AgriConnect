import { Component } from '@angular/core';
import { UserService } from '../user.service';

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
    role: 'user'  // par défaut "user" (client)
  };

  message: string = '';

  constructor(private userService: UserService) { }

  onSubmit(): void {
    this.userService.registerUser(this.user).subscribe(
      (response) => {
        console.log('Inscription réussie !', response);
        this.message = "Inscription réussie !";
      },
      (error) => {
        console.error('Erreur lors de l\'inscription', error);
        this.message = error.error || "Erreur lors de l'inscription";
      }
    );
  }
}
