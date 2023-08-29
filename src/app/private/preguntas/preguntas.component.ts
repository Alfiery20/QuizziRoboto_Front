import { Component } from '@angular/core';
import { read } from '@popperjs/core';
import { timeout } from 'rxjs';
import { PreguntaRequest, PreguntaResponse } from 'src/app/interfaces/pregunta';
import { PreguntaService } from 'src/app/services/pregunta.service';

@Component({
  selector: 'app-preguntas',
  templateUrl: './preguntas.component.html',
  styleUrls: ['./preguntas.component.scss'],
})
export class PreguntasComponent {
  pregunta: PreguntaResponse = { id: 0, enunciado: '', audio: '' };
  respuesta: PreguntaRequest = { id: 0, respuesta: '' };

  tiempoGrabacion: number = 5000;

  record: boolean = true;
  mediaRecorder: MediaRecorder | null = null;
  audioChunks: Blob[] = [];
  audio = new Audio();

  constructor(private serv: PreguntaService) {}

  getPregunta() {
    this.serv.obtenerPregunta().subscribe((resp) => {
      this.pregunta = resp;
      console.table(this.pregunta)
    });
    setTimeout(() => {
      this.convertBase64ToFile(this.pregunta.audio);
      this.respuesta.id = this.pregunta.id;
      return this.pregunta;
    }, 2000);
  }

  recordToogle() {
    this.record = !this.record;
    this.recordAndPlayAudio();
  }

  async recordAndPlayAudio(): Promise<void> {
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
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        this.audio = new Audio(audioUrl);
        // this.audio.play();
        this.convertAudioToBase64(audioUrl).then((base64Audio) => {
          this.respuesta.respuesta = base64Audio as string;
        });
        console.table(this.respuesta)
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
