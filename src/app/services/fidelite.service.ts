import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { Fidelite } from '../models/fidelite';
import { User } from '../models/user';
import { PointsTransaction } from '../models/points-transaction';

@Injectable({
  providedIn: 'root'
})
export class FideliteService {
  private apiUrl = 'http://localhost:8082/api/fidelite';
  private userApiUrl = 'http://localhost:8082/api/users'; // New base URL for user-related endpoints

  // Basic Auth credentials
  private username = 'admin';
  private password = 'adminpass';
  private authHeader = 'Basic ' + btoa(`${this.username}:${this.password}`);

  // Default headers with Basic Auth
  private headers = new HttpHeaders({
    'Authorization': this.authHeader,
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {}

  // CRUD Operations
  getAllFidelites(): Observable<Fidelite[]> {
    return this.http.get<Fidelite[]>(this.apiUrl, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  getFideliteById(id: number): Observable<Fidelite> {
    return this.http.get<Fidelite>(`${this.apiUrl}/${id}`, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  saveFidelite(fidelite: Fidelite): Observable<Fidelite> {
    return this.http.post<Fidelite>(this.apiUrl, fidelite, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  updateFidelite(id: number, fidelite: Fidelite): Observable<Fidelite> {
    return this.http.put<Fidelite>(`${this.apiUrl}/${id}`, fidelite, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  deleteFidelite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Fetch All Users
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Fetch User by ID
  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.userApiUrl}/${userId}`, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Fetch All Transactions
  getAllTransactions(): Observable<PointsTransaction[]> {
    return this.http.get<PointsTransaction[]>(`${this.apiUrl}/transactions`, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Points Management
  ajouterPoints(userId: number, points: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/ajouter-points`, null, {
      headers: this.headers,
      params: { userId: userId.toString(), points: points.toString() }
    }).pipe(
      catchError(this.handleError)
    );
  }

  ajouterPointsFidelite(userId: number, points: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/ajouter-points-fidelite`, null, {
      headers: this.headers,
      params: { userId: userId.toString(), points: points.toString() }
    }).pipe(
      catchError(this.handleError)
    );
  }

  appliquerPromotionFidelite(userId: number, montantAchat: number): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/appliquer-promotion`, null, {
      headers: this.headers,
      params: { userId: userId.toString(), montantAchat: montantAchat.toString() }
    }).pipe(
      catchError(this.handleError)
    );
  }

  recompensePointsFidelite(userId: number, montantAchat: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/recompense-points`, null, {
      headers: this.headers,
      params: { userId: userId.toString(), montantAchat: montantAchat.toString() }
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Transaction History
  getTransactionHistory(userId: number): Observable<PointsTransaction[]> {
    return this.http.get<PointsTransaction[]>(`${this.apiUrl}/transactions/${userId}`, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/historique/${id}`, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Points Expiration
  expirePoints(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/expire-points`, null, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Award Birthday Points
  awardBirthdayPoints(): Observable<void> {
    return new Observable<void>(observer => {
      this.getAllFidelites().pipe(
        switchMap(fidelites => {
          const today = new Date();
          const todayMonth = today.getMonth() + 1; // getMonth is 0-based
          const todayDay = today.getDate();
          const todayYear = today.getFullYear();

          // Filter fidelities where it's the user's birthday
          const birthdayFidelites = fidelites.filter(fidelite => {
            if (!fidelite.user || !fidelite.user.dateOfBirth) return false;
            const birthDate = new Date(fidelite.user.dateOfBirth);
            const birthMonth = birthDate.getMonth() + 1;
            const birthDay = birthDate.getDate();
            return birthMonth === todayMonth && birthDay === todayDay;
          });

          if (birthdayFidelites.length === 0) {
            return of(null);
          }

          // Process each birthday fidelite
          let completed = 0;
          birthdayFidelites.forEach(fidelite => {
            if (!fidelite.id || !fidelite.user || !fidelite.user.id) {
              completed++;
              if (completed === birthdayFidelites.length) {
                observer.next();
                observer.complete();
              }
              return;
            }

            // Check if a birthday bonus was already awarded today
            this.getTransactionHistory(fidelite.user.id).pipe(
              map(transactions => {
                const todayStart = new Date(todayYear, today.getMonth(), today.getDate(), 0, 0, 0);
                const todayEnd = new Date(todayYear, today.getMonth(), today.getDate(), 23, 59, 59);
                return transactions.some(transaction => {
                  const transactionDate = new Date(transaction.transactionDate); // Updated to transactionDate
                  return transaction.description === 'Bonus d\'anniversaire' &&
                         transactionDate >= todayStart &&
                         transactionDate <= todayEnd;
                });
              }),
              catchError(err => {
                console.error('Erreur lors de la vérification des transactions :', err);
                return of(false); // Proceed if we can't check transactions
              })
            ).subscribe(hasBirthdayBonus => {
              if (hasBirthdayBonus) {
                completed++;
                if (completed === birthdayFidelites.length) {
                  observer.next();
                  observer.complete();
                }
                return;
              }

              // Add 50 points
              fidelite.points += 50;
              fidelite.lastUpdated = new Date();

              // Update the fidelite
              this.updateFidelite(fidelite.id!, fidelite).subscribe({
                next: () => {
                  // Create a transaction to log the birthday bonus
                  const transaction: PointsTransaction = {
                    id: undefined,
                    user: fidelite.user,
                    points: 50,
                    description: 'Bonus d\'anniversaire',
                    transactionDate: new Date()
                  };
              
                  this.http.post<PointsTransaction>(`${this.apiUrl}/transactions`, transaction, { headers: this.headers }).subscribe({
                    next: () => {
                      completed++;
                      if (completed === birthdayFidelites.length) {
                        observer.next();
                        observer.complete();
                      }
                    },
                    error: (err) => {
                      console.error('Erreur lors de la création de la transaction d\'anniversaire :', err);
                      completed++;
                      if (completed === birthdayFidelites.length) {
                        observer.next();
                        observer.complete();
                      }
                    }
                  });
                },
                error: (err) => {
                  console.error('Erreur lors de la mise à jour de la fidélité pour l\'anniversaire :', err);
                  completed++;
                  if (completed === birthdayFidelites.length) {
                    observer.next();
                    observer.complete();
                  }
                }
              });
            });
          });

          return of(null);
        })
      ).subscribe({
        error: (err) => {
          console.error('Erreur lors de la récupération des fidélités pour l\'anniversaire :', err);
          observer.error(err);
        }
      });
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401) {
      console.error('Erreur d\'authentification : identifiants incorrects ou non fournis.');
      return throwError(() => new Error('Erreur d\'authentification : veuillez vérifier vos identifiants.'));
    }
    console.error('Erreur lors de la requête :', error);
    return throwError(() => new Error(error.message || 'Erreur serveur'));
  }
}