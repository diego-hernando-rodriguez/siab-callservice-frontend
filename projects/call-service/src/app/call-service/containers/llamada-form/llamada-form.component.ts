import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CasoService } from '../../../shared/services/caso.service';
import { GeographicService } from '../../../shared/services/geographic.service';
import { PolizaService } from '../../../shared/services/poliza.service';
import { ConfiguracionService } from '../../../shared/services/configuracion.service';
import {
  LocalizacionDTO, RiesgoBusquedaResponse, LlamadaDTO,
  DominioDTO, PolizaValidacionDTO, CampoBusquedaDTO
} from '../../../shared/interfaces';

@Component({
  selector: 'app-llamada-form',
  templateUrl: './llamada-form.component.html',
  styleUrls: ['./llamada-form.component.scss']
})
export class LlamadaFormComponent implements OnInit {
  @Output() caseSaved = new EventEmitter<LlamadaDTO>();
  @Output() caseLoaded = new EventEmitter<LlamadaDTO>();

  llamadaForm!: FormGroup;
  ciudades: LocalizacionDTO[] = [];
  causas: DominioDTO[] = [];
  paises: LocalizacionDTO[] = [];
  tiposDocumento: DominioDTO[] = [];
  severidades: DominioDTO[] = [];
  lineasNegocio: DominioDTO[] = [];

  showRiesgoSearch = false;
  showGoogleDirection = false;
  showDuplicateAlert = false;
  showPicoPlacaAlert = false;
  showCartasDialog = false;
  showAcuerdosDialog = false;

  picoPlacaMessage = '';
  duplicateMessage = '';
  isNewCase = true;
  riesgoResults: any[] = [];
  selectedCity: LocalizacionDTO | null = null;
  riesgoQuery = '';
  riesgoSuggestions: any[] = [];
  camposBusqueda: CampoBusquedaDTO[] = [];
  selectedCampoBusqueda: CampoBusquedaDTO | null = null;

  constructor(
    private fb: FormBuilder,
    private casoService: CasoService,
    private geographicService: GeographicService,
    private polizaService: PolizaService,
    private configuracionService: ConfiguracionService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDropdowns();
  }

  private initForm(): void {
    this.llamadaForm = this.fb.group({
      numero: [{ value: null, disabled: true }],
      numeroSiniestro: [{ value: '', disabled: true }],
      fechaLlamada: [{ value: '', disabled: true }],
      horaLlamada: [{ value: '', disabled: true }],
      estadoLlamada: [{ value: '', disabled: true }],
      dspEstadoLlamada: [{ value: '', disabled: true }],
      dspEstadoServ: [{ value: '', disabled: true }],
      locgeCodigo: [null, Validators.required],
      tlgCodigo: [3],
      pais: [1],
      dspDpto: [{ value: '', disabled: true }],
      dspRiesgoValor: [{ value: '', disabled: true }],
      riesgoCodigo: [''],
      contNumeroContrato: [{ value: '', disabled: true }],
      codigoCampo: [null],
      ramoCodigo: [{ value: null, disabled: true }],
      productoCodigo: [{ value: null, disabled: true }],
      dspRamo: [{ value: '', disabled: true }],
      dspProducto: [{ value: '', disabled: true }],
      placaRiesgo: [{ value: '', disabled: true }],
      causaCodigo: [null, Validators.required],
      fechaInicioVig: [{ value: '', disabled: true }],
      fechaFinVig: [{ value: '', disabled: true }],
      dspTipoAsistencia: [{ value: '', disabled: true }],
      dspOpcionCobertura: [{ value: '', disabled: true }],
      dspCoberturaVehiculo: [{ value: '', disabled: true }],
      usuTipoDocumento: ['CC'],
      usuNumeroDocumento: ['', Validators.required],
      dspNombre: [{ value: '', disabled: true }],
      dspTomador: [{ value: '', disabled: true }],
      preferencial: [{ value: '', disabled: true }],
      dspFuncionarioBolivar: [{ value: '', disabled: true }],
      dspMechoqueHacedias: [{ value: '', disabled: true }],
      altoValor: [{ value: '', disabled: true }],
      acuerdoCliente: [{ value: '', disabled: true }],
      origen: [{ value: '', disabled: true }],
      dspEnviadoCasoClick: [{ value: '', disabled: true }],
      direccion: ['', Validators.required],
      direccionComplemento: [''],
      direccionGeoReferencia: [{ value: '', disabled: true }],
      direccionDestino: [''],
      telefonoLlamada: [''],
      severidad: [''],
      lineaNegocio: [''],
      observacionesLar: [''],
      controlCarta: ['N']
    });
  }

