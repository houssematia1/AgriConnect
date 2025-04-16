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
        this.message = 'Connexion réussie.';
        localStorage.setItem('currentUser', JSON.stringify(user));
        if (user.role && user.role.trim().toLowerCase() === 'admin') {
          this.router.navigate(['/users']);
        } else {
          this.router.navigate(['/']);
        }
      },
      (error: any) => {
        console.error('Erreur de login :', error);
        if (error.error && error.error.error) {
          this.message = error.error.error; // Ex: "Votre compte est bloqué."
        } else {
          this.message = 'Erreur inconnue lors de la connexion.';
        }
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
