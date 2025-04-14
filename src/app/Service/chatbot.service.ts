import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChatbotService {
    private apiUrl = 'http://localhost:8085/api/gpt/ask'; // Changed port to 8089

    constructor(private http: HttpClient) { }

    getResponse(userInput: string): Observable<string> {
        return this.http.post(
            this.apiUrl, 
            { message: userInput },
            {
                responseType: 'text'  // Explicitly expect text response
            }
        ).pipe(
            map(response => response || ''),
            catchError(error => {
                console.error('API Error:', error);
                return throwError(() => new Error('Something went wrong. Please try again.'));
            })
        );
    }
}