  private loadDropdowns(): void {
    this.geographicService.lovPaises().subscribe(res => this.paises = res.data || []);
    this.configuracionService.lovTiposDocumento().subscribe(res => this.tiposDocumento = res.data || []);
    this.configuracionService.lovSeveridadEvento().subscribe(res => this.severidades = res.data || []);
    this.configuracionService.lovLineasNegocio().subscribe(res => this.lineasNegocio = res.data || []);
    // Load risk search fields (LOV_RIESGOS / RG_RIESGO) immediately
    this.loadCamposBusquedaGlobal();
  }

  // =============================================
  // CIUDAD (p-autoComplete)
  // =============================================

  onCitySearch(event: any): void {
    const query = event.query || '';
    if (query.length >= 2) {
      const pais = this.llamadaForm.getRawValue().pais || 1;
      this.geographicService.searchCitiesByPais(pais, query).subscribe(res => {
        this.ciudades = res.data || [];
      });
    }
  }

  onCityAutoSelected(city: LocalizacionDTO): void {
    this.llamadaForm.patchValue({
      locgeCodigo: city.locgeCodigo,
      dspDpto: city.departamento || '',
      tlgCodigo: city.tlgCodigo || 3
    });
    this.loadCausas();
  }

  onPaisChanged(): void {
    this.selectedCity = null;
    this.ciudades = [];
    this.llamadaForm.patchValue({ locgeCodigo: null, dspDpto: '' });
  }

  // =============================================
  // RIESGO - Flujo LOV12 del fmt original:
  // 1. Con ramo/producto se consultan los campos de busqueda (PLACA, CEDULA, etc.)
  // 2. El usuario selecciona el campo y escribe el valor
  // 3. Se busca en RIESGOS_ASEGURADOS por ese valor
  // 4. Si hay un resultado se selecciona automaticamente, si hay varios se muestra tabla
  // =============================================

  /**
   * Loads ALL searchable fields (LOV_RIESGOS / RG_RIESGO) - no ramo/producto filter.
   * This is the initial list shown when the form opens, like the fmt popup.
   */
  private loadCamposBusquedaGlobal(): void {
    this.polizaService.getCamposBusqueda().subscribe(res => {
      this.camposBusqueda = res.data || [];
    });
  }

  /**
   * Loads searchable fields filtered by ramo/producto (LOV12).
   * Called after a risk is selected and ramo/producto are known.
   * If only one field exists, auto-select it.
   */
  private loadCamposBusqueda(): void {
    const raw = this.llamadaForm.getRawValue();
    if (raw.ramoCodigo && raw.productoCodigo) {
      this.polizaService.getCamposBusqueda(String(raw.ramoCodigo), String(raw.productoCodigo))
        .subscribe(res => {
          const filtered = res.data || [];
          if (filtered.length > 0) {
            this.camposBusqueda = filtered;
            if (filtered.length === 1) {
              this.selectedCampoBusqueda = filtered[0];
            }
          }
        });
    }
  }

  onRiskSearch(): void {
    if (!this.riesgoQuery || this.riesgoQuery.length < 2) { return; }
    this.polizaService.searchRisks(this.riesgoQuery).subscribe(res => {
      if (res.data?.encontrado && res.data.riesgos && res.data.riesgos.length > 0) {
        if (res.data.riesgos.length === 1) {
          this.applyRiskSelection(res.data.riesgos[0], res.data);
        } else {
          this.riesgoResults = res.data.riesgos;
          this.showRiesgoSearch = true;
        }
      } else {
        this.riesgoResults = [];
        this.showRiesgoSearch = true;
      }
    });
  }

  onRiskResultSelected(event: any): void {
    this.showRiesgoSearch = false;
    this.applyRiskSelection(event.data, null);
  }

  private applyRiskSelection(riesgo: any, searchResponse: RiesgoBusquedaResponse | null): void {
    this.llamadaForm.patchValue({
      riesgoCodigo: riesgo.riesgoCodigo,
      dspRiesgoValor: riesgo.valor || riesgo.riesgoCodigo,
      contNumeroContrato: riesgo.contNumero,
      ramoCodigo: riesgo.ramoCodigo,
      productoCodigo: riesgo.productoCodigo,
      codigoCampo: riesgo.codigoCampo || (this.selectedCampoBusqueda ? this.selectedCampoBusqueda.codigoCampo : null),
      placaRiesgo: riesgo.valor || ''
    });
    if (searchResponse) {
      this.llamadaForm.patchValue({
        dspTipoAsistencia: searchResponse.tipoAsistencia || '',
        dspOpcionCobertura: searchResponse.opcionCobertura || ''
      });
    }
    if (riesgo.contNumero) { this.validatePoliza(riesgo.contNumero); }
    if (riesgo.ramoCodigo && riesgo.productoCodigo) {
      this.loadDescriptores(riesgo.ramoCodigo, riesgo.productoCodigo);
    }
    this.loadCausas();
    this.loadCamposBusqueda();
    this.validateDuplicate();
    this.evaluatePicoPlaca();
  }

