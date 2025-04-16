import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuditLog } from 'src/app/audit-log.model';


export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  numeroDeTelephone: string;
  role: string;
  adresseLivraison?: string;
  isBlocked: boolean;
  risk_score?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8082/api/users';
  private authUrl = 'http://localhost:8082/api/auth';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  registerUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.authUrl}/login`, credentials, { responseType: 'json' });
  }
  
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user);
  }

  searchUsers(query: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/search?query=${encodeURIComponent(query)}`);
  }
  blockUser(id: number, block: boolean): Observable<any> {
    const url = block
      ? `${this.apiUrl}/block/${id}`
      : `${this.apiUrl}/unblock/${id}`;
    return this.http.put(url, {});
  
  }
  verifyAccount(email: string, code: string) {
    return this.http.post('http://localhost:8082/api/users/verify', null, {
      params: { email, code },
      responseType: 'text'
    });
  }
  getAuditLogs(): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>('http://localhost:8082/api/audit-logs');
  }
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.authUrl}/request-password-reset`, null, {
      params: { email },
      responseType: 'text'
    });
  }
  
  resetPassword(email: string, code: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.authUrl}/reset-password`, null, {
      params: { email, code, newPassword },
      responseType: 'text'
    });
  }
  getRiskScore(id: number): Observable<any> {
    return this.http.get(`http://localhost:8082/api/users/predict/${id}`);
  }
}
