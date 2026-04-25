import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-recurso-confiable',
  template: `
    <div class="recurso-confiable p-4" role="form" aria-label="Recurso Confiable">
      <div class="grid">
        <div class="col-12 md:col-6"><label>Estado RC</label><input pInputText [(ngModel)]="estadoRc" [readOnly]="true" aria-label="Estado recurso confiable"></div>
        <div class="col-12"><label>Observación General</label><textarea pInputTextarea [(ngModel)]="observacionGeneral" [rows]="4" class="w-full" aria-label="Observación general"></textarea></div>
        <div class="col-6"><button pButton label="Cerrar SIAB" icon="pi pi-check" (click)="onCerrar()" aria-label="Cerrar SIAB"></button></div>
        <div class="col-6"><button pButton label="Rechazar SIAB" icon="pi pi-times" severity="danger" (click)="onRechazar()" aria-label="Rechazar SIAB"></button></div>
      </div>
    </div>
  `
})
export class RecursoConfiableComponent {
  @Input() llamadaNumero?: number;
  estadoRc = '';
  observacionGeneral = '';
  onCerrar(): void {}
  onRechazar(): void {}
}
