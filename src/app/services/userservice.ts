import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../models/User';
import { UserUnverifiedBackgroundDTO } from '../models/UserUnverifiedBackgroundDTO';

@Injectable({
  providedIn: 'root',
})
export class Userservice {
  private url = `${environment.base}/Users`;

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<User[]>(`${this.url}/listar`);
  }

  insert(user: User) {
    return this.http.post(`${this.url}/Registrar`, user, { responseType: 'text' });
  }

  listId(id: number) {
    return this.http.get<User>(`${this.url}/listarporId/${id}`);
  }

  update(id: number, user: User) {
    return this.http.put(`${this.url}/${id}`, user, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }

  getUnverifiedWithBackgrounds() {
    return this.http.get<UserUnverifiedBackgroundDTO[]>(
      `${this.url}/unverified-with-backgrounds`
    );
  }

}
