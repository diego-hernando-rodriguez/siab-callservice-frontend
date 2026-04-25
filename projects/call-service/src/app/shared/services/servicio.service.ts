import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, ServicioPrestadoDTO, IngresoDTO } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class ServicioService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  createService(numeroCaso: number, request: any): Observable<ApiResponse<ServicioPrestadoDTO>> {
    return this.http.post<ApiResponse<ServicioPrestadoDTO>>(`${this.baseUrl}/casos/${numeroCaso}/servicios`, request);
  }

  updateService(numeroAutorizacion: number, request: any): Observable<ApiResponse<ServicioPrestadoDTO>> {
    return this.http.put<ApiResponse<ServicioPrestadoDTO>>(`${this.baseUrl}/servicios/${numeroAutorizacion}`, request);
  }

  listServices(numeroCaso: number): Observable<ApiResponse<ServicioPrestadoDTO[]>> {
    return this.http.get<ApiResponse<ServicioPrestadoDTO[]>>(`${this.baseUrl}/casos/${numeroCaso}/servicios`);
  }

  cancelService(numeroAutorizacion: number, motivo?: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/servicios/${numeroAutorizacion}`, { params: motivo ? { motivo } : {} });
  }

  assignProvider(numeroAutorizacion: number, consecutivoPunto: number): Observable<ApiResponse<ServicioPrestadoDTO>> {
    return this.http.post<ApiResponse<ServicioPrestadoDTO>>(`${this.baseUrl}/servicios/${numeroAutorizacion}/proveedor`, null, { params: { consecutivoPunto } });
  }

  getIncomes(numeroAutorizacion: number): Observable<ApiResponse<IngresoDTO[]>> {
    return this.http.get<ApiResponse<IngresoDTO[]>>(`${this.baseUrl}/servicios/${numeroAutorizacion}/ingresos`);
  }

  createIncome(numeroAutorizacion: number, request: any): Observable<ApiResponse<IngresoDTO>> {
    return this.http.post<ApiResponse<IngresoDTO>>(`${this.baseUrl}/servicios/${numeroAutorizacion}/ingresos`, request);
  }
}
