import { Component, OnInit } from '@angular/core';
import { CaracteristicaService } from '../../../shared/services/caracteristica.service';
import { CaracteristicaCausaDTO, CaracteristicaCausaResponse } from '../../../shared/interfaces';

@Component({
  selector: 'app-causa-characteristics',
  templateUrl: './causa-characteristics.component.html'
})
export class CausaCharacteristicsComponent implements OnInit {
  caracteristicas: CaracteristicaCausaDTO[] = [];
  llamadaNumero?: number;
  ramoCodigo?: number;
  productoCodigo?: number;
  causaCodigo?: number;

  constructor(private caracteristicaService: CaracteristicaService) {}

  ngOnInit(): void {}

  loadCharacteristics(llamadaNumero: number, ramo: number, producto: number, causa: number): void {
    this.llamadaNumero = llamadaNumero;
    this.ramoCodigo = ramo;
    this.productoCodigo = producto;
    this.causaCodigo = causa;
    this.caracteristicaService.loadCharacteristics(llamadaNumero, ramo, producto, causa).subscribe(res => {
      this.caracteristicas = res.data?.caracteristicas || [];
    });
  }

  onSave(): void {
    if (this.llamadaNumero) {
      this.caracteristicaService.saveCharacteristics(this.llamadaNumero, {
        llamadaNumero: this.llamadaNumero,
        ramoCodigo: this.ramoCodigo,
        productoCodigo: this.productoCodigo,
        causaCodigo: this.causaCodigo,
        caracteristicas: this.caracteristicas
      }).subscribe();
    }
  }
}
