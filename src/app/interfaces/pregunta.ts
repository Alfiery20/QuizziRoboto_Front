export interface PreguntaResponse {
  id: number;
  enunciado: string;
  audio: string;
}

export interface PreguntaRequest {
  id: number;
  respuesta: string;
}
