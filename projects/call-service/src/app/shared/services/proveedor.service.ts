import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, ProveedorDTO, CalificacionRequestDTO } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class ProveedorService {
  private baseUrl = `${environment.apiBaseUrl}/proveedores`;

  constructor(private http: HttpClient) {}

  buscarProveedores(servCodigo: number, clservCodigo: number, locgeCodigo: number): Observable<ApiResponse<ProveedorDTO[]>> {
    return this.http.get<ApiResponse<ProveedorDTO[]>>(`${this.baseUrl}/buscar`, { params: { servCodigo, clservCodigo, locgeCodigo } });
  }

  calificarProveedor(consecutivoPunto: number, calificacion: CalificacionRequestDTO): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/${consecutivoPunto}/calificacion`, calificacion);
  }
}
