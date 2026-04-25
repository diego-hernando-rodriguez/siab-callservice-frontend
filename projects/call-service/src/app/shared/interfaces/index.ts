/**
 * All TypeScript interfaces matching backend DTOs
 */

// === API Response Wrapper ===
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  errorCode?: string;
  data?: T;
  timestamp?: string;
}

// === Case Management ===
export interface LlamadaDTO {
  numero?: number;
  contNumeroContrato?: string;
  riesgoCodigo?: string;
  locgeCodigo?: number;
  causaCodigo?: number;
  direccion?: string;
  observacionesLar?: string;
  numeroSiniestro?: string;
  mcaEnvioClicksoftware?: string;
  mcaEnvioSalesforce?: string;
  valorAtencion?: number;
  fechaLlamada?: string;
  horaLlamada?: string;
  pais?: string;
  usuNumeroDocumento?: string;
  usuTipoDocumento?: string;
  codigoCampo?: number;
  ramoCodigo?: number;
  productoCodigo?: number;
  estadoLlamada?: string;
  direccionComplemento?: string;
  direccionDestino?: string;
  direccionGeoReferencia?: string;
  telefonoLlamada?: string;
  severidad?: string;
  lineaNegocio?: string;
  alertaPyp?: string;
  cobertura360?: string;
  preferencial?: string;
  placaRiesgo?: string;
  altoValor?: string;
  acuerdoCliente?: string;
  origen?: string;
  controlCarta?: string;
  estadoPoliza?: string;
  // Descriptive fields from PKG_DESCRIPTORES
  dspRamo?: string;
  dspProducto?: string;
  dspNombre?: string;
  dspTomador?: string;
  dspRiesgo?: string;
  dspEstadoLlamada?: string;
  dspEstadoServ?: string;
  dspDpto?: string;
  dspFuncionarioBolivar?: string;
  dspMechoqueHacedias?: string;
  dspEnviadoCasoClick?: string;
  dspTipoAsistencia?: string;
  dspOpcionCobertura?: string;
  dspCoberturaVehiculo?: string;
  excepciones?: number;
  fechaInicioVig?: string;
  fechaFinVig?: string;
}

export interface CasoRequest {
  locgeCodigo: number;
  riesgoCodigo: string;
  causaCodigo: number;
  direccion: string;
  usuNumeroDocumento: string;
  usuTipoDocumento?: string;
  codigoCampo?: number;
  contNumeroContrato?: string;
  ramoCodigo?: number;
  productoCodigo?: number;
  observacionesLar?: string;
  direccionComplemento?: string;
  direccionDestino?: string;
  direccionGeoReferencia?: string;
  telefonoLlamada?: string;
  severidad?: string;
  lineaNegocio?: string;
  pais?: string;
  tlgCodigo?: number;
}

// === Service Management ===
export interface ServicioPrestadoDTO {
  numeroAutorizacion?: number;
  llamadaNumero?: number;
  servCodigo?: number;
  clservCodigo?: number;
  estadoServicio?: string;
  moneda?: string;
  consecutivoPunto?: number;
  personaNombre?: string;
  valorServicio?: number;
  valorTotal?: number;
  totalAdicionales?: number;
  porcentajeImpuesto?: number;
  direccionOrigen?: string;
  direccionDestino?: string;
  fechaServicio?: string;
  horaServicio?: string;
  mcaEnvioClicksoftware?: string;
  tipoDespacho?: string;
  dspServCodigo?: string;
  dspClaseServicio?: string;
  dspEstadoServ?: string;
  dspPersonaNombre?: string;
  observaciones?: string;
  zona?: string;
  elite?: string;
}

// === Characteristics ===
export interface CaracteristicaCausaDTO {
  codigoCampo?: number;
  valor?: string;
  dspCampo?: string;
  dspTipoDato?: string;
  listaValores?: string;
  requerido?: string;
  campoNoModificable?: string;
  codigoCampoPadre?: number;
}

export interface CaracteristicaCausaResponse {
  llamadaNumero?: number;
  caracteristicas?: CaracteristicaCausaDTO[];
  totalRegistros?: number;
}

// === Risk/Policy ===
export interface RiesgoAseguradoDTO {
  contNumero?: string;
  riesgoCodigo?: string;
  codigoCampo?: number;
  valor?: string;
  valorSinCeros?: string;
  ramoCodigo?: number;
  productoCodigo?: number;
  tipcontCodigo?: number;
  pecoNumeroOrden?: number;
  estado?: string;
  numeroOrden?: number;
}

export interface RiesgoBusquedaResponse {
  riesgos?: RiesgoAseguradoDTO[];
  encontrado?: boolean;
  modelo?: string;
  color?: string;
  tipoAsistencia?: string;
  opcionCobertura?: string;
}

