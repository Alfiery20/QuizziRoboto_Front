import { Component } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  public showCamera = false;
  public cameraHeight = 200;
  public cameraWidth = 350;
  public textButton = 'Mostrar Camara';

  public capturedImage: WebcamImage | null = null;

  private trigger: Subject<void> = new Subject<void>();

  toggleCamera(){
    this.showCamera = !this.showCamera;
    this.textButton = this.showCamera ? 'Cerrar Camara' : 'Mostrar Camara';
  }

  takePhoto(): void {
    this.trigger.next();
  }

  captureImage(capturedImage: WebcamImage): void {
    console.info('Saved webcam image', capturedImage);
    this.capturedImage = capturedImage;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
}
