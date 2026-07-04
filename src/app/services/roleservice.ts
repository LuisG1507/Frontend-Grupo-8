import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Role } from '../models/Role';

@Injectable({
  providedIn: 'root',
})
export class Roleservice {
  private url = `${environment.base}/RolesController`;

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Role[]>(`${this.url}/ListarRoles`);
  }

  insert(role: Role) {
    return this.http.post(this.url, role,{ responseType: 'text' });
  }

  listId(id: number) {
    return this.http.get<Role>(`${this.url}/${id}`);
  }

  update(id: number, role: Role) {
    return this.http.put(`${this.url}/${id}`, role, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
}
