import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userId: number | null = null;
  isSidebarCollapsed = false;
  user: any = {
    id: null,
    nom: '',
    prenom: '',
    email: '',
    numeroDeTelephone: '',
    role: '',
    adresseLivraison: ''
  };

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('userId');
      this.userId = id ? +id : null;
      this.loadUserProfile();
    });
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userEmail');
    this.router.navigate(['/login']);
  }

  loadUserProfile() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      if (user.id === this.userId) {
        this.user = user;
      } else {
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  goBack() {
    if (this.userId) {
      this.router.navigate(['/livraison', this.userId]);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
