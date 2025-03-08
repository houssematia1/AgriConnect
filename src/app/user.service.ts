import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // URL de base pour les opérations sur les utilisateurs
  private apiUrl = 'http://localhost:8081/api/users';
  // URL pour l'authentification (login)
  private authUrl = 'http://localhost:8081/api/auth';

  constructor(private http: HttpClient) { }

  // Inscription d'un utilisateur
  registerUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  // Connexion (login) d'un utilisateur
  login(credentials: any): Observable<any> {
    // On demande 'text' comme type de réponse car le backend renvoie un message simple
    return this.http.post(`${this.authUrl}/login`, credentials, { responseType: 'text' });
  }
}
