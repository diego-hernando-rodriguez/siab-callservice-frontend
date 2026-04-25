import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, ProveedorDTO, CalificacionProveedorDTO } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class ProveedorService {
  private baseUrl = `${environment.apiBaseUrl}/proveedores`;

  constructor(private http: HttpClient) {}

  searchProviders(servCodigo: number, clservCodigo: number, locgeCodigo: number): Observable<ApiResponse<ProveedorDTO[]>> {
    return this.http.get<ApiResponse<ProveedorDTO[]>>(`${this.baseUrl}/buscar`, { params: { servCodigo, clservCodigo, locgeCodigo } });
  }

  assignProvider(id: number, numeroAutorizacion: number, llamadaNumero: number): Observable<ApiResponse<ProveedorDTO>> {
    return this.http.post<ApiResponse<ProveedorDTO>>(`${this.baseUrl}/${id}/asignar`, null, { params: { numeroAutorizacion, llamadaNumero } });
  }

  rateProvider(id: number, calificacion: CalificacionProveedorDTO): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/${id}/calificar`, calificacion);
  }
}
