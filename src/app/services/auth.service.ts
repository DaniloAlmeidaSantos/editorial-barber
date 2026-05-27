import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CustomerLoginRequest {
  email: string;
  password: string;
}

export interface JwtResponse {
  token: string;
  expirationTime: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly BASE_URL = 'http://localhost:8080/manager-barbershop';

  constructor(private http: HttpClient) {}

  customerLogin(credentials: CustomerLoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(
      `${this.BASE_URL}/auth/customer/login`,
      credentials
    );
  }

  saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  logout(): void {
    localStorage.removeItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
