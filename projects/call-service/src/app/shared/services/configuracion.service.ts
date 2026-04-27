import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, DominioDTO, DescriptorDTO } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class ConfiguracionService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getDomainValues(dominio: string): Observable<ApiResponse<DominioDTO[]>> {
    return this.http.get<ApiResponse<DominioDTO[]>>(`${this.baseUrl}/dominios/${dominio}`);
  }

  lovTiposDocumento(): Observable<ApiResponse<DominioDTO[]>> {
    return this.http.get<ApiResponse<DominioDTO[]>>(`${this.baseUrl}/dominios/lov/tipos-documento`);
  }

  lovLineasNegocio(): Observable<ApiResponse<DominioDTO[]>> {
    return this.http.get<ApiResponse<DominioDTO[]>>(`${this.baseUrl}/dominios/lov/lineas-negocio`);
  }

  lovSeveridadEvento(): Observable<ApiResponse<DominioDTO[]>> {
    return this.http.get<ApiResponse<DominioDTO[]>>(`${this.baseUrl}/dominios/lov/severidad-evento`);
  }

  getDescriptor(tipo: string, codigo: string, ramo?: string): Observable<ApiResponse<DescriptorDTO>> {
    const params: any = {};
    if (ramo) { params.ramo = ramo; }
    return this.http.get<ApiResponse<DescriptorDTO>>(`${this.baseUrl}/descriptores/${tipo}/${codigo}`, { params });
  }

  evaluatePicoPlaca(placa: string, locgeCodigo: number): Observable<ApiResponse<string>> {
    return this.http.get<ApiResponse<string>>(`${this.baseUrl}/pico-placa`, { params: { placa, locgeCodigo } });
  }
}
