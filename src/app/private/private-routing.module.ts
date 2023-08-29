import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreguntasComponent } from './preguntas/preguntas.component';

const routes: Routes = [
  {
    path: '',
    component: PreguntasComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivateRoutingModule {}
