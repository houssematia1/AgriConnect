import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { produit } from './produit.model';

@Injectable({ providedIn: 'root' })
export class produitService {
  private url = 'http://localhost:8082/api/produits';
  apiUrl: any;

  constructor(private http: HttpClient) {}

  getProduits(): Observable<produit[]> {
    return this.http.get<produit[]>(this.url);
  }

  ajouterProduit(produit: produit) {
    return this.http.post(`${this.apiUrl}`, produit);
  }
  

  updateProduit(produit: produit) {
    return this.http.put(`${this.apiUrl}/${produit.id}`, produit);
  }
  

  deleteProduit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
