import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CasoService } from '../../../shared/services/caso.service';
import { GeographicService } from '../../../shared/services/geographic.service';
import { PolizaService } from '../../../shared/services/poliza.service';
import { ConfiguracionService } from '../../../shared/services/configuracion.service';
import { LocalizacionDTO, RiesgoBusquedaResponse, LlamadaDTO } from '../../../shared/interfaces';

@Component({
  selector: 'app-llamada-form',
  templateUrl: './llamada-form.component.html',
  styleUrls: ['./llamada-form.component.scss']
})
export class LlamadaFormComponent implements OnInit {
  llamadaForm!: FormGroup;
  ciudades: LocalizacionDTO[] = [];
  riesgoResult: RiesgoBusquedaResponse | null = null;
  showRiesgoSearch = false;
  showGoogleDirection = false;
  showDuplicateAlert = false;
  showPicoPlacaAlert = false;
  picoPlacaMessage = '';
  duplicateMessage = '';
  causas: any[] = [];

  constructor(
    private fb: FormBuilder,
    private casoService: CasoService,
    private geographicService: GeographicService,
    private polizaService: PolizaService,
    private configuracionService: ConfiguracionService
  ) {}

  ngOnInit(): void {
    this.llamadaForm = this.fb.group({
      locgeCodigo: [null, Validators.required],
      riesgoCodigo: ['', Validators.required],
      contNumeroContrato: [''],
      causaCodigo: [null, Validators.required],
      direccion: ['', Validators.required],
      usuNumeroDocumento: ['', Validators.required],
      usuTipoDocumento: [''],
      codigoCampo: [null],
      ramoCodigo: [null],
      productoCodigo: [null],
      observacionesLar: [''],
      direccionComplemento: [''],
      direccionDestino: [''],
      direccionGeoReferencia: [''],
      telefonoLlamada: [''],
      severidad: [''],
      lineaNegocio: [''],
      pais: [''],
      tlgCodigo: [3]
    });
  }

  onCitySearch(event: any): void {
    const query = event.query || '';
    this.geographicService.searchCities(query).subscribe(res => {
      this.ciudades = res.data?.content || [];
    });
  }

  onCitySelected(city: LocalizacionDTO): void {
    this.llamadaForm.patchValue({ locgeCodigo: city.locgeCodigo, pais: city.pais });
    // Check for duplicate cases
    const contNumero = this.llamadaForm.get('contNumeroContrato')?.value;
    const riesgoCodigo = this.llamadaForm.get('riesgoCodigo')?.value;
    if (contNumero && riesgoCodigo) {
      this.casoService.validateDuplicate(city.locgeCodigo!, contNumero, riesgoCodigo).subscribe(res => {
        if (res.data) { this.duplicateMessage = 'Ya existe un caso atendido con estos datos'; this.showDuplicateAlert = true; }
      });
    }
  }

  onRiskSearch(): void { this.showRiesgoSearch = true; }

  onRiskSelected(riesgo: any): void {
    this.showRiesgoSearch = false;
    this.llamadaForm.patchValue({
      riesgoCodigo: riesgo.riesgoCodigo,
      contNumeroContrato: riesgo.contNumero,
      ramoCodigo: riesgo.ramoCodigo,
      productoCodigo: riesgo.productoCodigo
    });
  }

  onGeocode(): void {
    const locgeCodigo = this.llamadaForm.get('locgeCodigo')?.value;
    const direccion = this.llamadaForm.get('direccion')?.value;
    if (locgeCodigo && direccion) {
      this.geographicService.geocodeAddress({ locgeCodigo, direccion }).subscribe(res => {
        if (res.data?.encontrado) {
          this.llamadaForm.patchValue({ direccionGeoReferencia: res.data.direccionFormateada });
        }
      });
    }
  }

  onGoogleDirection(): void { this.showGoogleDirection = true; }

  onSave(): void {
    if (this.llamadaForm.valid) {
      this.casoService.createCase(this.llamadaForm.value).subscribe(res => {
        if (res.data) {
          console.log('Case created:', res.data.numero);
        }
      });
    }
  }
}
