import { Component, Input } from '@angular/core';
import { TarifaDTO } from '../../../shared/interfaces';

@Component({
  selector: 'app-tarifa-detail',
  template: `
    <div class="tarifa-detail" *ngIf="tarifa" role="region" aria-label="Detalle de tarifa">
      <div class="grid">
        <div class="col-4"><strong>Valor Tarifa:</strong> {{tarifa.valorTarifa | number:'1.2-2'}}</div>
        <div class="col-4"><strong>IVA ({{tarifa.porcentajeImpuesto}}%):</strong> {{tarifa.valorImpuesto | number:'1.2-2'}}</div>
        <div class="col-4"><strong>Total:</strong> {{tarifa.valorTotal | number:'1.2-2'}}</div>
      </div>
      <p-table *ngIf="tarifa.detalles?.length" [value]="tarifa.detalles!" [rows]="5" role="grid">
        <ng-template pTemplate="header"><tr><th>Medida</th><th>Ancho</th><th>Alto</th><th>Cantidad</th><th>Total</th></tr></ng-template>
        <ng-template pTemplate="body" let-d>
          <tr><td>{{d.valorMedida}}</td><td>{{d.ancho}}</td><td>{{d.alto}}</td><td>{{d.cantidad}}</td><td>{{d.totalDetalleTar | number:'1.2-2'}}</td></tr>
        </ng-template>
      </p-table>
    </div>
  `
})
export class TarifaDetailComponent {
  @Input() tarifa: TarifaDTO | null = null;
}
