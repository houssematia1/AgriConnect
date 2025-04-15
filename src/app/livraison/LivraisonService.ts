import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Livraison {
  id: number;
  statut: string;
  clientNom: string;
  photo?: string | null;
  reason?: string | null;
  address?: string;
  telephone?: string;
  orderDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class LivraisonService {
  private apiUrl = 'http://localhost:8082/api/commandes';

  constructor(private http: HttpClient) {}

  getAllLivraisons(): Observable<Livraison[]> {
    console.log('Making API call to:', this.apiUrl);
    return this.http.get<Livraison[]>(this.apiUrl).pipe(
      tap({
        next: (data) => console.log('API Response:', data),
        error: (error) => console.error('API Error:', error)
      })
    );
  }

  updateLivraison(id: number, livraison: Livraison): Observable<Livraison> {
    return this.http.put<Livraison>(`${this.apiUrl}/${id}`, livraison);
  }
}
