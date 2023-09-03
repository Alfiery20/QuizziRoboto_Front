import { Component } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { FacialService } from 'src/app/services/facial.service';
import { Login, Register } from 'src/app/interfaces/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public showCamera = false;
  public cameraHeight = 200;
  public cameraWidth = 350;
  public textButton = 'Mostrar Camara';
  public loader: boolean = false;

  public capturedImage: WebcamImage | null = null;

  private trigger: Subject<void> = new Subject<void>();

  private login: Login = { foto: '' };
  private register: Register = { foto: '', nom: '' };
  private swal = {};

  constructor(private route: Router, private serv: FacialService) { }

  toggleCamera() {
    this.showCamera = !this.showCamera;
    this.textButton = this.showCamera ? 'Cerrar Camara' : 'Mostrar Camara';
  }

  inicioSesion() {
    // this.route.navigate(['/inicio']);
    this.loader = true;
    const FotoTomadaBase64 = this.capturedImage!.imageAsDataUrl.substring(23);
    this.login.foto = FotoTomadaBase64;
    this.serv.login(this.login).subscribe((resp) => {
      const bandera: number = resp["id"]
      const nombre: string = resp["nom"]
      localStorage.setItem("user", JSON.stringify(resp));
      if (bandera != -1) {
        this.route.navigate(['inicio'])
      }

      Swal.fire({
        title: bandera == -1 ? 'Ups...' : 'Bienvenido ' + nombre + ' :3',
        text: bandera == -1 ? 'Registrate para poder empezar a aprender' : 'Empecemos a aprender',
        icon: bandera == -1 ? 'warning' : 'success',
        showCancelButton: bandera == -1 ? true : false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: bandera == -1 ? 'Registrase!' : 'Empecemos!',
      }).then((result) => {
        if (result.isConfirmed && bandera == -1) {
          Swal.fire({
            title: 'Ingresa tu nombre :3',
            input: 'text',
            inputAttributes: {
              autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Empecemos!',
            showLoaderOnConfirm: true,
            preConfirm: (login) => {
              this.register.nom = login;
              this.register.foto = FotoTomadaBase64;
              return this.serv.register(this.register).subscribe((resp) => {
                const idRecibido: number = resp['id']
                Swal.fire(
                  idRecibido == 1 ? 'Bienvenido' : 'Ups...',
                  idRecibido == 1 ? 'Empecemos a aprender' : 'Comunicate con la administracion :c',
                  idRecibido == 1 ? 'success' : 'error'
                );
              });
            },
            allowOutsideClick: () => !Swal.isLoading()
          })
        }
      })
      this.loader = false;
    });
  }

  takePhoto(): void {
    this.trigger.next();
  }

  captureImage(capturedImage: WebcamImage): void {
    this.capturedImage = capturedImage;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
}
