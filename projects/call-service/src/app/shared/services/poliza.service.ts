import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, RiesgoBusquedaResponse, RiesgoAseguradoDTO, PolizaValidacionDTO, CampoBusquedaDTO } from '../interfaces';

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

  getDatosContrato(contNumeroContrato: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/riesgos/datos-contrato`,
      { params: { contNumeroContrato } });
  }

  getCamposBusqueda(ramo?: string, producto?: string): Observable<ApiResponse<CampoBusquedaDTO[]>> {
    let params: any = {};
    if (ramo) { params.ramo = ramo; }
    if (producto) { params.producto = producto; }
    return this.http.get<ApiResponse<CampoBusquedaDTO[]>>(`${this.baseUrl}/riesgos/campos-busqueda`, { params });
  }

  getProductosConsulta(valor: string, codigoCampo: number, pais: number, ramo?: string, producto?: string): Observable<ApiResponse<any[]>> {
    let params: any = { valor, codigoCampo, pais };
    if (ramo) { params.ramo = ramo; }
    if (producto) { params.producto = producto; }
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/polizas/lov/productos`, { params });
  }

  getRiesgosCedula(ramo2: string, producto2: string, valor: string, pais: number, ramo?: string, producto?: string): Observable<ApiResponse<any[]>> {
    let params: any = { ramo2, producto2, valor, pais };
    if (ramo) { params.ramo = ramo; }
    if (producto) { params.producto = producto; }
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/riesgos/lov/contratos`, { params });
  }
}
