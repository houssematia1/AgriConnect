import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Reclamation {
  id: number;
  titre: string;
  description: string;
  type: 'URGENT' | 'CLASSIC' | 'SECONDARY' | 'FIRSTCLASS';
  don: { id: number }; // Maintain this exact structure
}

@Injectable({
  providedIn: 'root'
})
export class ReclamationService {
  private apiUrl = 'http://localhost:8085/reclamation';

  constructor(private http: HttpClient) { }

  getReclamationsByDon(donId: number): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(`${this.apiUrl}/don/${donId}`);
  }
  
// Remove the redundant don assignment
addReclamation(reclamation: Omit<Reclamation, 'id'>): Observable<Reclamation> {
  return this.http.post<Reclamation>(this.apiUrl, reclamation);
}

  updateReclamation(id: number, reclamation: Reclamation): Observable<Reclamation> {
    return this.http.put<Reclamation>(`${this.apiUrl}/${id}`, reclamation);
  }

  deleteReclamation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id  }`);
  }

  getAllReclamations(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(this.apiUrl);
  }
}