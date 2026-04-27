import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, DominioDTO, DescriptorDTO, VariableGlobalDTO } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class ConfiguracionService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getValDominio(dominio: string, referencia: string): Observable<ApiResponse<string>> {
    return this.http.get<ApiResponse<string>>(`${this.baseUrl}/dominios/${dominio}/${referencia}`);
  }

  getDomainValues(dominio: string): Observable<ApiResponse<DominioDTO[]>> {
    return this.http.get<ApiResponse<DominioDTO[]>>(`${this.baseUrl}/dominios/${dominio}`);
  }

  getDescriptor(tipo: string, codigo: string, ramo?: number, producto?: number): Observable<ApiResponse<DescriptorDTO>> {
    let params: any = {};
    if (ramo) { params.ramo = ramo; }
    if (producto) { params.producto = producto; }
    return this.http.get<ApiResponse<DescriptorDTO>>(`${this.baseUrl}/descriptores/${tipo}/${codigo}`, { params });
  }

  getVariablesGlobales(): Observable<ApiResponse<VariableGlobalDTO[]>> {
    return this.http.get<ApiResponse<VariableGlobalDTO[]>>(`${this.baseUrl}/variables-globales`);
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

  evaluatePicoPlaca(placa: string, locgeCodigo: number): Observable<ApiResponse<string>> {
    return this.http.get<ApiResponse<string>>(`${this.baseUrl}/pico-placa`, { params: { placa, locgeCodigo } });
  }
}
