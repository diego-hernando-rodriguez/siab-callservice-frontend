import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-servicio-form',
  template: `
    <div [formGroup]="servicioForm" class="grid" role="form" aria-label="Formulario de servicio">
      <div class="col-12 md:col-4">
        <label id="lbl-serv">Servicio</label>
        <p-dropdown formControlName="servCodigo" [options]="servicios" optionLabel="descripcion" optionValue="servCodigo"
          [filter]="true" placeholder="Seleccione servicio" aria-labelledby="lbl-serv"></p-dropdown>
      </div>
      <div class="col-12 md:col-4">
        <label id="lbl-dir-orig">Dirección Origen</label>
        <input pInputText formControlName="direccionOrigen" aria-labelledby="lbl-dir-orig">
      </div>
      <div class="col-12 md:col-4">
        <label id="lbl-dir-dest">Dirección Destino</label>
        <input pInputText formControlName="direccionDestino" aria-labelledby="lbl-dir-dest">
      </div>
      <div class="col-12"><label>Observaciones</label>
        <textarea pInputTextarea formControlName="observaciones" [rows]="3" class="w-full"></textarea>
      </div>
    </div>
  `
})
export class ServicioFormComponent {
  @Input() servicio: any;
  @Output() saved = new EventEmitter<any>();
  servicioForm: FormGroup;
  servicios: any[] = [];

  constructor(private fb: FormBuilder) {
    this.servicioForm = this.fb.group({
      servCodigo: [null], clservCodigo: [null], direccionOrigen: [''],
      direccionDestino: [''], observaciones: [''], moneda: ['COP']
    });
  }
}
