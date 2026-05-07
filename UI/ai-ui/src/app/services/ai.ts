import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Ai {
  private apiUrl = '/ai/chat'; // Spring Boot endpoint

  constructor(private http: HttpClient) {}

  sendMessage(userMessage: string): Observable<any> {
    return this.http.post(this.apiUrl, { userMessage });
  }
}
