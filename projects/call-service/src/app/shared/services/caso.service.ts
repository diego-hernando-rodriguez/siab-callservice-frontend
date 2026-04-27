import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse, LlamadaDTO, CasoRequestDTO, DominioDTO, Page,
  CausaDTO, ReclasificacionRequestDTO, ReclasificacionResponseDTO,
  ExcepcionDTO, CartaDTO, AcuerdoDTO
} from '../interfaces';

@Injectable({ providedIn: 'root' })
export class CasoService {
  private baseUrl = `${environment.apiBaseUrl}/casos`;

  constructor(private http: HttpClient) {}

  createCase(request: CasoRequestDTO): Observable<ApiResponse<LlamadaDTO>> {
    return this.http.post<ApiResponse<LlamadaDTO>>(this.baseUrl, request);
  }

  updateCase(numero: number, request: CasoRequestDTO): Observable<ApiResponse<LlamadaDTO>> {
    return this.http.put<ApiResponse<LlamadaDTO>>(`${this.baseUrl}/${numero}`, request);
  }

  getCaseDetails(numero: number): Observable<ApiResponse<LlamadaDTO>> {
    return this.http.get<ApiResponse<LlamadaDTO>>(`${this.baseUrl}/${numero}`);
  }

  searchCases(params: Record<string, any>, page = 0, size = 20): Observable<ApiResponse<Page<LlamadaDTO>>> {
    let httpParams = new HttpParams().set('page', page).set('size', size);
    Object.keys(params).forEach(key => {
      if (params[key] != null && params[key] !== '') {
        httpParams = httpParams.set(key, params[key]);
      }
    });
    return this.http.get<ApiResponse<Page<LlamadaDTO>>>(`${this.baseUrl}/buscar`, { params: httpParams });
  }

  lovCausas(ramo: number, producto: number): Observable<ApiResponse<CausaDTO[]>> {
    return this.http.get<ApiResponse<CausaDTO[]>>(`${this.baseUrl}/lov/causas`, { params: { ramo, producto } });
  }

  validateDuplicate(locgeCodigo: number, contNumero: string, riesgoCodigo: string): Observable<ApiResponse<boolean>> {
    const params = new HttpParams()
      .set('locgeCodigo', locgeCodigo)
      .set('contNumero', contNumero)
      .set('riesgoCodigo', riesgoCodigo);
    return this.http.get<ApiResponse<boolean>>(`${this.baseUrl}/validar-duplicado`, { params });
  }

  reclasificar(numero: number, request: ReclasificacionRequestDTO): Observable<ApiResponse<ReclasificacionResponseDTO>> {
    return this.http.post<ApiResponse<ReclasificacionResponseDTO>>(`${this.baseUrl}/${numero}/reclasificar`, request);
  }

  getExcepciones(numero: number): Observable<ApiResponse<ExcepcionDTO[]>> {
    return this.http.get<ApiResponse<ExcepcionDTO[]>>(`${this.baseUrl}/${numero}/excepciones`);
  }

  getCartas(numero: number): Observable<ApiResponse<CartaDTO[]>> {
    return this.http.get<ApiResponse<CartaDTO[]>>(`${this.baseUrl}/${numero}/cartas`);
  }

  getAcuerdos(numero: number): Observable<ApiResponse<AcuerdoDTO[]>> {
    return this.http.get<ApiResponse<AcuerdoDTO[]>>(`${this.baseUrl}/${numero}/acuerdos`);
  }

  lovUsuarios(query: string, page = 0): Observable<ApiResponse<Page<LlamadaDTO>>> {
    return this.http.get<ApiResponse<Page<LlamadaDTO>>>(`${this.baseUrl}/lov/usuarios`, { params: { query, page, size: 20 } });
  }

  lovRamos(): Observable<ApiResponse<DominioDTO[]>> {
    return this.http.get<ApiResponse<DominioDTO[]>>(`${this.baseUrl}/lov/ramos`);
  }

  lovProductos(ramo: number): Observable<ApiResponse<DominioDTO[]>> {
    return this.http.get<ApiResponse<DominioDTO[]>>(`${this.baseUrl}/lov/productos`, { params: { ramo } });
  }

  lovRazones(): Observable<ApiResponse<DominioDTO[]>> {
    return this.http.get<ApiResponse<DominioDTO[]>>(`${this.baseUrl}/lov/razones`);
  }
}
