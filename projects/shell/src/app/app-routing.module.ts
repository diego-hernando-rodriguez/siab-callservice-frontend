import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'call-service', pathMatch: 'full' },
  {
    path: 'call-service',
    loadChildren: () => import('./call-service-wrapper.module').then(m => m.CallServiceWrapperModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
