import { Component, Input } from '@angular/core';
import { CitaDTO } from '../../../shared/interfaces';

@Component({
  selector: 'app-citas',
  template: `
    <div role="region" aria-label="Gestión de citas">
      <p-table [value]="citas" [rows]="5" role="grid">
        <ng-template pTemplate="header"><tr><th>Fecha</th><th>Hora</th><th>Estado</th><th>Observaciones</th></tr></ng-template>
        <ng-template pTemplate="body" let-c>
          <tr><td>{{c.fechaAsignacion}}</td><td>{{c.horaInicial}}</td><td>{{c.estado}}</td><td>{{c.observaciones}}</td></tr>
        </ng-template>
      </p-table>
    </div>
  `
})
export class CitasComponent {
  @Input() citas: CitaDTO[] = [];
}
