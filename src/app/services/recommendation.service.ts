import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produit } from '../models/produit.model';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private apiUrl = 'http://localhost:8082/api/produits/recommendations/history';

  constructor(private http: HttpClient) {}

  getRecommendationsBasedOnHistory(userId: number, limit: number = 6): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}?userId=${userId}&limit=${limit}`);
  }
}