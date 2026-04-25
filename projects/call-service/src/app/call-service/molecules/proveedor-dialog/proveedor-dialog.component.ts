import { Component, EventEmitter, Input, Output } from '@angular/core';
@Component({ selector: 'app-proveedor-dialog', template: `<p-dialog header="Detalle de Proveedor" [(visible)]="visible" [modal]="true" [style]="{width:'50vw'}" (onHide)="close()" role="dialog" aria-label="Detalle de proveedor"><div class="grid p-4" *ngIf="proveedor"><div class="col-6"><strong>Nombre:</strong> {{proveedor.nombre}}</div><div class="col-6"><strong>Documento:</strong> {{proveedor.personaNumeroDocumento}}</div><div class="col-6"><strong>Celular:</strong> {{proveedor.celular}}</div><div class="col-6"><strong>Zona:</strong> {{proveedor.zona}}</div></div><ng-template pTemplate="footer"><button pButton label="Cerrar" (click)="close()"></button></ng-template></p-dialog>` })
export class ProveedorDialogComponent {
  @Input() visible = false; @Output() visibleChange = new EventEmitter<boolean>();
  @Input() proveedor: any = {};
  close(): void { this.visible = false; this.visibleChange.emit(false); }
}
