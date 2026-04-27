import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, TarifaDTO, RutaIntermediaDTO } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class TarifaService {
  private baseUrl = `${environment.apiBaseUrl}/tarifas`;

  constructor(private http: HttpClient) {}

  calcularTarifa(llamadaNumero: number, numeroAutorizacion: number, servCodigo: number, clservCodigo: number): Observable<ApiResponse<TarifaDTO>> {
    const params = new HttpParams()
      .set('llamadaNumero', llamadaNumero)
      .set('numeroAutorizacion', numeroAutorizacion)
      .set('servCodigo', servCodigo)
      .set('clservCodigo', clservCodigo);
    return this.http.post<ApiResponse<TarifaDTO>>(`${this.baseUrl}/calcular`, null, { params });
  }

  getTarifas(llamadaNumero: number, numeroAutorizacion: number): Observable<ApiResponse<TarifaDTO[]>> {
    return this.http.get<ApiResponse<TarifaDTO[]>>(this.baseUrl, { params: { llamadaNumero, numeroAutorizacion } });
  }

  getRutas(llamadaNumero: number, numeroAutorizacion: number): Observable<ApiResponse<RutaIntermediaDTO[]>> {
    return this.http.get<ApiResponse<RutaIntermediaDTO[]>>(`${this.baseUrl}/rutas`, { params: { llamadaNumero, numeroAutorizacion } });
  }
}
