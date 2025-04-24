// src/app/services/fidelite.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fidelite, User } from '../models/fidelite';

interface Transaction {
  id: number;
  userId: number;
  points: number;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class FideliteService {
  private apiUrl = 'http://localhost:8080/api/fidelite';

  constructor(private http: HttpClient) {}

  getAllFidelites(): Observable<Fidelite[]> {
    return this.http.get<Fidelite[]>(this.apiUrl);
  }

  ajouterPoints(userId: number, points: number): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/add-points`, { userId, points });
  }

  appliquerPromotion(userId: number, montantAchat: number): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/apply-promotion`, { userId, montantAchat });
  }

  deleteFidelite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  expirePoints(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/expire-points`, {});
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions`);
  }
}