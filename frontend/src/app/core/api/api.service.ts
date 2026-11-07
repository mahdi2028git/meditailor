import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: string;
  category: string;
  name: Record<string, string>;
  description: Record<string, string>;
  tags: Record<string, string[]>;
  emoji: string;
  colors?: string[];
  sizes?: string[];
}

export interface SiteStats {
  years_experience: number;
  hospital_clients: number;
  units_per_month: number;
}

export interface ContactPayload {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  product?: string;
  message: string;
  language?: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  id: string;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api';

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products`);
  }

  getStats(): Observable<SiteStats> {
    return this.http.get<SiteStats>(`${this.baseUrl}/stats`);
  }

  submitContact(payload: ContactPayload): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(`${this.baseUrl}/contact`, payload);
  }
}
