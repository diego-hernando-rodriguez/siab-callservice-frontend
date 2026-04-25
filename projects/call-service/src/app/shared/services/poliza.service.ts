import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, RiesgoBusquedaResponse, RiesgoAseguradoDTO, PolizaValidacionDTO } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class PolizaService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  searchRisks(valor: string): Observable<ApiResponse<RiesgoBusquedaResponse>> {
    return this.http.get<ApiResponse<RiesgoBusquedaResponse>>(`${this.baseUrl}/riesgos/buscar`, { params: { valor } });
  }

  createRisk(contNumero: string, riesgoCodigo: string, codigoCampo: number, valor: string): Observable<ApiResponse<RiesgoAseguradoDTO>> {
    const params = new HttpParams().set('contNumero', contNumero).set('riesgoCodigo', riesgoCodigo)
      .set('codigoCampo', codigoCampo).set('valor', valor);
    return this.http.post<ApiResponse<RiesgoAseguradoDTO>>(`${this.baseUrl}/riesgos`, null, { params });
  }

  validatePolicy(contrato: string): Observable<ApiResponse<PolizaValidacionDTO>> {
    return this.http.get<ApiResponse<PolizaValidacionDTO>>(`${this.baseUrl}/polizas/${contrato}/validar`);
  }
}
