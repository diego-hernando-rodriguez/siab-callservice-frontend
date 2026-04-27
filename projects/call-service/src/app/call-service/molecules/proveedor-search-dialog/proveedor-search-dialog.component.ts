import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProveedorService } from '../../../shared/services/proveedor.service';
import { ProveedorDTO } from '../../../shared/interfaces';

@Component({
  selector: 'app-proveedor-search-dialog',
  templateUrl: './proveedor-search-dialog.component.html'
})
export class ProveedorSearchDialogComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() proveedorSelected = new EventEmitter<ProveedorDTO>();

  proveedores: ProveedorDTO[] = [];
  servCodigo?: number;
  clservCodigo?: number;
  locgeCodigo?: number;

  constructor(private proveedorService: ProveedorService) {}

  onSearch(): void {
    if (this.servCodigo && this.clservCodigo && this.locgeCodigo) {
      this.proveedorService.buscarProveedores(this.servCodigo, this.clservCodigo, this.locgeCodigo).subscribe((res: any) => {
        this.proveedores = res.data || [];
      });
    }
  }

  onSelect(prov: ProveedorDTO): void { this.proveedorSelected.emit(prov); this.close(); }
  close(): void { this.visible = false; this.visibleChange.emit(false); }
}
