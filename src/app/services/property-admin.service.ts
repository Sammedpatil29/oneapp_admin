import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PropertyItem {
  id: string;
  category: 'buy_house' | 'rent_house' | 'buy_land' | 'buy_plot' | string;
  propertyType: string;
  title: string;
  price: number;
  priceDisplay?: string;
  priceUnit?: string;
  pricePerSqFt?: string;
  emiEstimate?: string;
  securityDeposit?: number;
  maintenancePerMonth?: number;
  locality: string;
  city: string;
  fullAddress: string;
  lat?: number;
  lng?: number;
  coordinates?: { lat: number; lng: number };
  images: string[];
  videoUrl?: string;
  bedrooms?: number;
  bathrooms?: number;
  balconies?: number;
  carpetAreaSqFt?: number;
  superBuiltUpAreaSqFt?: number;
  totalAcres?: number;
  facing?: string;
  furnishing?: string;
  possessionStatus?: string;
  ageOfProperty?: string;
  floor?: string;
  parking?: string;
  waterSupply?: string;
  tags?: string[];
  description?: string;
  amenities?: string[];
  nearbyLandmarks?: Array<{ name: string; distance: string; type: string }>;
  seller: {
    name: string;
    type: 'Owner' | 'Broker' | 'Builder' | string;
    phone: string;
    whatsapp: string;
    verified?: boolean;
    responseRate?: string;
    avatar?: string;
  };
  legalChecks?: Array<{
    title: string;
    category: string;
    status: 'clear' | 'pending' | string;
    statusLabel: string;
    details: string;
  }>;
  isFavorite?: boolean;
  is_active?: boolean;
  is_verified?: boolean;
  status: 'pending_verification' | 'approved' | 'sold' | 'closed' | 'rejected' | string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PropertyAdminService {
  private apiUrl = `${environment.apiUrl}/api/properties`;

  constructor(private http: HttpClient) {}

  getAllProperties(filters: { [key: string]: any } = {}): Observable<{ success: boolean; count: number; data: PropertyItem[] }> {
    let params = new HttpParams().set('status', filters['status'] || 'all');

    if (filters['category'] && filters['category'] !== 'all') {
      params = params.set('category', filters['category']);
    }
    if (filters['search']) {
      params = params.set('search', filters['search']);
    }
    if (filters['city'] && filters['city'] !== 'all') {
      params = params.set('city', filters['city']);
    }
    if (filters['sortBy']) {
      params = params.set('sortBy', filters['sortBy']);
    }

    return this.http.get<{ success: boolean; count: number; data: PropertyItem[] }>(this.apiUrl, { params });
  }

  getPropertyById(id: string): Observable<{ success: boolean; data: PropertyItem }> {
    return this.http.get<{ success: boolean; data: PropertyItem }>(`${this.apiUrl}/${id}`);
  }

  createProperty(propertyData: Partial<PropertyItem>): Observable<{ success: boolean; message: string; data: PropertyItem }> {
    return this.http.post<{ success: boolean; message: string; data: PropertyItem }>(this.apiUrl, propertyData);
  }

  updateProperty(id: string, propertyData: Partial<PropertyItem>): Observable<{ success: boolean; message: string; data: PropertyItem }> {
    return this.http.put<{ success: boolean; message: string; data: PropertyItem }>(`${this.apiUrl}/${id}`, propertyData);
  }

  deleteProperty(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }

  updateStatus(id: string, status: string): Observable<{ success: boolean; message: string; data: PropertyItem }> {
    return this.http.put<{ success: boolean; message: string; data: PropertyItem }>(`${this.apiUrl}/${id}`, { status });
  }

  toggleVerified(id: string, is_verified: boolean): Observable<{ success: boolean; message: string; data: PropertyItem }> {
    return this.http.put<{ success: boolean; message: string; data: PropertyItem }>(`${this.apiUrl}/${id}`, { is_verified });
  }
}

