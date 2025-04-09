import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userId: number | null = null;
  user: any = {
    id: null,
    nom: '',
    prenom: '',
    email: '',
    numeroDeTelephone: '',
    role: '',
    adresseLivraison: '',
    vehicule: ''
  };

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('userId');
      this.userId = id ? +id : null;
      this.loadUserProfile();
    });
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
