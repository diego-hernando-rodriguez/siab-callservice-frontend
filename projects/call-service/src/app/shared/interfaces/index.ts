/**
 * All TypeScript interfaces matching backend DTOs.
 * Each interface mirrors the corresponding Java DTO in siab-callservice-ms.
 */

// === API Response Wrapper ===
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  errorCode?: string;
  data?: T;
  timestamp?: string;
}

// === Paginated Response ===
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// === Case Management ===

/** Mirrors CasoResponseDTO — full case record with descriptive fields */
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
  tlgCodigo?: number;
  dspCiudad?: string;
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
  dspDescripcion2?: string;
  excepciones?: number;
  fechaInicioVig?: string;
  fechaFinVig?: string;
}

/** Alias — CasoResponseDTO is the same shape as LlamadaDTO */
export type CasoResponseDTO = LlamadaDTO;

/** Mirrors CasoRequestDTO — payload for creating/updating a case */
export interface CasoRequestDTO {
  locgeCodigo: number;
  causaCodigo: number;
  direccion: string;
  riesgoCodigo?: string;
  contNumeroContrato?: string;
  ramoCodigo?: string | null;
  productoCodigo?: string | null;
  codigoCampo?: number;
  usuTipoDocumento?: string;
  usuNumeroDocumento?: string;
  observacionesLar?: string;
  direccionComplemento?: string;
  direccionGeoReferencia?: string;
  telefonoLlamada?: string;
  severidad?: string;
  lineaNegocio?: string;
  pais?: string;
  tlgCodigo?: number;
  dspCiudad?: string;
  placaRiesgo?: string;
}

/** @deprecated Use CasoRequestDTO instead */
export type CasoRequest = CasoRequestDTO;

// === Service Management ===

/** Mirrors ServicioResponseDTO — full service record */
export interface ServicioResponseDTO {
  llamadaNumero?: number;
  clservCodigo?: number;
  servCodigo?: number;
  fechaServicio?: string;
  horaServicio?: string;
  numeroAutorizacion?: number;
  consecutivoPunto?: number;
  estadoServicio?: string;
  valorServicio?: number;
  moneda?: string;
  direccionOrigen?: string;
  direccionDestino?: string;
  observaciones?: string;
  valorTotal?: number;
  totalAdicionales?: number;
  porcentajeImpuesto?: number;
  mcaEnvioClicksoftware?: string;
  tipoDespacho?: string;
  zona?: string;
  elite?: string;
  // Descriptive fields
  dspServCodigo?: string;
  dspClaseServicio?: string;
  dspEstadoServ?: string;
  dspPersonaNombre?: string;
}

/** @deprecated Use ServicioResponseDTO instead */
export type ServicioPrestadoDTO = ServicioResponseDTO;

/** Mirrors ServicioRequestDTO — payload for creating/updating a service */
export interface ServicioRequestDTO {
  servCodigo: number;
  clservCodigo: number;
  direccionOrigen?: string;
  direccionDestino?: string;
  observaciones?: string;
  moneda?: string;
}

// === Characteristics ===
export interface CaracteristicaCausaDTO {
  codigoCampo?: number;
  nombre?: string;
  tipoDato?: string;
  listaValores?: string;
  requerido?: string;
  noModificable?: string;
  codigoCampoPadre?: number;
  valor?: string;
  // Legacy aliases
  dspCampo?: string;
  dspTipoDato?: string;
  campoNoModificable?: string;
}

export interface CaracteristicaCausaResponse {
  llamadaNumero?: number;
  caracteristicas?: CaracteristicaCausaDTO[];
  totalRegistros?: number;
}

