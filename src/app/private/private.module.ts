import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreguntasComponent } from './preguntas/preguntas.component';
import { PrivateRoutingModule } from './private-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [PreguntasComponent],
  imports: [CommonModule, PrivateRoutingModule, SharedModule],
  exports: [PreguntasComponent],
})
export class PrivateModule {}