export interface PolizaValidacionDTO {
  contNumero?: string;
  polizaValida?: boolean;
  esInexistente?: boolean;
  mensaje?: string;
  ramoCodigo?: number;
  productoCodigo?: number;
  estadoPoliza?: string;
  pideIdTitular?: boolean;
}

// === Provider ===
export interface ProveedorDTO {
  consecutivoPunto?: number;
  personaNumeroDocumento?: string;
  nombre?: string;
  estado?: string;
  servCodigo?: number;
  clservCodigo?: number;
  locgeCodigo?: number;
  zona?: string;
  celular?: string;
  elite?: string;
}

export interface CalificacionProveedorDTO {
  numeroAutorizacion?: number;
  consecutivoPunto?: number;
  amabilidad?: number;
  calificacionGeneral?: number;
  calificacionTiempo?: number;
  calificacionServicio?: number;
  calificacionPresentacion?: number;
  calificacionHerramientas?: number;
  observaciones?: string;
}

// === Geographic ===
export interface LocalizacionDTO {
  locgeCodigo?: number;
  tlgCodigo?: number;
  nombre?: string;
  locgeCodigoPadre?: number;
  pais?: string;
  departamento?: string;
  latitud?: string;
  longitud?: string;
}

export interface GeocodificacionRequest {
  locgeCodigo: number;
  direccion: string;
  usuario?: string;
}

export interface GeocodificacionResponse {
  latitud?: string;
  longitud?: string;
  direccionFormateada?: string;
  ciudad?: string;
  encontrado?: boolean;
}

export interface CoordenadasDTO {
  latitud?: string;
  longitud?: string;
  direccion?: string;
  locgeCodigo?: number;
}

// === Configuration ===
export interface DominioDTO {
  rvDomain?: string;
  rvLowValue?: string;
  rvHighValue?: string;
  rvAbbreviation?: string;
  rvMeaning?: string;
  // Aliases for dropdown compatibility
  codigo?: string;
  descripcion?: string;
}

export interface DescriptorDTO {
  tipo?: string;
  codigo?: string;
  descripcion?: string;
}

export interface VariableGlobalDTO {
  nombre?: string;
  valor?: string;
}

// === Tariff ===
export interface TarifaDTO {
  tarifaCodigo?: number;
  llamadaNumero?: number;
  numeroAutorizacion?: number;
  valorTarifa?: number;
  valorImpuesto?: number;
  porcentajeImpuesto?: number;
  valorDescuento?: number;
  valorTotal?: number;
  estado?: string;
  detalles?: DetalleTarifaDTO[];
}

export interface DetalleTarifaDTO {
  consecutivo?: number;
  valorMedida?: number;
  ancho?: number;
  alto?: number;
  cantidad?: number;
  totalDetalleTar?: number;
  dspTarifaDetalle?: string;
}

export interface RutaIntermediaDTO {
  id?: number;
  secuencia?: number;
  direccion?: string;
  latitud?: string;
  longitud?: string;
  distanciaKm?: number;
  descripcion?: string;
}

// === Additional ===
export interface AdicionalesPrestadosDTO {
  llamadaNumero?: number;
  numeroAutorizacion?: number;
  codigo?: number;
  tipoServicio?: string;
  lTipoServicio?: string;
  hrsEspera?: number;
  valorUnitario?: number;
  valorTotal?: number;
  sumaAdicional?: number;
}

export interface IngresoDTO {
  secuencia?: number;
  numeroAutorizacion?: number;
  formaPago?: string;
  valor?: number;
  totalPagadoUsr?: number;
  pendiente?: number;
  fechaCreacion?: string;
  dspEntidadNombre?: string;
}

export interface ExcepcionDTO {
  id?: number;
  numeroLlamada?: number;
  estadoAutorizado?: string;
  observacionAutorizador?: string;
}

export interface CoberturaDTO {
  id?: number;
  llamadaNumero?: number;
  cobertura?: string;
  estado?: string;
}

export interface CitaDTO {
  id?: number;
  llamadaNumero?: number;
  numeroAutorizacion?: number;
  estado?: string;
  fechaAsignacion?: string;
  horaInicial?: string;
  observaciones?: string;
}

export interface InformacionServicioDTO {
  numeroAutorizacion?: number;
  codigoCampo?: number;
  valor?: string;
  requerido?: string;
  dspCampo?: string;
}

export interface InformacionUsuarioDTO {
  usuNumeroDocumento?: string;
  usuTipoDocumento?: string;
  codigoCampo?: number;
  valor?: string;
}

// === Risk Search Fields (LOV12) ===
export interface CampoBusquedaDTO {
  codigoCampo?: number;
  nombreCampo?: string;
  riesgoCodigo?: string;
}

// === Paginated Response ===
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
