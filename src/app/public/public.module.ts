import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { WebcamModule } from 'ngx-webcam';
import { PublicRoutingModule } from './public-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    WebcamModule,
    PublicRoutingModule,
    SharedModule
  ],
  exports:[
    LoginComponent
  ]
})
export class PublicModule { }
