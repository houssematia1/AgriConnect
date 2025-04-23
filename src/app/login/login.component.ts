import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import anime from 'animejs/lib/anime.es.js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {
  credentials = {
    email: '',
    motDePasse: ''
  };
  message = '';

  constructor(private userService: UserService, private router: Router) {}

  onSubmit(): void {
    this.userService.login(this.credentials).subscribe(
      (user: any) => {
        console.log('Login réussi :', user);

        // ✅ Stockage dans localStorage avec une clé claire
        localStorage.setItem('user', JSON.stringify(user));

        this.message = 'Connexion réussie !';

        // ✅ Redirection selon le rôle
        if (user && user.role) {
          const role = user.role.trim().toUpperCase();

          if (role === 'ADMIN') {
            this.router.navigate(['/admin']); // ou une autre page admin
          } else if (role === 'AGRICULTEUR') {
            this.router.navigate(['/dashboard-agriculteur']); // ou une autre route agriculteur
          } else if (role === 'CLIENT') {
            this.router.navigate(['/dashboard-client']); // ou page client
          } else {
            this.router.navigate(['/']); // fallback
          }
        } else {
          this.router.navigate(['/']);
        }
      },
      (error: any) => {
        console.error('Erreur de connexion :', error);
        this.message = 'Email ou mot de passe incorrect.';
      }
    );
  }

  ngAfterViewInit() {
    let current: any = null;
    const emailInput = document.querySelector('#email');
    const passwordInput = document.querySelector('#password');
    const submitButton = document.querySelector('#submit');

    if (emailInput) {
      emailInput.addEventListener('focus', () => {
        if (current) current.pause();
        current = anime({
          targets: 'path',
          strokeDashoffset: { value: 0, duration: 700, easing: 'easeOutQuart' },
          strokeDasharray: { value: '240 1386', duration: 700, easing: 'easeOutQuart' }
        });
      });
    }

    if (passwordInput) {
      passwordInput.addEventListener('focus', () => {
        if (current) current.pause();
        current = anime({
          targets: 'path',
          strokeDashoffset: { value: -336, duration: 700, easing: 'easeOutQuart' },
          strokeDasharray: { value: '240 1386', duration: 700, easing: 'easeOutQuart' }
        });
      });
    }

    if (submitButton) {
      submitButton.addEventListener('focus', () => {
        if (current) current.pause();
        current = anime({
          targets: 'path',
          strokeDashoffset: { value: -730, duration: 700, easing: 'easeOutQuart' },
          strokeDasharray: { value: '530 1386', duration: 700, easing: 'easeOutQuart' }
        });
      });
    }
  }
}
