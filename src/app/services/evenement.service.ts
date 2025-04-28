import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EvenementService {
  private baseUrl = 'http://localhost:8082/api/evenements';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  uploadImage(formData: FormData): Observable<string> {
    return this.http.post('http://localhost:8082/api/evenements/upload', formData, {
      responseType: 'text' // ✅ c’est la ligne clé
    });
  }
  resumeEvenement(id: number) {
    return this.http.post<{ summary: string }>(`http://localhost:8082/api/evenements/${id}/resume`, {});
  }
  
}
