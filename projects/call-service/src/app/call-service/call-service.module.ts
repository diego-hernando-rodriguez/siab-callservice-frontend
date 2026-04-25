import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CallServiceRoutingModule } from './call-service-routing.module';

// PrimeNG Modules
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CalendarModule } from 'primeng/calendar';
import { RatingModule } from 'primeng/rating';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { TooltipModule } from 'primeng/tooltip';

// Containers
import { CallServiceContainerComponent } from './containers/call-service-container/call-service-container.component';
import { LlamadaFormComponent } from './containers/llamada-form/llamada-form.component';
import { CausaCharacteristicsComponent } from './containers/causa-characteristics/causa-characteristics.component';
import { ServicioListComponent } from './containers/servicio-list/servicio-list.component';
import { RecursoConfiableComponent } from './containers/recurso-confiable/recurso-confiable.component';
import { InformacionServicioComponent } from './containers/informacion-servicio/informacion-servicio.component';

// Components
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ServicioFormComponent } from './components/servicio-form/servicio-form.component';
import { TarifaDetailComponent } from './components/tarifa-detail/tarifa-detail.component';
import { AdicionalesComponent } from './components/adicionales/adicionales.component';
import { IngresosComponent } from './components/ingresos/ingresos.component';
import { CitasComponent } from './components/citas/citas.component';

// Molecules - Step 14
import { RiesgoSearchComponent } from './molecules/riesgo-search/riesgo-search.component';
import { DuplicateCaseAlertComponent } from './molecules/duplicate-case-alert/duplicate-case-alert.component';
import { PicoPlacaAlertComponent } from './molecules/pico-placa-alert/pico-placa-alert.component';
import { GoogleDirectionDialogComponent } from './molecules/google-direction-dialog/google-direction-dialog.component';

// Molecules - Step 15
import { ProveedorSearchDialogComponent } from './molecules/proveedor-search-dialog/proveedor-search-dialog.component';
import { CalificacionProveedorComponent } from './molecules/calificacion-proveedor/calificacion-proveedor.component';

// Molecules - Step 16: All 12 dialog components
import { PersonalDialogComponent } from './molecules/personal-dialog/personal-dialog.component';
import { ProveedorDialogComponent } from './molecules/proveedor-dialog/proveedor-dialog.component';
import { AcuerdosClientesDialogComponent } from './molecules/acuerdos-clientes-dialog/acuerdos-clientes-dialog.component';
import { CaracteristicaServicioDialogComponent } from './molecules/caracteristica-servicio-dialog/caracteristica-servicio-dialog.component';
import { EnvioMensajeDialogComponent } from './molecules/envio-mensaje-dialog/envio-mensaje-dialog.component';
import { FormatosDialogComponent } from './molecules/formatos-dialog/formatos-dialog.component';
import { PoliticasDialogComponent } from './molecules/politicas-dialog/politicas-dialog.component';
import { ResultCartasDialogComponent } from './molecules/result-cartas-dialog/result-cartas-dialog.component';
import { ClientesDialogComponent } from './molecules/clientes-dialog/clientes-dialog.component';
import { FormaAstbDialogComponent } from './molecules/forma-astb-dialog/forma-astb-dialog.component';

// Directives
import { KeyboardNavigationDirective } from '../shared/directives/keyboard-navigation.directive';

const PRIMENG_MODULES = [
  TabViewModule, ButtonModule, ToolbarModule, InputTextModule,
  DropdownModule, InputTextareaModule, TableModule, DialogModule,
  ToastModule, ConfirmDialogModule, CalendarModule, RatingModule,
  MessageModule, MessagesModule, TooltipModule
];

@NgModule({
  declarations: [
    // Containers
    CallServiceContainerComponent,
    LlamadaFormComponent,
    CausaCharacteristicsComponent,
    ServicioListComponent,
    RecursoConfiableComponent,
    InformacionServicioComponent,
    // Components
    ToolbarComponent,
    ServicioFormComponent,
    TarifaDetailComponent,
    AdicionalesComponent,
    IngresosComponent,
    CitasComponent,
    // Molecules - Core
    RiesgoSearchComponent,
    DuplicateCaseAlertComponent,
    PicoPlacaAlertComponent,
    GoogleDirectionDialogComponent,
    ProveedorSearchDialogComponent,
    CalificacionProveedorComponent,
    // Molecules - Dialogs (12 called forms)
    PersonalDialogComponent,
    ProveedorDialogComponent,
    AcuerdosClientesDialogComponent,
    CaracteristicaServicioDialogComponent,
    EnvioMensajeDialogComponent,
    FormatosDialogComponent,
    PoliticasDialogComponent,
    ResultCartasDialogComponent,
    ClientesDialogComponent,
    FormaAstbDialogComponent,
    // Directives
    KeyboardNavigationDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CallServiceRoutingModule,
    ...PRIMENG_MODULES
  ],
  exports: [CallServiceContainerComponent]
})
export class CallServiceModule { }
