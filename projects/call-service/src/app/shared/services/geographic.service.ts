import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, LocalizacionDTO, GeocodificacionRequest, GeocodificacionResponse, CoordenadasDTO } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class GeographicService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  lovPaises(): Observable<ApiResponse<LocalizacionDTO[]>> {
    return this.http.get<ApiResponse<LocalizacionDTO[]>>(`${this.baseUrl}/localizaciones/lov/paises`);
  }

  searchCitiesByPais(pais: number, query: string): Observable<ApiResponse<LocalizacionDTO[]>> {
    const params = new HttpParams().set('pais', pais).set('query', query);
    return this.http.get<ApiResponse<LocalizacionDTO[]>>(`${this.baseUrl}/localizaciones/lov/ciudades`, { params });
  }

  getCityDetail(locgeCodigo: number): Observable<ApiResponse<LocalizacionDTO>> {
    return this.http.get<ApiResponse<LocalizacionDTO>>(`${this.baseUrl}/localizaciones/${locgeCodigo}/detalle`);
  }

  geocodeAddress(request: GeocodificacionRequest): Observable<ApiResponse<GeocodificacionResponse>> {
    return this.http.post<ApiResponse<GeocodificacionResponse>>(`${this.baseUrl}/direcciones/geocodificar`, request);
  }

  getCoordinates(locgeCodigo: number, direccion: string): Observable<ApiResponse<CoordenadasDTO>> {
    return this.http.get<ApiResponse<CoordenadasDTO>>(`${this.baseUrl}/direcciones/coordenadas`, { params: { locgeCodigo, direccion } });
  }
}
