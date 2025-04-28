import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define and export interfaces
export interface Reclamation {
  id: number;
  titre: string;
  description: string;
  type: 'URGENT' | 'CLASSIC' | 'SECONDARY' | 'FIRSTCLASS';
  don?: { id: number };
  imageUrl?: string;
}

export interface Don {
  id: number;
  titre: string; // Assuming each don has a title for display
}

@Injectable({ providedIn: 'root' })
export class ReclamationService {
  private apiUrl = 'http://localhost:8085/reclamation';
  private donApiUrl = 'http://localhost:8085/don'; // Endpoint to fetch all dons

  constructor(private http: HttpClient) {}

  getAllReclamations(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(this.apiUrl);
  }

  getAllDons(): Observable<Don[]> {
    return this.http.get<Don[]>(this.donApiUrl);
  }

  addReclamation(data: FormData): Observable<Reclamation> {
    return this.http.post<Reclamation>(this.apiUrl, data);
  }

  updateReclamation(id: number, data: FormData): Observable<Reclamation> {
    return this.http.put<Reclamation>(`${this.apiUrl}/${id}`, data);
  }

  deleteReclamation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  assignReclamationToDon(reclamationId: number, donId: number): Observable<Reclamation> {
    return this.http.post<Reclamation>(`${this.apiUrl}/assign/${reclamationId}/to/${donId}`, {});
  }
}