import { Component, OnInit } from '@angular/core';
import { ServicioService } from '../../../shared/services/servicio.service';
import { ServicioPrestadoDTO } from '../../../shared/interfaces';

@Component({
  selector: 'app-servicio-list',
  templateUrl: './servicio-list.component.html',
  styleUrls: ['./servicio-list.component.scss']
})
export class ServicioListComponent implements OnInit {
  servicios: ServicioPrestadoDTO[] = [];
  selectedServicio: ServicioPrestadoDTO | null = null;
  llamadaNumero?: number;
  showProveedorSearch = false;
  showServicioForm = false;

  constructor(private servicioService: ServicioService) {}

  ngOnInit(): void {}

  loadServices(llamadaNumero: number): void {
    this.llamadaNumero = llamadaNumero;
    this.servicioService.listServices(llamadaNumero).subscribe(res => {
      this.servicios = res.data || [];
    });
  }

  onAddService(): void { this.showServicioForm = true; }
  onEditService(servicio: ServicioPrestadoDTO): void { this.selectedServicio = servicio; this.showServicioForm = true; }
  onSearchProvider(): void { this.showProveedorSearch = true; }

  onCancelService(servicio: ServicioPrestadoDTO): void {
    if (servicio.numeroAutorizacion) {
      this.servicioService.cancelService(servicio.numeroAutorizacion, 'Anulado por operador').subscribe(() => {
        if (this.llamadaNumero) this.loadServices(this.llamadaNumero);
      });
    }
  }
}
