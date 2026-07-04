import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Estate } from '../models/Estate';
import { AboveAverageRentReportDTO } from '../models/reports/estate/above-average-rent-report-dto';
import { DistrictEstateReportDTO } from '../models/reports/estate/district-estate-report-dto';
import { OwnerEstateReportDTO } from '../models/reports/estate/owner-estate-report-dto';
import { PricePerRoomReportDTO } from '../models/reports/estate/price-per-room-report-dto';
import { PriceRangeReportDTO } from '../models/reports/estate/price-range-report-dto';

@Injectable({
  providedIn: 'root',
})
export class Estateservice {
  private url = `${environment.base}/Estate`;

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Estate[]>(`${this.url}/listAll`);
  }

  listMine() {
    return this.http.get<Estate[]>(`${this.url}/my-estates`);
  }

  insert(estate: Estate) {
    return this.http.post(this.url, estate, { responseType: 'text' });
  }

  listId(id: number) {
    return this.http.get<Estate>(`${this.url}/listId/${id}`);
  }

  update(estate: Estate) {
    return this.http.put(`${this.url}/actualizar`, {
      ...estate,
      idUser: { idUser: estate.idUser },
    }, { responseType: 'text' });
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }

  ownersEstates() {
    return this.http.get<OwnerEstateReportDTO[]>(`${this.url}/owners-estates`);
  }

  estatesByDistrict(district: string) {
    return this.http.get<DistrictEstateReportDTO[]>(
      `${this.url}/user-estate/${encodeURIComponent(district)}`
    );
  }

  aboveAverageRents() {
    return this.http.get<AboveAverageRentReportDTO[]>(
      `${this.url}/AlquilerEncimaDelPromedio`
    );
  }

  bestPricePerRoom() {
    return this.http.get<PricePerRoomReportDTO[]>(`${this.url}/best-price-per-room`);
  }

  priceRangeDistribution() {
    return this.http.get<PriceRangeReportDTO[]>(`${this.url}/price-range-distribution`);
  }
}
