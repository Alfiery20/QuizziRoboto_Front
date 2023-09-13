import { Component, OnInit } from '@angular/core';
import { read } from '@popperjs/core';
import { timeout } from 'rxjs';
import { PreguntaRequest, PreguntaResponse } from 'src/app/interfaces/pregunta';
import { VerificacionRespuesta } from 'src/app/interfaces/respuesta';
import { User } from 'src/app/interfaces/user';
import { PreguntaService } from 'src/app/services/pregunta.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-preguntas',
  templateUrl: './preguntas.component.html',
  styleUrls: ['./preguntas.component.scss'],
})
export class PreguntasComponent implements OnInit {
  pregunta: PreguntaResponse = { id: 0, enunciado: '', audio: '' };
  respuesta: PreguntaRequest = { id: 0, respuesta: '' };
  verificacion: VerificacionRespuesta = {
    BD: '',
    CORRECTO: false,
    IA: '',
    DISTANCIA: '',
  };

  tiempoGrabacion: number = 3000;

  nombre: User = { id: 0, nom: '' };
  record: boolean = true;
  mediaRecorder: MediaRecorder | null = null;
  audioChunks: Blob[] = [];
  audio = new Audio();

  loader: boolean = false;

  constructor(private serv: PreguntaService) {}

  ngOnInit(): void {
    this.verificacion = { BD: '', CORRECTO: false, IA: '', DISTANCIA: '' };
    this.nombre = JSON.parse(localStorage.getItem('user')!);
  }

  async getPregunta() {
    this.loader = true;
    this.serv.obtenerPregunta().subscribe((resp) => {
      this.pregunta = resp;
      this.convertBase64ToFile(this.pregunta.audio);
      this.respuesta.id = this.pregunta.id;
      this.loader = false;
      return this.pregunta;
    });
  }

  recordToogle() {
    this.record = !this.record;
    this.recibirRespuesta();
  }

  validarRespuesta() {
    this.loader = true;
    console.log('Loader en true');
    this.serv.verificarRespuesta(this.respuesta).subscribe((resp) => {
      this.verificacion = resp;
      console.log('Loader en false');
      this.loader = false;
      Swal.fire(
        this.verificacion.CORRECTO ? 'Respuesta correcta!' : 'Ups :c',
        this.verificacion.CORRECTO
          ? 'Te felicito ' +
              this.nombre.nom +
              ', lo hiciste increible! ' +
              (this.verificacion.DISTANCIA == '4'
                ? 'No olvides recargar la bandeja de premios para continuar'
                : '')
          : 'Parece que te equivocaste, la respuesta correcta es : ' +
              this.verificacion.BD +
              ' y haz respondido: ' +
              this.verificacion.IA,
        this.verificacion.CORRECTO ? 'success' : 'error'
      );
    });
  }

  async recibirRespuesta(): Promise<void> {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const mediaRecorder = new MediaRecorder(audioStream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.start();

      // Graba durante 5 segundos
      await new Promise((resolve) => setTimeout(resolve, this.tiempoGrabacion));

      mediaRecorder.stop();

      mediaRecorder.onstop = () => {
        this.loader = true;
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        this.audio = new Audio(audioUrl);

        this.convertAudioToBase64(audioUrl).then((base64Audio) => {
          this.respuesta.respuesta = (base64Audio as string).substring(22);
          setTimeout(() => {
            this.validarRespuesta();
          }, 1500);
        });
      };
      this.record = !this.record;
    } catch (error) {
      console.error('Error al grabar y reproducir audio:', error);
    }
  }

  private convertBase64ToFile(base64Audio: string) {
    const binaryString = window.atob(base64Audio);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const audioBuffer = bytes.buffer;
    const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
  }

  private convertAudioToBase64(audioUrl: string) {
    return fetch(audioUrl)
      .then((response) => response.blob())
      .then((blob) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = function () {
            const base64Data = reader.result;
            resolve(base64Data);
          };
          reader.readAsDataURL(blob);
        });
      });
  }
}
