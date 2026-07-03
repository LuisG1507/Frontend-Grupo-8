import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  AboveAverageRentsDTO,
  Estate,
  EstateFilterDTO,
  EstatePricePerRoomDTO,
  EstatePriceRangeDTO,
  EstateUsersDTO,
  OwnerEstateDTO,
} from '../models/Estate';

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


  filtroEstate(ciudad: string, distrito: string, tipo: string) {
    return this.http.get<EstateFilterDTO[]>(
      `${this.url}/filtro/${ciudad}/${distrito}/${tipo}`
    );
  }

  ownersEstates() {
    return this.http.get<OwnerEstateDTO[]>(`${this.url}/owners-estates`);
  }

  estatesByDistrict(district: string) {
    return this.http.get<EstateUsersDTO[]>(`${this.url}/user-estate/${district}`);
  }

  aboveAverageRents() {
    return this.http.get<AboveAverageRentsDTO[]>(`${this.url}/AlquilerEncimaDelPromedio`);
  }

  bestPricePerRoom() {
    return this.http.get<EstatePricePerRoomDTO[]>(`${this.url}/best-price-per-room`);
  }

  priceRangeDistribution() {
    return this.http.get<EstatePriceRangeDTO[]>(`${this.url}/price-range-distribution`);
  }
}
