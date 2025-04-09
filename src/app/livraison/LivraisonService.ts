import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Livraison {
  id: number;
  statusLivraison: string;
  photo: string | null;
  reason: string | null;
  clientName?: string;
  address?: string;
  orderDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class LivraisonService {
  private apiUrl = 'http://localhost:8082/api/livraisons';

  constructor(private http: HttpClient) {}

  getAllLivraisons(): Observable<Livraison[]> {
    return this.http.get<Livraison[]>(`${this.apiUrl}/all`);
  }

  updateLivraison(id: number, livraison: Livraison): Observable<Livraison> {
    return this.http.put<Livraison>(`${this.apiUrl}/${id}`, livraison);
  }
}
