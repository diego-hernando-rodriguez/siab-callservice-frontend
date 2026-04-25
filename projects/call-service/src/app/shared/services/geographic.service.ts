import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, LocalizacionDTO, GeocodificacionRequest, GeocodificacionResponse, CoordenadasDTO, Page } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class GeographicService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  searchCities(nombre?: string, pais?: string, page = 0, size = 20): Observable<ApiResponse<Page<LocalizacionDTO>>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (nombre) params = params.set('nombre', nombre);
    if (pais) params = params.set('pais', pais);
    return this.http.get<ApiResponse<Page<LocalizacionDTO>>>(`${this.baseUrl}/localizaciones`, { params });
  }

  getPais(codigo: number, tlgCodigo = 3): Observable<ApiResponse<string>> {
    return this.http.get<ApiResponse<string>>(`${this.baseUrl}/localizaciones/${codigo}/pais`, { params: { tlgCodigo } });
  }

  geocodeAddress(request: GeocodificacionRequest): Observable<ApiResponse<GeocodificacionResponse>> {
    return this.http.post<ApiResponse<GeocodificacionResponse>>(`${this.baseUrl}/direcciones/geocodificar`, request);
  }

  getCoordinates(locgeCodigo: number, direccion: string): Observable<ApiResponse<CoordenadasDTO>> {
    return this.http.get<ApiResponse<CoordenadasDTO>>(`${this.baseUrl}/direcciones/coordenadas`, { params: { locgeCodigo, direccion } });
  }
}
