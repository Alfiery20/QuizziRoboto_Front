import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { PreguntaRequest } from '../interfaces/pregunta';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PreguntaService {
  constructor(private http: HttpClient) { }

  obtenerPregunta() {
    const url = environment.base_url + '/getPregunta';
    return this.http.get(url).pipe(
      map((resp: any) => {
        return resp;
      })
    );
  }

  verificarRespuesta(pregunta: PreguntaRequest) {
    const url = environment.base_url + '/setRespuesta';
    return this.http.post(url, pregunta).pipe(
      map((resp: any) => {
        return resp;
      })
    );
  }
}
