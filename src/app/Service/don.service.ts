// don.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8085/don';

@Injectable({
  providedIn: 'root'
})
export class DonService {
  constructor(private http: HttpClient) { }

  getAllDons(): Observable<any> {
    return this.http.get(API_URL);
  }

  createDon(don: any): Observable<any> {
    return this.http.post(API_URL, don);
  }

  updateDon(id: number, don: any): Observable<any> {
    return this.http.put(`${API_URL}/${id}`, don);
  }

  deleteDon(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/${id}`);
  }
}