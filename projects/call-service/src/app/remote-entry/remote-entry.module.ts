import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CallServiceModule } from '../call-service/call-service.module';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../call-service/call-service.module').then(m => m.CallServiceModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RemoteEntryModule { }
