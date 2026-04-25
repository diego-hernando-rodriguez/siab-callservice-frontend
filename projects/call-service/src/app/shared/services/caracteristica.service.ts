import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, CaracteristicaCausaResponse, CaracteristicaCausaDTO } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class CaracteristicaService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  loadCharacteristics(numeroCaso: number, ramo: number, producto: number, causa: number): Observable<ApiResponse<CaracteristicaCausaResponse>> {
    const params = new HttpParams().set('ramo', ramo).set('producto', producto).set('causa', causa);
    return this.http.get<ApiResponse<CaracteristicaCausaResponse>>(`${this.baseUrl}/casos/${numeroCaso}/caracteristicas`, { params });
  }

  saveCharacteristics(numeroCaso: number, request: any): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/casos/${numeroCaso}/caracteristicas`, request);
  }

  autoFillCharacteristics(numeroCaso: number, params: any): Observable<ApiResponse<CaracteristicaCausaResponse>> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => { if (params[key] != null) httpParams = httpParams.set(key, params[key]); });
    return this.http.get<ApiResponse<CaracteristicaCausaResponse>>(`${this.baseUrl}/casos/${numeroCaso}/caracteristicas/auto-fill`, { params: httpParams });
  }

  getTypes(causaCodigo: number, ramo: number, producto: number): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/caracteristicas/tipos/${causaCodigo}`, { params: { ramo, producto } });
  }
}
