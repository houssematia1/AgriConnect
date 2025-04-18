import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produit } from '../models/produit.model';

@Injectable({ providedIn: 'root' })
export class ProduitService {
  private baseUrl = 'http://localhost:8082/api/produits';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> { // Use 'any' for paginated response
    return this.http.get<any>(this.baseUrl);
  }

  getById(id: number): Observable<Produit> {
    return this.http.get<Produit>(`${this.baseUrl}/${id}`);
  }

  create(produit: Produit): Observable<Produit> {
    return this.http.post<Produit>(this.baseUrl, produit);
  }

  createWithImage(formData: FormData): Observable<Produit> {
    return this.http.post<Produit>(`${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
  }

  update(id: number, produit: Produit): Observable<Produit> {
    return this.http.put<Produit>(`${this.baseUrl}/${id}`, produit);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}