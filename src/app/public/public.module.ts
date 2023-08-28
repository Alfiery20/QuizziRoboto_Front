import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { WebcamModule } from 'ngx-webcam';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    WebcamModule
  ],
  exports:[
    LoginComponent,
    RegisterComponent
  ]
})
export class PublicModule { }
