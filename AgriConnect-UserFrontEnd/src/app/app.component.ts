import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'AgriConnect';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Optionnel : redirection vers home si on est à la racine
    if (this.router.url === '/') {
      this.router.navigate(['/home']);
    }
  }
}
