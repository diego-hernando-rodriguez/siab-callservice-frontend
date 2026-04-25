import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pico-placa-alert',
  template: `
    <p-dialog header="Alerta - Pico y Placa" [(visible)]="visible" [modal]="true" [style]="{width: '30vw'}"
      (onHide)="close()" role="alertdialog" aria-label="Alerta de restricción vehicular">
      <p-messages severity="info"><ng-template pTemplate><span>{{message}}</span></ng-template></p-messages>
      <ng-template pTemplate="footer">
        <button pButton label="Aceptar" (click)="close()" aria-label="Aceptar alerta"></button>
      </ng-template>
    </p-dialog>
  `
})
export class PicoPlacaAlertComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() message = '';
  close(): void { this.visible = false; this.visibleChange.emit(false); }
}
