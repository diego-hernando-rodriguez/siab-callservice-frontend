import { Component, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import { TabView } from 'primeng/tabview';
import { LlamadaFormComponent } from '../llamada-form/llamada-form.component';
import { ServicioListComponent } from '../servicio-list/servicio-list.component';
import { LlamadaDTO } from '../../../shared/interfaces';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-call-service-container',
  templateUrl: './call-service-container.component.html',
  styleUrls: ['./call-service-container.component.scss'],
  providers: [MessageService]
})
export class CallServiceContainerComponent implements AfterViewInit {
  activeTabIndex = 0;
  hasUnsavedChanges = false;
  currentCaso: LlamadaDTO | null = null;
  showQueryDialog = false;
  queryNumero: string = '';

  @ViewChild('tabView') tabView!: TabView;
  @ViewChild('llamadaForm') llamadaFormComponent!: LlamadaFormComponent;
  @ViewChild('servicioList') servicioListComponent!: ServicioListComponent;

  constructor(private messageService: MessageService) {}

  ngAfterViewInit(): void {
    setTimeout(() => this.focusFirstFieldInTab(0), 200);
  }

  onTabChange(event: any): void {
    this.activeTabIndex = event.index;
    setTimeout(() => this.focusFirstFieldInTab(event.index), 100);

    // Al cambiar a pestaña de servicios, cargar servicios del caso actual
    if (event.index === 1 && this.currentCaso?.numero) {
      this.servicioListComponent?.loadServices(this.currentCaso.numero);
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardShortcuts(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      this.onSave();
    }
    if (event.key === 'F9') {
      event.preventDefault();
      this.openLovOnFocusedField();
    }
    if (event.key === 'F7') {
      event.preventDefault();
      this.onExecuteQuery();
    }
  }

  // === TOOLBAR ACTIONS ===

  onSave(): void {
    if (this.activeTabIndex === 0 && this.llamadaFormComponent) {
      this.llamadaFormComponent.save();
    }
  }

  onExecuteQuery(): void {
    this.showQueryDialog = true;
  }

  onQuerySubmit(): void {
    this.showQueryDialog = false;
    const num = parseInt(this.queryNumero, 10);
    if (num && this.llamadaFormComponent) {
      this.llamadaFormComponent.executeQuery(num);
    }
    this.queryNumero = '';
  }

  onExit(): void {
    if (this.hasUnsavedChanges) {
      // Confirmar antes de salir
    }
    this.llamadaFormComponent?.clearForm();
    this.currentCaso = null;
    this.activeTabIndex = 0;
  }

  onNavigateFirst(): void {
    this.messageService.add({ severity: 'info', summary: 'Navegación', detail: 'Primer registro' });
  }

  onNavigatePrevious(): void {
    this.messageService.add({ severity: 'info', summary: 'Navegación', detail: 'Registro anterior' });
  }

  onNavigateNext(): void {
    this.messageService.add({ severity: 'info', summary: 'Navegación', detail: 'Siguiente registro' });
  }

  onNavigateLast(): void {
    this.messageService.add({ severity: 'info', summary: 'Navegación', detail: 'Último registro' });
  }

  onPrint(): void {
    window.print();
  }

  onHelp(): void {
    this.messageService.add({ severity: 'info', summary: 'Ayuda', detail: 'Atajos: Ctrl+S Guardar, F7 Consultar, F9 LOV' });
  }

  onCreateInexistentUser(): void {
    this.messageService.add({ severity: 'info', summary: 'Crear Inexistente', detail: 'Funcionalidad de creación de usuario inexistente' });
  }

  onEvaluations(): void {
    this.messageService.add({ severity: 'info', summary: 'Evaluaciones', detail: 'Módulo de evaluaciones' });
  }

  onCauseCharacteristics(): void {
    if (this.currentCaso?.numero) {
      this.activeTabIndex = 2; // Ir a pestaña de características
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Debe crear o consultar un caso primero' });
    }
  }

  // === EVENTOS DEL FORMULARIO ===

  onCaseSaved(caso: LlamadaDTO): void {
    this.currentCaso = caso;
    this.hasUnsavedChanges = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Caso guardado',
      detail: `Caso #${caso.numero} - Siniestro: ${caso.numeroSiniestro}`
    });
  }

  onCaseLoaded(caso: LlamadaDTO): void {
    this.currentCaso = caso;
    this.hasUnsavedChanges = false;
    this.messageService.add({
      severity: 'info',
      summary: 'Caso cargado',
      detail: `Caso #${caso.numero} consultado exitosamente`
    });
  }

  // === UTILIDADES ===

  private focusFirstFieldInTab(tabIndex: number): void {
    const tabPanels = document.querySelectorAll('.p-tabview-panel');
    if (tabPanels && tabPanels[tabIndex]) {
      const focusable = tabPanels[tabIndex].querySelectorAll(
        'input:not([disabled]):not([readonly]), select:not([disabled]), textarea:not([disabled]), ' +
        'button:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
      );
      if (focusable.length > 0) {
        (focusable[0] as HTMLElement).focus();
      }
    }
  }

  private openLovOnFocusedField(): void {
    const el = document.activeElement as HTMLElement;
    if (el) {
      const dropdown = el.closest('.p-dropdown');
      if (dropdown) {
        (dropdown.querySelector('.p-dropdown-trigger') as HTMLElement)?.click();
      }
    }
  }
}
