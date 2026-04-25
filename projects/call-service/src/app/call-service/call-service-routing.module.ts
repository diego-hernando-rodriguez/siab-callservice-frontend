import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CallServiceContainerComponent } from './containers/call-service-container/call-service-container.component';

const routes: Routes = [
  { path: '', component: CallServiceContainerComponent },
  { path: 'llamada', component: CallServiceContainerComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CallServiceRoutingModule { }
