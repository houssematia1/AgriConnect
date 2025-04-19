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
        this.message = 'Login réussi !';

        // Store user data in localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('userEmail', user.email);

        // Check user role and redirect with userId
        if (user && user.role && user.id) { // Ensure user.id exists
          const role = user.role.trim().toLowerCase();
          if (role === 'admin') {
            this.router.navigate(['/users']); // No userId needed for admin path in this example
          } else if (role === 'livreur') {
            this.router.navigate(['/livraison', user.id]); // Include userId in path
          } else {
            this.router.navigate(['/']); // Default path for other roles
          }
        } else {
          this.router.navigate(['/']); // Fallback if role or id is missing
        }
      },
      (error: any) => {
        console.error('Erreur de login :', error);
        this.message = 'Erreur de login : ' + (error.error?.error || 'Une erreur est survenue');
      }
    );
  }

  ngAfterViewInit() {
    let current: any = null;
    const emailInput = document.querySelector('#email') as HTMLInputElement;
    const passwordInput = document.querySelector('#password') as HTMLInputElement;
    const submitButton = document.querySelector('#submit') as HTMLButtonElement;

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