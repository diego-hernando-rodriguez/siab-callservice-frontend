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
  showUsuariosDialog = false;
  showContratosUsuarioDialog = false;
  usuariosResults: any[] = [];
  contratosUsuarioResults: any[] = [];

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
      tipcontCodigo: [null],
      pecoNumeroOrden: [null],
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
      dspEnviadoCasoClick: [{ value: '', disabled: true }],
      direccion: ['', Validators.required],
      direccionComplemento: [''],
      direccionGeoReferencia: [{ value: '', disabled: true }],
      direccionDestino: [{ value: '', disabled: true }],
      telefonoLlamada: [''],
      severidad: [''],
      lineaNegocio: [''],
      observacionesLar: [''],
      controlCarta: ['N'],
      tipcontCodigo: [null],
      contFechaInicioVigencia: [null],
      pecoNumeroOrden: [null]
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

    // Step 0: CONSULTA_EXISTENTES - check if risk exists in non-ASIS contracts
    this.polizaService.validarExistente(
      this.riesgoQuery,
      raw.ramoCodigo ? String(raw.ramoCodigo) : undefined,
      raw.productoCodigo ? String(raw.productoCodigo) : undefined,
      codigoCampo
    ).subscribe(existeRes => {
      const esInexistente = existeRes.data?.indicador === 'N';

      // Step 1: Call P_PRODUCTOS_CONSULTA to get available products
      this.polizaService.getProductosConsulta(
        this.riesgoQuery, codigoCampo, pais,
        raw.ramoCodigo ? String(raw.ramoCodigo) : undefined,
        raw.productoCodigo ? String(raw.productoCodigo) : undefined
      ).subscribe(res => {
        this.productosResults = res.data || [];

        if (esInexistente && this.productosResults.length > 0) {
          // Mark products as inexistente for the user to see
          this.productosResults = this.productosResults.map(p => ({
            ...p,
            _esInexistente: true
          }));
        }

        if (this.productosResults.length === 1) {
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
    });
  }

  onProductoSelected(producto: any): void {
    this.showProductosDialog = false;
    const ramo2 = producto.COD_RAMO || producto.cod_ramo;
    const producto2 = producto.COD_PRODUCTO || producto.cod_producto;
    const raw = this.llamadaForm.getRawValue();
    const pais = raw.pais || 1;
    const codigoCampo = this.selectedCampoBusqueda?.codigoCampo;

    if (codigoCampo === 1) {
      // Plate: try RIESGOS_AUTOS (vigent contracts)
      this.polizaService.getRiesgosAutos(this.riesgoQuery, pais, ramo2, producto2).subscribe(res => {
        this.contratosResults = res.data || [];
        if (this.contratosResults.length >= 1) {
          if (this.contratosResults.length === 1) {
            this.onContratoSelected(this.contratosResults[0]);
          } else {
            this.showContratosDialog = true;
          }
        } else {
          // No vigent contract — fallback: direct search (includes expired/ASIS)
          this.polizaService.searchRisks(this.riesgoQuery).subscribe(riskRes => {
            const riesgos = riskRes.data?.riesgos || [];
            if (riesgos.length >= 1) {
              // Auto-fill with first result + user data
              const r = riesgos[0];
              this.llamadaForm.patchValue({
                contNumeroContrato: r.contNumero, ramoCodigo: r.ramoCodigo,
                productoCodigo: r.productoCodigo, riesgoCodigo: r.riesgoCodigo,
                dspRiesgoValor: r.valor, codigoCampo: codigoCampo, placaRiesgo: r.valor,
                dspTipoAsistencia: riskRes.data?.tipoAsistencia || '',
                dspOpcionCobertura: riskRes.data?.opcionCobertura || ''
              });
              if (r.contNumero) {
                this.polizaService.getDatosContrato(r.contNumero).subscribe(uRes => {
                  if (uRes.data?.usuNumeroDocumento) {
                    this.llamadaForm.patchValue({
                      usuTipoDocumento: uRes.data.usuTipoDocumento || 'CC',
                      usuNumeroDocumento: uRes.data.usuNumeroDocumento,
                      dspNombre: uRes.data.nombreUsuario, dspTomador: uRes.data.nombreTomador,
                      preferencial: uRes.data.preferencial || 'N'
                    });
                  }
                });
              }
              this.loadDescriptores(r.ramoCodigo || parseInt(ramo2), r.productoCodigo || parseInt(producto2));
              this.loadCausas();
            } else {
              // Truly inexistente
              this.llamadaForm.patchValue({
                ramoCodigo: parseInt(ramo2), productoCodigo: parseInt(producto2),
                dspRiesgoValor: this.riesgoQuery, codigoCampo: codigoCampo
              });
              this.loadDescriptores(parseInt(ramo2), parseInt(producto2));
              this.loadCausas();
            }
          });
        }
      });
    } else {
      this.polizaService.getRiesgosCedula(
        ramo2, producto2, this.riesgoQuery, pais,
        raw.ramoCodigo ? String(raw.ramoCodigo) : undefined,
        raw.productoCodigo ? String(raw.productoCodigo) : undefined
      ).subscribe(res => {
        this.contratosResults = res.data || [];
        if (this.contratosResults.length === 1) { this.onContratoSelected(this.contratosResults[0]); }
        else if (this.contratosResults.length > 1) { this.showContratosDialog = true; }
        else {
          this.llamadaForm.patchValue({
            ramoCodigo: parseInt(ramo2), productoCodigo: parseInt(producto2),
            dspRiesgoValor: this.riesgoQuery, codigoCampo: codigoCampo
          });
          this.loadDescriptores(parseInt(ramo2), parseInt(producto2));
          this.loadCausas();
          this.triggerUsuarioSearchFlow();
        }
      });
    }
  }

  onContratoSelected(contrato: any): void {
    this.showContratosDialog = false;
    const poliza = contrato.POLIZA || contrato.poliza || contrato.contNumero;
    const ramo = contrato.RAMO_CODIGO || contrato.ramo_codigo || contrato.ramoCodigo;
    const producto = contrato.PRODUCTO_CODIGO || contrato.producto_codigo || contrato.productoCodigo;
    const riesgo = contrato.RIESGO || contrato.riesgo || contrato.RIESGO2 || contrato.riesgo2 || contrato.riesgoCodigo;
    const valor = contrato.VALOR_RIESGO_ORI || contrato.valor_riesgo_ori || contrato.valorRiesgo || contrato.VALOR_RIESGO || this.riesgoQuery;

    this.llamadaForm.patchValue({
      contNumeroContrato: poliza,
      ramoCodigo: ramo ? parseInt(ramo) : null,
      productoCodigo: producto ? parseInt(producto) : null,
      riesgoCodigo: riesgo,
      dspRiesgoValor: valor,
      codigoCampo: this.selectedCampoBusqueda?.codigoCampo,
      placaRiesgo: valor,
      fechaInicioVig: this.formatFecha(inicio),
      fechaFinVig: this.formatFecha(fin),
      tipcontCodigo: tipContrato ? parseInt(tipContrato) : null,
      contFechaInicioVigencia: inicio || null,
      pecoNumeroOrden: numOrden ? parseInt(numOrden) : null
    });

    // cg$consultar_riesgo_aseg Step 1: Fill user data from contract (CGFK$CHK_LLAMADA_LLAMADA_PR2)
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
          // cg$consultar_riesgo_aseg Step 2: If no user found, trigger LOV1 flow
        } else {
          this.triggerUsuarioSearchFlow();
        }
      });
      this.validatePoliza(poliza);
    } else {
      // No contract - trigger LOV1 flow (inexistente path from cg$consultar_riesgo_aseg)
      this.triggerUsuarioSearchFlow();
    }

    // f_riesgos_cargue for tipo_asistencia and opcion_cobertura
    if (valor) {
      this.polizaService.searchRisks(valor).subscribe(res => {
        if (res.data) {
          this.llamadaForm.patchValue({
            dspTipoAsistencia: res.data.tipoAsistencia || '',
            dspOpcionCobertura: res.data.opcionCobertura || ''
          });
        }
      });
    }

    if (ramo && producto) {
      this.loadDescriptores(parseInt(ramo), parseInt(producto));
    }
    this.loadCausas();
    this.loadCamposBusqueda();
    this.validateDuplicate();
    this.evaluatePicoPlaca();
  }

  /**
   * cg$consultar_riesgo_aseg inexistente path:
   * When no user is found from contract, trigger LOV1 (user search) then LOV2 (contract selection).
   * This replicates the KEY-NEXT-ITEM flow of DSP_USU_NUMERO_DOCUMENTO.
   */
  private triggerUsuarioSearchFlow(): void {
    const raw = this.llamadaForm.getRawValue();
    const riesgoValor = raw.dspRiesgoValor || this.riesgoQuery;
    if (riesgoValor) {
      // LOV1: Search users by the risk value (placa/cedula)
      this.polizaService.searchUsuarios(riesgoValor).subscribe(res => {
        this.usuariosResults = res.data || [];
        if (this.usuariosResults.length === 1) {
          this.onUsuarioSelected(this.usuariosResults[0]);
        } else if (this.usuariosResults.length > 1) {
          this.showUsuariosDialog = true;
        }
      });
    }
  }

  onUsuarioSelected(usuario: any): void {
    this.showUsuariosDialog = false;
    const numDoc = usuario.numeroDocumento || usuario.NUMERO_DOCUMENTO;
    const tipoDoc = usuario.tipoDocumento || usuario.TIPO_DOCUMENTO || 'CC';
    const nombre = usuario.nombresApellidos || usuario.NOMBRES_APELLIDOS;
    const preferencial = usuario.preferencial || usuario.PREFERENCIAL || 'N';

    this.llamadaForm.patchValue({
      usuNumeroDocumento: numDoc,
      usuTipoDocumento: tipoDoc,
      dspNombre: nombre,
      preferencial: preferencial
    });

    // LOV2: Get contracts for this user
    const raw = this.llamadaForm.getRawValue();
    const codigoCampo = raw.codigoCampo || (this.selectedCampoBusqueda ? this.selectedCampoBusqueda.codigoCampo : 1);
    this.polizaService.getContratosUsuario(numDoc, tipoDoc, codigoCampo).subscribe(res => {
      this.contratosUsuarioResults = res.data || [];
      if (this.contratosUsuarioResults.length === 1) {
        this.onContratoUsuarioSelected(this.contratosUsuarioResults[0]);
      } else if (this.contratosUsuarioResults.length > 1) {
        this.showContratosUsuarioDialog = true;
      }
    });
  }

  onContratoUsuarioSelected(contrato: any): void {
    this.showContratosUsuarioDialog = false;
    const poliza = contrato.contNumero || contrato.CONT_NUMERO;
    const ramo = contrato.ramoCodigo || contrato.RAMO_CODIGO;
    const producto = contrato.productoCodigo || contrato.PRODUCTO_CODIGO;
    const riesgo = contrato.riesgo || contrato.RIESGO;
    const valor = contrato.valorRiesgo || contrato.VALOR_RIESGO;

    this.llamadaForm.patchValue({
      contNumeroContrato: poliza,
      ramoCodigo: ramo ? parseInt(ramo) : this.llamadaForm.getRawValue().ramoCodigo,
      productoCodigo: producto ? parseInt(producto) : this.llamadaForm.getRawValue().productoCodigo,
      riesgoCodigo: riesgo || this.llamadaForm.getRawValue().riesgoCodigo,
      dspRiesgoValor: valor || this.llamadaForm.getRawValue().dspRiesgoValor
    });

    if (ramo && producto) {
      this.loadDescriptores(parseInt(ramo), parseInt(producto));
    }
    this.loadCausas();
    this.validatePoliza(poliza);
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
    this.configuracionService.getDescriptor('PRODUCTO', String(producto), ramo).subscribe(res => {
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
    if (raw.direccion && raw.direccion.length > 3) {
      this.onGeocode();
    }
  }

  onGeocode(): void {
    const raw = this.llamadaForm.getRawValue();
    const locge = raw.locgeCodigo || 14000; // Default to Bogota if not set
    const dir = raw.direccion;
    if (!dir) { return; }

    this.geocodingInProgress = true;
    this.geocodeMessage = '';

    this.geographicService.geocodeAddress({
      locgeCodigo: locge,
      direccion: dir
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
      error: (err) => {
        this.geocodingInProgress = false;
        this.geocodeSuccess = false;
        this.geocodeMessage = 'Error al georreferenciar: ' + (err.error?.message || err.message || 'Error desconocido');
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

    // PRE-INSERT observaciones logic from fmt:
    // If observacionesLar is null -> "INICIO DE CASO"
    // If has content -> format as &USER|DATE|TEXT
    let obsLar = raw.observacionesLar;
    if (!obsLar || obsLar.trim() === '') {
      obsLar = 'INICIO DE CASO';
    }

    const request = {
      locgeCodigo: raw.locgeCodigo, riesgoCodigo: raw.riesgoCodigo || raw.dspRiesgoValor,
      causaCodigo: raw.causaCodigo, direccion: raw.direccion,
      usuNumeroDocumento: raw.usuNumeroDocumento, usuTipoDocumento: raw.usuTipoDocumento,
      codigoCampo: raw.codigoCampo, contNumeroContrato: raw.contNumeroContrato,
      ramoCodigo: raw.ramoCodigo ? String(raw.ramoCodigo) : null,
      productoCodigo: raw.productoCodigo ? String(raw.productoCodigo) : null,
      observacionesLar: obsLar, direccionComplemento: raw.direccionComplemento,
      direccionGeoReferencia: raw.direccionGeoReferencia,
      telefonoLlamada: raw.telefonoLlamada, severidad: raw.severidad,
      lineaNegocio: raw.lineaNegocio, pais: raw.pais ? String(raw.pais) : '1',
      tlgCodigo: raw.tlgCodigo, placaRiesgo: raw.placaRiesgo || raw.dspRiesgoValor,
      tipcontCodigo: raw.tipcontCodigo, contFechaInicioVigencia: raw.contFechaInicioVigencia,
      pecoNumeroOrden: raw.pecoNumeroOrden
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
      origen: caso.origen || 'LLA_SIAB'
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
