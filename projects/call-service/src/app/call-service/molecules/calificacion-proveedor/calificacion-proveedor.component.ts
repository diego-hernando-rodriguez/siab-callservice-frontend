import { Component, Input } from '@angular/core';
import { CalificacionRequestDTO } from '../../../shared/interfaces';
import { ProveedorService } from '../../../shared/services/proveedor.service';

@Component({
  selector: 'app-calificacion-proveedor',
  template: `
    <div role="form" aria-label="Calificación del proveedor">
      <div class="grid">
        <div class="col-6"><label>General</label><p-rating [(ngModel)]="calificacion.calificacionGeneral" [stars]="5"></p-rating></div>
        <div class="col-6"><label>Amabilidad</label><p-rating [(ngModel)]="calificacion.amabilidad" [stars]="5"></p-rating></div>
        <div class="col-6"><label>Tiempo</label><p-rating [(ngModel)]="calificacion.tiempo" [stars]="5"></p-rating></div>
        <div class="col-6"><label>Servicio</label><p-rating [(ngModel)]="calificacion.servicio" [stars]="5"></p-rating></div>
        <div class="col-12"><label>Observaciones</label>
          <textarea pInputTextarea [(ngModel)]="calificacion.observaciones" [rows]="3" class="w-full"></textarea>
        </div>
        <div class="col-12"><button pButton label="Calificar" icon="pi pi-check" (click)="onRate()"></button></div>
      </div>
    </div>
  `
})
export class CalificacionProveedorComponent {
  @Input() calificacion: CalificacionRequestDTO = {};

  constructor(private proveedorService: ProveedorService) {}

  onRate(): void {
    if (this.calificacion.consecutivoPunto) {
      this.proveedorService.calificarProveedor(this.calificacion.consecutivoPunto, this.calificacion).subscribe();
    }
  }
}
