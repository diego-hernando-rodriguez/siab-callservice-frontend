import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse, PolizaValidacionDTO, CampoBusquedaDTO,
  ProductoConsultaDTO, ContratoDTO, DatosContratoDTO,
  RiesgoBusquedaResponse
} from '../interfaces';

@Injectable({ providedIn: 'root' })
export class PolizaService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  validatePolicy(contrato: string): Observable<ApiResponse<PolizaValidacionDTO>> {
    return this.http.get<ApiResponse<PolizaValidacionDTO>>(`${this.baseUrl}/polizas/${contrato}/validar`);
  }

  getCamposBusqueda(ramo?: string, producto?: string): Observable<ApiResponse<CampoBusquedaDTO[]>> {
    let params = new HttpParams();
    if (ramo) params = params.set('ramo', ramo);
    if (producto) params = params.set('producto', producto);
    return this.http.get<ApiResponse<CampoBusquedaDTO[]>>(`${this.baseUrl}/riesgos/campos-busqueda`, { params });
  }

  getProductosConsulta(valor: string, codigoCampo: number, pais: number, ramo?: string, producto?: string): Observable<ApiResponse<ProductoConsultaDTO[]>> {
    let params = new HttpParams().set('valor', valor).set('codigoCampo', codigoCampo).set('pais', pais);
    if (ramo) params = params.set('ramo', ramo);
    if (producto) params = params.set('producto', producto);
    return this.http.get<ApiResponse<ProductoConsultaDTO[]>>(`${this.baseUrl}/polizas/lov/productos`, { params });
  }

  getRiesgosCedula(ramo2: string, producto2: string, valor: string, pais: number, ramo?: string, producto?: string, existente?: string): Observable<ApiResponse<ContratoDTO[]>> {
    let params = new HttpParams().set('ramo2', ramo2).set('producto2', producto2).set('valor', valor).set('pais', pais);
    if (ramo) params = params.set('ramo', ramo);
    if (producto) params = params.set('producto', producto);
    if (existente) params = params.set('existente', existente);
    return this.http.get<ApiResponse<ContratoDTO[]>>(`${this.baseUrl}/riesgos/lov/contratos`, { params });
  }

  getContratoComodin(ramo: string, producto: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/riesgos/contrato-comodin`, { params: { ramo, producto } });
  }

  getDatosContrato(contNumeroContrato: string): Observable<ApiResponse<DatosContratoDTO>> {
    return this.http.get<ApiResponse<DatosContratoDTO>>(`${this.baseUrl}/riesgos/datos-contrato`, { params: { contNumeroContrato } });
  }

  getRiesgosCargue(ramoCodigo: string, productoCodigo: string, riesgoCodigo: string,
                   tipcontCodigo: number, contNumeroContrato: string, contFechaInicioVigencia: string,
                   pecoNumeroOrden: number): Observable<ApiResponse<{tipoAsistencia: string, opcionCobertura: string}>> {
    const params = new HttpParams()
      .set('ramoCodigo', ramoCodigo).set('productoCodigo', productoCodigo)
      .set('riesgoCodigo', riesgoCodigo).set('tipcontCodigo', tipcontCodigo)
      .set('contNumeroContrato', contNumeroContrato)
      .set('contFechaInicioVigencia', contFechaInicioVigencia)
      .set('pecoNumeroOrden', pecoNumeroOrden);
    return this.http.get<ApiResponse<{tipoAsistencia: string, opcionCobertura: string}>>(`${this.baseUrl}/riesgos/cargue`, { params });
  }

  searchRisks(valor: string): Observable<ApiResponse<RiesgoBusquedaResponse>> {
    return this.http.get<ApiResponse<RiesgoBusquedaResponse>>(`${this.baseUrl}/riesgos/buscar`, { params: { valor } });
  }
}
