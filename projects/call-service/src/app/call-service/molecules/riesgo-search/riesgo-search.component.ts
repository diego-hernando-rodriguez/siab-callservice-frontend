import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PolizaService } from '../../../shared/services/poliza.service';
import { RiesgoAseguradoDTO, RiesgoBusquedaResponse } from '../../../shared/interfaces';

@Component({
  selector: 'app-riesgo-search',
  templateUrl: './riesgo-search.component.html'
})
export class RiesgoSearchComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() riesgoSelected = new EventEmitter<RiesgoAseguradoDTO>();

  searchValue = '';
  riesgos: RiesgoAseguradoDTO[] = [];
  loading = false;

  constructor(private polizaService: PolizaService) {}

  onSearch(): void {
    if (!this.searchValue) return;
    this.loading = true;
    this.polizaService.searchRisks(this.searchValue).subscribe({
      next: res => { this.riesgos = res.data?.riesgos || []; this.loading = false; },
      error: () => this.loading = false
    });
  }

  onSelect(riesgo: RiesgoAseguradoDTO): void {
    this.riesgoSelected.emit(riesgo);
    this.close();
  }

  close(): void { this.visible = false; this.visibleChange.emit(false); }
}
