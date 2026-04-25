import { Component, Input } from '@angular/core';
import { IngresoDTO } from '../../../shared/interfaces';

@Component({
  selector: 'app-ingresos',
  template: `
    <div role="region" aria-label="Ingresos">
      <p-table [value]="ingresos" [rows]="5" role="grid">
        <ng-template pTemplate="header"><tr><th>Secuencia</th><th>Forma Pago</th><th>Valor</th><th>Total Pagado</th><th>Pendiente</th></tr></ng-template>
        <ng-template pTemplate="body" let-i>
          <tr><td>{{i.secuencia}}</td><td>{{i.formaPago}}</td><td>{{i.valor | number:'1.2-2'}}</td>
            <td>{{i.totalPagadoUsr | number:'1.2-2'}}</td><td>{{i.pendiente | number:'1.2-2'}}</td></tr>
        </ng-template>
      </p-table>
    </div>
  `
})
export class IngresosComponent {
  @Input() ingresos: IngresoDTO[] = [];
}
