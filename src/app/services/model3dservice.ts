import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Model3d } from '../models/Model3d';

@Injectable({
  providedIn: 'root',
})
export class Model3dservice {
  private url = `${environment.base}/Models3D`;

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Model3d[]>(`${this.url}/ListModels3D`);
  }

  listMine() {
    return this.http.get<Model3d[]>(`${this.url}/my-models`);
  }

  insert(model3d: Model3d) {
    return this.http.post(`${this.url}/Register`, model3d, { responseType: 'text' });
  }

  listId(id: number) {
    return this.http.get<Model3d>(`${this.url}/listId/${id}`);
  }

  update(model3d: Model3d) {
    return this.http.put(`${this.url}/Update`, model3d, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
}
