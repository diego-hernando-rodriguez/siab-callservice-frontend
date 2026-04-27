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
  causas: any[] = [];
  paises: LocalizacionDTO[] = [];
  tiposDocumento: DominioDTO[] = [];
  severidades: DominioDTO[] = [];
  lineasNegocio: DominioDTO[] = [];

  showRiesgoSearch = false;
  showProductosDialog = false;
  showContratosDialog = false;
  showGoogleDirection = false;
  showDuplicateAlert = false;
  showPicoPlacaAlert = false;
  showCartasDialog = false;
  showAcuerdosDialog = false;

  picoPlacaMessage = '';
  duplicateMessage = '';
  isNewCase = true;
  riesgoResults: any[] = [];
  productosResults: any[] = [];
  contratosResults: any[] = [];
  selectedCity: LocalizacionDTO | null = null;
  riesgoQuery = '';
  riesgoSuggestions: any[] = [];
  camposBusqueda: CampoBusquedaDTO[] = [];
  selectedCampoBusqueda: CampoBusquedaDTO | null = null;
  geocodingInProgress = false;
  geocodeMessage = '';
  geocodeSuccess = false;

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
      dspDescripcion2: [{ value: '', disabled: true }],
      fechaInicioVig: [{ value: '', disabled: true }],
      fechaFinVig: [{ value: '', disabled: true }],
      dspTipoAsistencia: [{ value: '', disabled: true }],
      dspOpcionCobertura: [{ value: '', disabled: true }],
      dspCoberturaVehiculo: [{ value: '', disabled: true }],
      usuTipoDocumento: ['CC'],
      usuNumeroDocumento: [{ value: '', disabled: true }],
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
      direccionDestino: [{ value: '', disabled: true }],
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
      tlgCodigo: city.tlgCodigo || 3,
      pais: city.pais ? Number(city.pais) : this.llamadaForm.getRawValue().pais
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

  /**
   * KEY-NEXT-ITEM on RIESGO.VALOR - Full flow from llamada.fmt:
   * Step 1: P_PRODUCTOS_CONSULTA -> show product selection (lv_productos_consulta)
   * Step 2: P_RIESGOS_CEDULA -> show contract selection (riesgos_cedula)
   * Step 3: cg$consultar_riesgo_aseg -> validate and fill LLAMADA fields
   * Step 4: f_riesgos_cargue -> fill tipo_asistencia and opcion_cobertura
   */
  onRiskSearch(): void {
    if (!this.riesgoQuery || this.riesgoQuery.length < 2 || !this.selectedCampoBusqueda) { return; }

    const raw = this.llamadaForm.getRawValue();
    const pais = raw.pais || 1;
    const codigoCampo = this.selectedCampoBusqueda.codigoCampo!;

    // Step 1: Call P_PRODUCTOS_CONSULTA to get available products
    this.polizaService.getProductosConsulta(
      this.riesgoQuery, codigoCampo, pais,
      raw.ramoCodigo ? String(raw.ramoCodigo) : undefined,
      raw.productoCodigo ? String(raw.productoCodigo) : undefined
    ).subscribe(res => {
      this.productosResults = res.data || [];
      if (this.productosResults.length === 1) {
        // Auto-select if only one product
        this.onProductoSelected(this.productosResults[0]);
      } else if (this.productosResults.length > 1) {
        this.showProductosDialog = true;
      } else {
        // No products found - try direct search
        this.polizaService.searchRisks(this.riesgoQuery).subscribe(riskRes => {
          if (riskRes.data?.encontrado && riskRes.data.riesgos && riskRes.data.riesgos.length > 0) {
            if (riskRes.data.riesgos.length === 1) {
              this.applyRiskSelection(riskRes.data.riesgos[0], riskRes.data);
            } else {
              this.riesgoResults = riskRes.data.riesgos;
              this.showRiesgoSearch = true;
            }
          } else {
            this.riesgoResults = [];
            this.showRiesgoSearch = true;
          }
        });
      }
    });
  }

  onProductoSelected(producto: any): void {
    this.showProductosDialog = false;
    const ramo2 = producto.COD_RAMO || producto.cod_ramo;
    const producto2 = producto.COD_PRODUCTO || producto.cod_producto;
    const existente = producto.EXISTE || producto.existe || 'S';
    const inexistente = producto.INEXISTENTE || producto.inexistente;

    // If inexistente (EXISTE='N'), get wildcard ASIS contract
    if (existente === 'N' || inexistente) {
      this.polizaService.getContratoComodin(ramo2, producto2).subscribe(res => {
        const comodin = res.data;
        if (comodin && comodin.POLIZA) {
          this.llamadaForm.patchValue({
            contNumeroContrato: comodin.POLIZA,
            ramoCodigo: parseInt(ramo2),
            productoCodigo: parseInt(producto2),
            riesgoCodigo: comodin.RIESGO || '1001',
            dspRiesgoValor: this.riesgoQuery,
            codigoCampo: this.selectedCampoBusqueda?.codigoCampo,
            placaRiesgo: this.riesgoQuery,
            usuTipoDocumento: comodin.TIPO_DOCUMENTO || 'CC',
            usuNumeroDocumento: comodin.NUMERO_DOCUMENTO || '',
            dspNombre: comodin.NOMBRES_APELLIDOS || inexistente || 'CLIENTE INEXISTENTE'
          });
        } else {
          this.llamadaForm.patchValue({
            ramoCodigo: parseInt(ramo2),
            productoCodigo: parseInt(producto2),
            dspRiesgoValor: this.riesgoQuery,
            codigoCampo: this.selectedCampoBusqueda?.codigoCampo,
            dspNombre: inexistente || 'CLIENTE INEXISTENTE'
          });
        }
        this.loadDescriptores(parseInt(ramo2), parseInt(producto2));
        this.loadCausas();
        this.loadCamposBusqueda();
      });
      return;
    }

    // Step 2: Call P_RIESGOS_CEDULA to get contracts
    const raw = this.llamadaForm.getRawValue();
    this.polizaService.getRiesgosCedula(
      ramo2, producto2, this.riesgoQuery, raw.pais || 1,
      raw.ramoCodigo ? String(raw.ramoCodigo) : undefined,
      raw.productoCodigo ? String(raw.productoCodigo) : undefined,
      existente
    ).subscribe(res => {
      this.contratosResults = res.data || [];
      if (this.contratosResults.length === 1) {
        this.onContratoSelected(this.contratosResults[0]);
      } else if (this.contratosResults.length > 1) {
        this.showContratosDialog = true;
      } else {
        // No contracts - assign as inexistente
        this.llamadaForm.patchValue({
          ramoCodigo: parseInt(ramo2),
          productoCodigo: parseInt(producto2),
          dspRiesgoValor: this.riesgoQuery,
          codigoCampo: this.selectedCampoBusqueda?.codigoCampo
        });
        this.loadDescriptores(parseInt(ramo2), parseInt(producto2));
        this.loadCausas();
      }
    });
  }

  onContratoSelected(contrato: any): void {
    this.showContratosDialog = false;
    // Step 3: Fill all LLAMADA fields from the selected contract (cg$consultar_riesgo_aseg)
    const poliza = contrato.POLIZA || contrato.poliza;
    const ramo = contrato.RAMO_CODIGO || contrato.ramo_codigo;
    const producto = contrato.PRODUCTO_CODIGO || contrato.producto_codigo;
    const riesgo = contrato.RIESGO || contrato.riesgo || contrato.RIESGO2 || contrato.riesgo2;
    const numOrden = contrato.NUM_ORDEN || contrato.num_orden;
    const tipContrato = contrato.TIP_CONTRATO || contrato.tip_contrato;
    const valor = contrato.VALOR_RIESGO_ORI || contrato.valor_riesgo_ori || this.riesgoQuery;
    const inicio = contrato.INICIO || contrato.inicio || '';
    const fin = contrato.FIN || contrato.fin || '';

    this.llamadaForm.patchValue({
      contNumeroContrato: poliza,
      ramoCodigo: parseInt(ramo),
      productoCodigo: parseInt(producto),
      riesgoCodigo: riesgo,
      dspRiesgoValor: valor,
      codigoCampo: this.selectedCampoBusqueda?.codigoCampo,
      placaRiesgo: valor,
      fechaInicioVig: this.formatFecha(inicio),
      fechaFinVig: this.formatFecha(fin)
    });

    // Fill user data from contract
    if (poliza) {
      this.polizaService.getDatosContrato(poliza).subscribe(res => {
        if (res.data && res.data.usuNumeroDocumento) {
          this.llamadaForm.patchValue({
            usuTipoDocumento: res.data.usuTipoDocumento || 'CC',
            usuNumeroDocumento: res.data.usuNumeroDocumento || '',
            dspNombre: res.data.nombreUsuario || '',
            dspTomador: res.data.nombreTomador || '',
            preferencial: res.data.preferencial || 'N'
          });
        }
      });
      this.validatePoliza(poliza);
    }

    // Step 4: f_riesgos_cargue for tipo_asistencia and opcion_cobertura
    const fechaInicioContrato = contrato.INICIO || contrato.inicio || '';
    const tipContratoNum = tipContrato ? parseInt(tipContrato) : 1;
    const numOrdenNum = numOrden ? parseInt(numOrden) : 1;
    if (poliza && riesgo && fechaInicioContrato) {
      this.polizaService.getRiesgosCargue(
        ramo, producto, riesgo, tipContratoNum, poliza, fechaInicioContrato, numOrdenNum
      ).subscribe(res => {
        if (res.data) {
          this.llamadaForm.patchValue({
            dspTipoAsistencia: res.data.tipoAsistencia || '',
            dspOpcionCobertura: res.data.opcionCobertura || ''
          });
        }
      });
    }

    this.loadDescriptores(parseInt(ramo), parseInt(producto));
    this.loadCausas();
    this.loadCamposBusqueda();
    this.validateDuplicate();
    this.evaluatePicoPlaca();
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
    if (riesgo.contNumero) {
      this.validatePoliza(riesgo.contNumero);
      // CGFK$CHK_LLAMADA_LLAMADA_PR2: fill user document, name, tomador, preferencial
      this.polizaService.getDatosContrato(riesgo.contNumero).subscribe(res => {
        if (res.data && res.data.usuNumeroDocumento) {
          this.llamadaForm.patchValue({
            usuTipoDocumento: res.data.usuTipoDocumento || 'CC',
            usuNumeroDocumento: res.data.usuNumeroDocumento || '',
            dspNombre: res.data.nombreUsuario || '',
            dspTomador: res.data.nombreTomador || '',
            preferencial: res.data.preferencial || 'N'
          });
        }
      });
    }
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
    this.configuracionService.getDescriptor('PRODUCTO', String(producto), String(ramo)).subscribe(res => {
      this.llamadaForm.patchValue({ dspProducto: res.data?.descripcion || '' });
    });
  }

  private loadCausas(): void {
    const raw = this.llamadaForm.getRawValue();
    if (raw.ramoCodigo && raw.productoCodigo) {
      this.casoService.lovCausas(raw.ramoCodigo, raw.productoCodigo).subscribe(res => {
        const data = res.data || [];
        // Add displayLabel for the dropdown filter
        this.causas = data.map((c: any) => ({
          ...c,
          displayLabel: `${c.codigo} - ${c.descripcion}`
        }));
      });
    }
  }

  /**
   * WHEN-VALIDATE-ITEM on CAUSA_CODIGO:
   * 1. CGFK$CHK_LLAMADA_LLAMADA_ORIGI: validates FK, fills DSP_DESCRIPCION2 and DSP_PRODUCTO
   * 2. If ramo=130, producto=20, causa in (10,20,30,40): pr_conteo_serpre
   *
   * KEY-NEXT-ITEM: PR_CONSULTA_DATOS_RIESGO_FORMA then navigate to locge_codigo
   */
  onCausaSelected(causaCodigo: number): void {
    if (!causaCodigo) { return; }
    const selected = this.causas.find((c: any) => c.codigo === causaCodigo);
    if (selected) {
      // CGFK$CHK_LLAMADA_LLAMADA_ORIGI: fill descriptive fields
      this.llamadaForm.patchValue({
        dspDescripcion2: selected.descripcion || '',
        dspProducto: selected.descProducto || this.llamadaForm.getRawValue().dspProducto,
        dspRamo: selected.descRamo || this.llamadaForm.getRawValue().dspRamo,
        // If ramo/producto came from the causa selection (when not yet set)
        ramoCodigo: selected.ramoCodigo || this.llamadaForm.getRawValue().ramoCodigo,
        productoCodigo: selected.productoCodigo || this.llamadaForm.getRawValue().productoCodigo
      });
      // Load campos de busqueda for the new ramo/producto
      this.loadCamposBusqueda();
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

  /**
   * WHEN-VALIDATE-ITEM on LLAMADA.DIRECCION:
   * Only for pais=1 (Colombia). Calls PKG_GEO_DIRECCION_INTEGRA flow:
   * 1. FU_DIRECCION_LIMPIA -> clean address
   * 2. PR_BUSQUEDA_DIRECCION_INTEGRA -> search coordinates
   * 3. FU_DIRECCION_UNICA(1) -> get geo-referenced address
   * 4. If INVALIDA -> retry with city name
   * 5. PR_ACTUALIZA_DIRECCION_GEOREFE -> update characteristics
   */
  onDireccionBlur(): void {
    const raw = this.llamadaForm.getRawValue();
    if (raw.pais === 1 && raw.locgeCodigo && raw.direccion) {
      this.onGeocode();
    }
  }

  onGeocode(): void {
    const raw = this.llamadaForm.getRawValue();
    if (!raw.locgeCodigo || !raw.direccion) { return; }

    this.geocodingInProgress = true;
    this.geocodeMessage = '';

    this.geographicService.geocodeAddress({
      locgeCodigo: raw.locgeCodigo,
      direccion: raw.direccion
    }).subscribe({
      next: (res) => {
        this.geocodingInProgress = false;
        if (res.data?.encontrado) {
          this.llamadaForm.patchValue({
            direccionGeoReferencia: res.data.direccionFormateada || ''
          });
          this.geocodeSuccess = true;
          this.geocodeMessage = 'Dirección georreferenciada: ' + (res.data.ciudad || '');
        } else {
          this.geocodeSuccess = false;
          this.geocodeMessage = 'No se encontró información de dirección';
        }
      },
      error: () => {
        this.geocodingInProgress = false;
        this.geocodeSuccess = false;
        this.geocodeMessage = 'Error al georreferenciar la dirección';
      }
    });
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
      ramoCodigo: raw.ramoCodigo ? String(raw.ramoCodigo) : null,
      productoCodigo: raw.productoCodigo ? String(raw.productoCodigo) : null,
      observacionesLar: raw.observacionesLar, direccionComplemento: raw.direccionComplemento,
      direccionGeoReferencia: raw.direccionGeoReferencia,
      telefonoLlamada: raw.telefonoLlamada, severidad: raw.severidad,
      lineaNegocio: raw.lineaNegocio, pais: raw.pais ? String(raw.pais) : '1',
      tlgCodigo: raw.tlgCodigo, placaRiesgo: raw.placaRiesgo || raw.dspRiesgoValor
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
      observacionesLar: caso.observacionesLar || '', codigoCampo: caso.codigoCampo,
      dspDpto: caso.dspDpto || '', tlgCodigo: caso.tlgCodigo || 3,
      placaRiesgo: caso.placaRiesgo || ''
    });
    this.riesgoQuery = caso.placaRiesgo || '';
    if (caso.dspCiudad && caso.locgeCodigo) {
      this.selectedCity = { locgeCodigo: caso.locgeCodigo, nombre: caso.dspCiudad, departamento: caso.dspDpto || '', tlgCodigo: caso.tlgCodigo || 3 } as LocalizacionDTO;
    }
    if (caso.ramoCodigo && caso.productoCodigo) {
      this.loadCausas();
      this.loadCamposBusqueda();
    }
    // Load contract data (user, tomador, preferencial, tipo asistencia, cobertura)
    if (caso.contNumeroContrato) {
      this.polizaService.getDatosContrato(caso.contNumeroContrato).subscribe(res => {
        if (res.data) {
          this.llamadaForm.patchValue({
            usuNumeroDocumento: res.data.usuNumeroDocumento || caso.usuNumeroDocumento || '',
            dspNombre: res.data.nombreUsuario || caso.dspNombre || '',
            dspTomador: res.data.nombreTomador || caso.dspTomador || '',
            preferencial: res.data.preferencial || caso.preferencial || 'N'
          });
        }
      });
      if (caso.ramoCodigo && caso.productoCodigo && caso.riesgoCodigo) {
        this.polizaService.getRiesgosCargue(
          String(caso.ramoCodigo), String(caso.productoCodigo), caso.riesgoCodigo,
          caso.tipcontCodigo || 1, caso.contNumeroContrato,
          caso.contFechaInicioVigencia ? String(caso.contFechaInicioVigencia) : '', caso.pecoNumeroOrden || 1
        ).subscribe(res => {
          if (res.data) {
            this.llamadaForm.patchValue({
              dspTipoAsistencia: res.data.tipoAsistencia || '',
              dspOpcionCobertura: res.data.opcionCobertura || ''
            });
          }
        });
      }
    }
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

  private formatFecha(value: string): string {
    if (!value) return '';
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

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
