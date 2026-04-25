import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, LlamadaDTO, CasoRequest, Page } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class CasoService {
  private baseUrl = `${environment.apiBaseUrl}/casos`;

  constructor(private http: HttpClient) {}

  createCase(request: CasoRequest): Observable<ApiResponse<LlamadaDTO>> {
    return this.http.post<ApiResponse<LlamadaDTO>>(this.baseUrl, request);
  }

  updateCase(numero: number, request: CasoRequest): Observable<ApiResponse<LlamadaDTO>> {
    return this.http.put<ApiResponse<LlamadaDTO>>(`${this.baseUrl}/${numero}`, request);
  }

  getCaseDetails(numero: number): Observable<ApiResponse<LlamadaDTO>> {
    return this.http.get<ApiResponse<LlamadaDTO>>(`${this.baseUrl}/${numero}`);
  }

  searchCases(params: any, page = 0, size = 20): Observable<ApiResponse<Page<LlamadaDTO>>> {
    let httpParams = new HttpParams().set('page', page).set('size', size);
    Object.keys(params).forEach(key => { if (params[key]) httpParams = httpParams.set(key, params[key]); });
    return this.http.get<ApiResponse<Page<LlamadaDTO>>>(`${this.baseUrl}/buscar`, { params: httpParams });
  }

  reclassifyCase(numero: number, request: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/${numero}/reclasificar`, request);
  }

  validateDuplicate(locgeCodigo: number, contNumero: string, riesgoCodigo: string): Observable<ApiResponse<boolean>> {
    const params = new HttpParams().set('locgeCodigo', locgeCodigo).set('contNumero', contNumero).set('riesgoCodigo', riesgoCodigo);
    return this.http.get<ApiResponse<boolean>>(`${this.baseUrl}/validar-duplicado`, { params });
  }

  lovContratos(query: string, page = 0): Observable<ApiResponse<Page<LlamadaDTO>>> {
    return this.http.get<ApiResponse<Page<LlamadaDTO>>>(`${this.baseUrl}/lov/contratos`, { params: { query, page, size: 20 } });
  }

  lovUsuarios(query: string, page = 0): Observable<ApiResponse<Page<LlamadaDTO>>> {
    return this.http.get<ApiResponse<Page<LlamadaDTO>>>(`${this.baseUrl}/lov/usuarios`, { params: { query, page, size: 20 } });
  }
}
