import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { RiskReport } from '../models/RiskReport';

@Injectable({
  providedIn: 'root',
})
export class Riskreportservice {
  private url = `${environment.base}/RiskReport`;

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<RiskReport[]>(this.url);
  }

  listMine() {
    return this.http.get<RiskReport[]>(`${this.url}/my-reports`);
  }

  insert(riskReport: RiskReport) {
    return this.http.post(this.url, riskReport,{ responseType: 'text' });
  }

  listId(id: number) {
    return this.http.get<RiskReport>(`${this.url}/listId/${id}`);
  }

  update(id: number, riskReport: RiskReport) {
    return this.http.put(`${this.url}/${id}`, riskReport,{ responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`,{ responseType: 'text' });
  }
}
