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
    role: 'user',
    adresseLivraison: ''
  };

  message: string = '';

  constructor(private userService: UserService, private router: Router) {}

  onSubmit(): void {
    this.userService.registerUser(this.user).subscribe({
      next: (response) => {
        console.log('Utilisateur inscrit avec succès:', response);

        // Rediriger vers la page de vérification avec l'email pré-rempli
        this.router.navigate(['/verify'], {
          queryParams: { email: this.user.email }
        });
      },
      error: (error) => {
        console.error('Erreur lors de l\'inscription:', error);

        if (error.status === 409) {
          this.message = '❌ Cet email est déjà utilisé. Veuillez en choisir un autre.';
        } else {
          this.message = '❌ Une erreur est survenue lors de l\'inscription.';
        }
      }
    });
  }
}
