import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface RegisterRequest {
  name: string;
  phone: string;
  secret: string;
  email: string;
}

export interface ApiResponse {
  status: string;
  message: string;
}

export interface AvailableSlot {
  date: string;
  time: string;
}

export interface AvailableHoursResponse {
  availableTimes: AvailableSlot[];
}

export interface ScheduleRequest {
  services: number[];
  customer: number;
  barber: number;
  startTime: string;
  finishTime: string;
}

export interface BarberResult {
  barberId: number;
  barberName: string;
  barberLocation: string;
  barberCompany: string;
  barberLocationNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly BASE_URL = 'http://localhost:8080/manager-barbershop';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  register(data: RegisterRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.BASE_URL}/v1/customer`, data);
  }

  getAvailableHours(barberId: number): Observable<AvailableHoursResponse> {
    return this.http.get<AvailableHoursResponse>(
      `${this.BASE_URL}/v1/customer/available-hours/${barberId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  createSchedule(data: ScheduleRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.BASE_URL}/v1/customer/schedule/service`,
      data,
      { headers: this.getAuthHeaders() }
    );
  }
}