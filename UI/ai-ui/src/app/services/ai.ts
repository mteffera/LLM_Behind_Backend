import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Ai {

  private apiUrl = 'http://localhost:8080/ai/chat';
  private healthUrl = 'http://localhost:8080/ai/health';

  constructor(private http: HttpClient) {}

  sendMessage(userMessage: string): Observable<any> {
    return this.http.post(this.apiUrl, { userMessage });
  }

  checkHealth(): Observable<any> {
    return this.http.get(this.healthUrl);
  }
}
