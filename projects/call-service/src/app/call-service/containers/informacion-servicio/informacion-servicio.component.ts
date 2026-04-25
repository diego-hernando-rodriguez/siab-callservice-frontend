import { Component, Input } from '@angular/core';
import { InformacionServicioDTO } from '../../../shared/interfaces';

@Component({
  selector: 'app-informacion-servicio',
  template: `
    <div class="informacion-servicio p-4" role="form" aria-label="Información del Servicio">
      <p-table [value]="informacion" [rows]="10" [paginator]="true" role="grid" aria-label="Información del servicio">
        <ng-template pTemplate="header"><tr><th>Campo</th><th>Valor</th><th>Requerido</th></tr></ng-template>
        <ng-template pTemplate="body" let-info let-i="rowIndex">
          <tr>
            <td>{{info.dspCampo}}</td>
            <td><input pInputText [(ngModel)]="info.valor" [tabindex]="50 + i" [attr.aria-label]="info.dspCampo"></td>
            <td><span *ngIf="info.requerido === 'S'" class="text-red-500">*</span></td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage"><tr><td colspan="3">No hay información del servicio</td></tr></ng-template>
      </p-table>
    </div>
  `
})
export class InformacionServicioComponent {
  @Input() informacion: InformacionServicioDTO[] = [];
}
