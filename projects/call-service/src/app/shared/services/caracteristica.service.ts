import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, CaracteristicaCausaDTO, CaracteristicaCausaResponse } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class CaracteristicaService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getCamposPorCausa(causaCodigo: number, ramoCodigo: string, productoCodigo: string): Observable<ApiResponse<CaracteristicaCausaDTO[]>> {
    const params = new HttpParams().set('ramoCodigo', ramoCodigo).set('productoCodigo', productoCodigo);
    return this.http.get<ApiResponse<CaracteristicaCausaDTO[]>>(`${this.baseUrl}/caracteristicas/causa/${causaCodigo}`, { params });
  }

  getValoresCaso(numeroCaso: number): Observable<ApiResponse<CaracteristicaCausaResponse>> {
    return this.http.get<ApiResponse<CaracteristicaCausaResponse>>(`${this.baseUrl}/caracteristicas/caso/${numeroCaso}`);
  }

  guardarValores(numeroCaso: number, valores: CaracteristicaCausaDTO[]): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/caracteristicas/caso/${numeroCaso}`, valores);
  }
}
