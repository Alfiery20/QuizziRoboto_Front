import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreguntasComponent } from './preguntas/preguntas.component';
import { PrivateRoutingModule } from './private-routing.module';

@NgModule({
  declarations: [PreguntasComponent],
  imports: [CommonModule, PrivateRoutingModule],
  exports: [PreguntasComponent],
})
export class PrivateModule {}
