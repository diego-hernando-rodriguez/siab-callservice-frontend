import { Component, Input } from '@angular/core';
import { AdicionalesPrestadosDTO } from '../../../shared/interfaces';

@Component({
  selector: 'app-adicionales',
  template: `
    <div role="region" aria-label="Servicios adicionales">
      <p-table [value]="adicionales" [rows]="5" role="grid">
        <ng-template pTemplate="caption"><button pButton icon="pi pi-plus" label="Agregar" (click)="onAdd()"></button></ng-template>
        <ng-template pTemplate="header"><tr><th>Tipo</th><th>Horas</th><th>Valor Unitario</th><th>Total</th><th></th></tr></ng-template>
        <ng-template pTemplate="body" let-a let-i="rowIndex">
          <tr>
            <td>{{a.tipoServicio}}</td><td>{{a.hrsEspera}}</td>
            <td>{{a.valorUnitario | number:'1.2-2'}}</td><td>{{a.valorTotal | number:'1.2-2'}}</td>
            <td><button pButton icon="pi pi-trash" (click)="onRemove(i)" [text]="true" severity="danger"></button></td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `
})
export class AdicionalesComponent {
  @Input() adicionales: AdicionalesPrestadosDTO[] = [];
  onAdd(): void { this.adicionales.push({} as AdicionalesPrestadosDTO); }
  onRemove(index: number): void { this.adicionales.splice(index, 1); }
}
