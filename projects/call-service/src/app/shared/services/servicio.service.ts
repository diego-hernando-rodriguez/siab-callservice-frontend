import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse, ServicioResponseDTO, ServicioRequestDTO,
  IngresoDTO, AdicionalDTO, CitaDTO, InfoServicioDTO
} from '../interfaces';

@Injectable({ providedIn: 'root' })
export class ServicioService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  createServicio(numeroCaso: number, request: ServicioRequestDTO): Observable<ApiResponse<ServicioResponseDTO>> {
    return this.http.post<ApiResponse<ServicioResponseDTO>>(`${this.baseUrl}/casos/${numeroCaso}/servicios`, request);
  }

  getServicios(numeroCaso: number): Observable<ApiResponse<ServicioResponseDTO[]>> {
    return this.http.get<ApiResponse<ServicioResponseDTO[]>>(`${this.baseUrl}/casos/${numeroCaso}/servicios`);
  }

  updateServicio(numeroAutorizacion: number, request: ServicioRequestDTO): Observable<ApiResponse<ServicioResponseDTO>> {
    return this.http.put<ApiResponse<ServicioResponseDTO>>(`${this.baseUrl}/servicios/${numeroAutorizacion}`, request);
  }

  cancelServicio(numeroAutorizacion: number, motivo?: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/servicios/${numeroAutorizacion}`, { params: motivo ? { motivo } : {} });
  }

  asignarProveedor(numeroAutorizacion: number, consecutivoPunto: number): Observable<ApiResponse<ServicioResponseDTO>> {
    return this.http.post<ApiResponse<ServicioResponseDTO>>(
      `${this.baseUrl}/servicios/${numeroAutorizacion}/proveedor`, null, { params: { consecutivoPunto } }
    );
  }

  getIngresos(numeroAutorizacion: number): Observable<ApiResponse<IngresoDTO[]>> {
    return this.http.get<ApiResponse<IngresoDTO[]>>(`${this.baseUrl}/servicios/${numeroAutorizacion}/ingresos`);
  }

  createIngreso(numeroAutorizacion: number, request: Partial<IngresoDTO>): Observable<ApiResponse<IngresoDTO>> {
    return this.http.post<ApiResponse<IngresoDTO>>(`${this.baseUrl}/servicios/${numeroAutorizacion}/ingresos`, request);
  }

  getAdicionales(numeroAutorizacion: number): Observable<ApiResponse<AdicionalDTO[]>> {
    return this.http.get<ApiResponse<AdicionalDTO[]>>(`${this.baseUrl}/servicios/${numeroAutorizacion}/adicionales`);
  }

  createAdicional(numeroAutorizacion: number, request: Partial<AdicionalDTO>): Observable<ApiResponse<AdicionalDTO>> {
    return this.http.post<ApiResponse<AdicionalDTO>>(`${this.baseUrl}/servicios/${numeroAutorizacion}/adicionales`, request);
  }

  getCitas(numeroAutorizacion: number): Observable<ApiResponse<CitaDTO[]>> {
    return this.http.get<ApiResponse<CitaDTO[]>>(`${this.baseUrl}/servicios/${numeroAutorizacion}/citas`);
  }

  createCita(numeroAutorizacion: number, request: Partial<CitaDTO>): Observable<ApiResponse<CitaDTO>> {
    return this.http.post<ApiResponse<CitaDTO>>(`${this.baseUrl}/servicios/${numeroAutorizacion}/citas`, request);
  }

  updateCita(numeroAutorizacion: number, citaId: number, request: Partial<CitaDTO>): Observable<ApiResponse<CitaDTO>> {
    return this.http.put<ApiResponse<CitaDTO>>(`${this.baseUrl}/servicios/${numeroAutorizacion}/citas/${citaId}`, request);
  }

  getInfoServicio(numeroAutorizacion: number): Observable<ApiResponse<InfoServicioDTO[]>> {
    return this.http.get<ApiResponse<InfoServicioDTO[]>>(`${this.baseUrl}/servicios/${numeroAutorizacion}/informacion`);
  }

  saveInfoServicio(numeroAutorizacion: number, info: InfoServicioDTO[]): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/servicios/${numeroAutorizacion}/informacion`, info);
  }
}