  // =============================================
  // POLIZA
  // =============================================

  onPolizaSearch(): void {
    const contrato = this.llamadaForm.getRawValue().contNumeroContrato;
    if (contrato) {
      this.polizaService.validatePolicy(contrato).subscribe(res => {
        if (res.data) { this.applyPolizaData(res.data); }
      });
    }
  }

  private validatePoliza(contrato: string): void {
    this.polizaService.validatePolicy(contrato).subscribe(res => {
      if (res.data) { this.applyPolizaData(res.data); }
    });
  }

  private applyPolizaData(poliza: PolizaValidacionDTO): void {
    this.llamadaForm.patchValue({ ramoCodigo: poliza.ramoCodigo, productoCodigo: poliza.productoCodigo });
    if (poliza.ramoCodigo) {
      this.loadDescriptores(poliza.ramoCodigo, poliza.productoCodigo!);
      this.loadCamposBusqueda();
    }
  }

  // =============================================
  // DESCRIPTORES Y CAUSAS
  // =============================================

  private loadDescriptores(ramo: number, producto: number): void {
    this.configuracionService.getDescriptor('RAMO', String(ramo)).subscribe(res => {
      this.llamadaForm.patchValue({ dspRamo: res.data?.descripcion || '' });
    });
    this.configuracionService.getDescriptor('PRODUCTO', String(producto)).subscribe(res => {
      this.llamadaForm.patchValue({ dspProducto: res.data?.descripcion || '' });
    });
  }

  private loadCausas(): void {
    const raw = this.llamadaForm.getRawValue();
    if (raw.ramoCodigo && raw.productoCodigo) {
      this.casoService.lovCausas(raw.ramoCodigo, raw.productoCodigo).subscribe(res => {
        this.causas = res.data || [];
      });
    }
  }

  // =============================================
  // VALIDACIONES
  // =============================================

  private validateDuplicate(): void {
    const raw = this.llamadaForm.getRawValue();
    if (raw.locgeCodigo && raw.contNumeroContrato && raw.riesgoCodigo) {
      this.casoService.validateDuplicate(raw.locgeCodigo, raw.contNumeroContrato, raw.riesgoCodigo)
        .subscribe(res => {
          if (res.data) {
            this.duplicateMessage = 'Ya existe un caso atendido con estos datos. Desea continuar?';
            this.showDuplicateAlert = true;
          }
        });
    }
  }

  private evaluatePicoPlaca(): void {
    const raw = this.llamadaForm.getRawValue();
    if (raw.dspRiesgoValor && raw.locgeCodigo) {
      this.configuracionService.evaluatePicoPlaca(raw.dspRiesgoValor, raw.locgeCodigo)
        .subscribe(res => {
          if (res.data && res.data !== 'N/A') {
            this.picoPlacaMessage = res.data;
            this.showPicoPlacaAlert = true;
          }
        });
    }
  }

  // =============================================
  // USUARIO
  // =============================================

  onUserSearch(): void {
    const doc = this.llamadaForm.get('usuNumeroDocumento')?.value;
    if (doc) {
      this.casoService.lovUsuarios(doc).subscribe(res => {
        const items = res.data?.content || [];
        if (items.length > 0) {
          this.llamadaForm.patchValue({ dspNombre: items[0].dspNombre || '', dspTomador: items[0].dspTomador || '' });
        }
      });
    }
  }

  // =============================================
  // DIRECCION
  // =============================================

  onGeocode(): void {
    const raw = this.llamadaForm.getRawValue();
    if (raw.locgeCodigo && raw.direccion) {
      this.geographicService.geocodeAddress({ locgeCodigo: raw.locgeCodigo, direccion: raw.direccion })
        .subscribe(res => {
          if (res.data?.encontrado) {
            this.llamadaForm.patchValue({ direccionGeoReferencia: res.data.direccionFormateada || '' });
          }
        });
    }
  }

  onGoogleDirection(): void { this.showGoogleDirection = true; }

  // =============================================
  // GUARDAR / CONSULTAR
  // =============================================

