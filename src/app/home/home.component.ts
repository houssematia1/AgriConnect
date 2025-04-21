import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoggedIn: boolean = false;
  currentUser: any = {};
  showProfileMenu: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const raw = localStorage.getItem('currentUser');

    if (raw && raw !== 'null') {
      try {
        const user = JSON.parse(raw);
        this.currentUser = user;
        this.isLoggedIn = !!(user && user.id);
      } catch (e) {
        console.error('Erreur de parsing currentUser:', e);
        this.isLoggedIn = false;
      }
    } else {
      this.isLoggedIn = false;
    }
  }

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }

  onGoToMyAccount(): void {
    this.router.navigate(['/my-account']);
  }

  onLogout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/home']).then(() => {
      window.location.reload(); // Recalcule isLoggedIn
    });
  }
  getUserPhotoUrl(user: any): string {
    return user?.photo
      ? `http://localhost:8082/uploads/${user.photo}`
      : `https://ui-avatars.com/api/?name=${user.nom}+${user.prenom}`;
  }
}
