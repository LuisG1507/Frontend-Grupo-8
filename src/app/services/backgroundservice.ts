import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Background } from '../models/Background';
import { BackgroundHighRiskDTO } from '../models/BackgroundHighRiskDTO';
import { BackgroundTypeFrequencyDTO } from '../models/BackgroundTypeFrequencyDTO';

@Injectable({
  providedIn: 'root',
})
export class Backgroundservice {
  private url = `${environment.base}/UsersBackground`;

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Background[]>(this.url);
  }

  insert(background: Background) {
    return this.http.post(this.url, this.armarEnvio(background), { responseType: 'text' });
  }

  listId(id: number) {
    return this.http.get<Background>(`${this.url}/listId/${id}`);
  }

  update(id: number, background: Background) {
    return this.http.put(`${this.url}/${id}`, this.armarEnvio(background), { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }

  getTypeFrequency() {
    return this.http.get<BackgroundTypeFrequencyDTO[]>(`${this.url}/frequency-type`);
  }

  getHighRiskUsers() {
    return this.http.get<BackgroundHighRiskDTO[]>(`${this.url}/high-risk`);
  }

  private armarEnvio(background: Background) {
    return {
      type: background.type,
      description: background.description,
      source: background.source,
      registrationDate: background.registrationDate,
      user: { idUser: background.idUser },
    };
  }
}
