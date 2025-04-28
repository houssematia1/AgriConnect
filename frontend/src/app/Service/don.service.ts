// src/app/Service/don.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type Status = 'PENDING' | 'ACCEPTE' | 'REFUSE';
export type TypeDon = 'MONETAIRE' | 'PRODUIT';

export interface Don {
  id: number;
  titre: string;
  description: string;
  montant?: number;
  quantite?: number;
  status: Status;
  typeDon: TypeDon;
}

const API_URL = 'http://localhost:8085/don';

@Injectable({ providedIn: 'root' })
export class DonService {
  constructor(private http: HttpClient) { }

  getAllDons(): Observable<Don[]> {
    return this.http.get<Don[]>(API_URL);
  }

  createDon(don: Omit<Don, 'id'>): Observable<Don> {
    return this.http.post<Don>(API_URL, don);
  }

  updateDon(id: number, don: Partial<Don>): Observable<Don> {
    return this.http.put<Don>(`${API_URL}/${id}`, don);
  }

  deleteDon(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}