// === Risk / Policy ===
export interface RiesgoAseguradoDTO {
  contNumero?: string;
  riesgoCodigo?: string;
  codigoCampo?: number;
  valor?: string;
  ramoCodigo?: number;
  productoCodigo?: number;
  tipcontCodigo?: number;
  pecoNumeroOrden?: number;
  estado?: string;
  numeroOrden?: number;
  valorSinCeros?: string;
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

export interface CampoBusquedaDTO {
  codigoCampo?: number;
  nombreCampo?: string;
  riesgoCodigo?: string;
}

export interface ProductoConsultaDTO {
  codRamo?: string;
  codProducto?: string;
  descProducto?: string;
}

export interface ContratoDTO {
  poliza?: string;
  ramoCodigo?: string;
  productoCodigo?: string;
  riesgo?: string;
  numOrden?: number;
  tipContrato?: string;
  valorRiesgoOri?: string;
}

export interface DatosContratoDTO {
  usuTipoDocumento?: string;
  usuNumeroDocumento?: string;
  nombreUsuario?: string;
  nombreTomador?: string;
  preferencial?: string;
}

// === Provider ===
export interface ProveedorDTO {
  consecutivoPunto?: number;
  nombre?: string;
  estado?: string;
  zona?: string;
  celular?: string;
  esElite?: boolean;
  // Extended fields
  personaNumeroDocumento?: string;
  servCodigo?: number;
  clservCodigo?: number;
  locgeCodigo?: number;
}

export interface CalificacionRequestDTO {
  consecutivoPunto?: number;
  llamadaNumero?: number;
  numeroAutorizacion?: number;
  amabilidad?: number;
  calificacionGeneral?: number;
  tiempo?: number;
  servicio?: number;
  presentacion?: number;
  herramientas?: number;
  observaciones?: string;
}

/** @deprecated Use CalificacionRequestDTO instead */
export type CalificacionProveedorDTO = CalificacionRequestDTO;

// === Geographic ===
export interface LocalizacionDTO {
  locgeCodigo?: number;
  tlgCodigo?: number;
  dspCiudad?: string;
  nombre?: string;
  departamento?: string;
  pais?: string;
  locgeCodigoPadre?: number;
  latitud?: string;
  longitud?: string;
}

export interface GeocodificacionRequest {
  locgeCodigo: number;
  direccion: string;
  usuario?: string;
}

export interface GeocodificacionResponse {
  latitud?: number;
  longitud?: number;
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

export interface CausaDTO {
  causaCodigo?: number;
  descripcion?: string;
  ramoCodigo?: string;
  productoCodigo?: string;
}

// === Tariff ===
export interface TarifaDTO {
  llamadaNumero?: number;
  numeroAutorizacion?: number;
  tarifaCodigo?: number;
  valorUnitario?: number;
  cantidad?: number;
  valorTotal?: number;
  valorTarifa?: number;
  valorImpuesto?: number;
  porcentajeImpuesto?: number;
  valorDescuento?: number;
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
  locgeCodigo?: number;
  nombre?: string;
  distanciaKm?: number;
  secuencia?: number;
  direccion?: string;
  latitud?: string;
  longitud?: string;
  descripcion?: string;
}

// === Sub-resources: Citas, Adicionales, Ingresos ===
export interface CitaDTO {
  id?: number;
  llamadaNumero?: number;
  numeroAutorizacion?: number;
  fechaAsignacion?: string;
  horaInicial?: string;
  observaciones?: string;
  estado?: string;
}

export interface AdicionalDTO {
  id?: number;
  tipoServicio?: string;
  hrsEspera?: number;
  valorUnitario?: number;
  valorTotal?: number;
  // Extended fields
  llamadaNumero?: number;
  numeroAutorizacion?: number;
  codigo?: number;
  lTipoServicio?: string;
  sumaAdicional?: number;
}

/** @deprecated Use AdicionalDTO instead */
export type AdicionalesPrestadosDTO = AdicionalDTO;

export interface IngresoDTO {
  id?: number;
  numeroAutorizacion?: number;
  formaPago?: string;
  valor?: number;
  fecha?: string;
  // Extended fields
  secuencia?: number;
  totalPagadoUsr?: number;
  pendiente?: number;
  fechaCreacion?: string;
  dspEntidadNombre?: string;
}

export interface InfoServicioDTO {
  codigoCampo?: number;
  nombre?: string;
  tipoDato?: string;
  valor?: string;
  requerido?: string;
  // Legacy alias
  dspCampo?: string;
  numeroAutorizacion?: number;
}

/** @deprecated Use InfoServicioDTO instead */
export type InformacionServicioDTO = InfoServicioDTO;

// === Exceptions, Letters, Agreements ===
export interface ExcepcionDTO {
  id?: number;
  numeroLlamada?: number;
  codigoPolitica?: string;
  estadoAutorizado?: string;
  observacionAutorizador?: string;
  fechaAutorizacion?: string;
}

export interface CartaDTO {
  id?: number;
  llamadaNumero?: number;
  tipoCarta?: string;
  estado?: string;
  fechaCreacion?: string;
}

export interface AcuerdoDTO {
  id?: number;
  descripcion?: string;
  estado?: string;
}

// === Reclasificacion ===
export interface ReclasificacionRequestDTO {
  nuevoRamoCodigo: string;
  nuevoProductoCodigo: string;
  nuevaCausaCodigo: number;
  codRazonReclasifica: number;
}

export interface ReclasificacionResponseDTO {
  numero?: number;
  ramoCodigo?: string;
  productoCodigo?: string;
  causaCodigo?: number;
  mensaje?: string;
}

// === Notifications ===
export interface NotificacionRequestDTO {
  destinatario: string;
  tipo: string;
  contenido: string;
}

// === Misc ===
export interface InformacionUsuarioDTO {
  usuNumeroDocumento?: string;
  usuTipoDocumento?: string;
  codigoCampo?: number;
  valor?: string;
}

export interface CoberturaDTO {
  id?: number;
  llamadaNumero?: number;
  cobertura?: string;
  estado?: string;
}
