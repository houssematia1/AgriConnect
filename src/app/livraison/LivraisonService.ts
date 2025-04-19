import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

// Interface for Commande (matches backend Commande entity)
export interface Commande {
  livreur: { id: number; nom: string; email: string; telephone: string; userId: number; };
  id: number;
  clientNom: string;
  statut: string;
  address: string;
  telephone: string;
  createdAt?: string;
}

// Interface for Livraison (used for livraisons API and frontend state)
export interface Livraison {
  id?: number;
  dateLivraison?: string;
  statusLivraison: string;
  typeLivraison: string;
  livreur: {
    id: number;
    nom: string;
    email: string;
    telephone: string;
    userId: number;
  };
  commandeId: number;
  photo?: string;
  reason?: string;
  isTaken?: boolean;
  clientNom?: string;
  address?: string;
  telephone?: string;
}
@Injectable({
  providedIn: 'root'
})
export class LivraisonService {
  private apiUrl = 'http://localhost:8082/api/commandes';
  private livraisonUrl = 'http://localhost:8082/api/livraisons';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Server-side error
      const errorBody = error.error ? (typeof error.error === 'string' ? error.error : error.error.message) : null;
      switch (error.status) {
        case 400:
          errorMessage = `Requête invalide: ${errorBody || 'Vérifiez les données envoyées.'}`;
          break;
        case 401:
          errorMessage = 'Non autorisé. Veuillez vous reconnecter.';
          break;
        case 403:
          errorMessage = 'Accès interdit. Vous n\'avez pas les permissions nécessaires.';
          break;
        case 404:
          errorMessage = 'Ressource non trouvée.';
          break;
        case 500:
          errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
          break;
        default:
          errorMessage = `Erreur ${error.status}: ${errorBody || error.message || 'Erreur inconnue'}`;
      }
    }

    console.error('API Error:', errorMessage, error);
    console.error('Backend response:', error.error);
    return throwError(() => new Error(errorMessage));
  }

  getAllCommandes(): Observable<Commande[]> {
    return this.http.get<Commande[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      tap(data => console.log('API Response (getAllCommandes):', data)),
      catchError(this.handleError)
    );
  }

  updateLivraison(id: number, livraison: Livraison): Observable<Livraison> {
    return this.http.put<Livraison>(`${this.livraisonUrl}/${id}`, livraison, { 
      headers: this.getHeaders() 
    }).pipe(
      tap(response => console.log('Livraison updated:', response)),
      catchError(this.handleError)
    );
  }

  createLivraison(livraison: Livraison): Observable<Livraison> {
    const headers = this.getHeaders();
    console.log('Creating livraison with payload:', JSON.stringify(livraison, null, 2));
    console.log('Headers:', {
      'Content-Type': headers.get('Content-Type'),
      'Authorization': headers.get('Authorization')
    });

    return this.http.post<Livraison>(`${this.livraisonUrl}/create`, livraison, { headers }).pipe(
      tap(response => console.log('Livraison created successfully:', response)),
      catchError(this.handleError)
    );
  }
}