  save(): void {
    if (!this.llamadaForm.valid) {
      Object.keys(this.llamadaForm.controls).forEach(key => this.llamadaForm.get(key)?.markAsTouched());
      return;
    }
    const raw = this.llamadaForm.getRawValue();
    const request = {
      locgeCodigo: raw.locgeCodigo, riesgoCodigo: raw.riesgoCodigo || raw.dspRiesgoValor,
      causaCodigo: raw.causaCodigo, direccion: raw.direccion,
      usuNumeroDocumento: raw.usuNumeroDocumento, usuTipoDocumento: raw.usuTipoDocumento,
      codigoCampo: raw.codigoCampo, contNumeroContrato: raw.contNumeroContrato,
      ramoCodigo: raw.ramoCodigo, productoCodigo: raw.productoCodigo,
      observacionesLar: raw.observacionesLar, direccionComplemento: raw.direccionComplemento,
      direccionDestino: raw.direccionDestino, direccionGeoReferencia: raw.direccionGeoReferencia,
      telefonoLlamada: raw.telefonoLlamada, severidad: raw.severidad,
      lineaNegocio: raw.lineaNegocio, pais: raw.pais, tlgCodigo: raw.tlgCodigo
    };
    if (raw.numero) {
      this.casoService.updateCase(raw.numero, request).subscribe(res => {
        if (res.data) { this.populateFromResponse(res.data); this.caseSaved.emit(res.data); }
      });
    } else {
      this.casoService.createCase(request).subscribe(res => {
        if (res.data) { this.isNewCase = false; this.populateFromResponse(res.data); this.caseSaved.emit(res.data); }
      });
    }
  }

  executeQuery(numero: number): void {
    this.casoService.getCaseDetails(numero).subscribe(res => {
      if (res.data) { this.isNewCase = false; this.populateFromResponse(res.data); this.caseLoaded.emit(res.data); }
    });
  }

  private populateFromResponse(caso: LlamadaDTO): void {
    this.llamadaForm.patchValue({
      numero: caso.numero, numeroSiniestro: caso.numeroSiniestro || '',
      fechaLlamada: caso.fechaLlamada || '', horaLlamada: caso.horaLlamada || '',
      estadoLlamada: caso.estadoLlamada || '', dspEstadoLlamada: caso.dspEstadoLlamada || '',
      dspEstadoServ: caso.dspEstadoServ || '', locgeCodigo: caso.locgeCodigo,
      pais: caso.pais || '1', dspRiesgoValor: caso.dspRiesgo || caso.riesgoCodigo || '',
      riesgoCodigo: caso.riesgoCodigo || '', contNumeroContrato: caso.contNumeroContrato || '',
      ramoCodigo: caso.ramoCodigo, productoCodigo: caso.productoCodigo,
      dspRamo: caso.dspRamo || '', dspProducto: caso.dspProducto || '',
      causaCodigo: caso.causaCodigo, usuTipoDocumento: caso.usuTipoDocumento || 'CC',
      usuNumeroDocumento: caso.usuNumeroDocumento || '', dspNombre: caso.dspNombre || '',
      dspTomador: caso.dspTomador || '', preferencial: caso.preferencial || '',
      dspFuncionarioBolivar: caso.dspFuncionarioBolivar || '',
      dspMechoqueHacedias: caso.dspMechoqueHacedias || '',
      dspEnviadoCasoClick: caso.dspEnviadoCasoClick || '',
      dspTipoAsistencia: caso.dspTipoAsistencia || '',
      dspOpcionCobertura: caso.dspOpcionCobertura || '',
      direccion: caso.direccion || '', direccionComplemento: caso.direccionComplemento || '',
      direccionGeoReferencia: caso.direccionGeoReferencia || '',
      direccionDestino: caso.direccionDestino || '', telefonoLlamada: caso.telefonoLlamada || '',
      severidad: caso.severidad || '', lineaNegocio: caso.lineaNegocio || '',
      observacionesLar: caso.observacionesLar || '', codigoCampo: caso.codigoCampo
    });
    if (caso.ramoCodigo && caso.productoCodigo) { this.loadCamposBusqueda(); }
  }

  // =============================================
  // BOTONES DE ACCION
  // =============================================

  onCartas(): void { this.showCartasDialog = true; }
  onCorreo(): void { }
  onCompromisos(): void { }
  onReclasificar(): void { }
  onCasoEstrella(): void { }
  onInformes(): void { }
  onAcuerdos(): void { this.showAcuerdosDialog = true; }

  clearForm(): void {
    this.llamadaForm.reset();
    this.initForm();
    this.isNewCase = true;
    this.selectedCity = null;
    this.riesgoQuery = '';
    this.camposBusqueda = [];
    this.selectedCampoBusqueda = null;
  }
}
