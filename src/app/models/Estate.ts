export class Estate {
  idEstate: number = 0;
  title: string = '';
  description: string = '';
  adress: string = '';
  district: string = '';
  city: string = '';
  monthlyPrice: number = 0;
  type: string = '';
  state: boolean = false;
  rooms: number = 0;
  bathrooms: number = 0;
  areaM2: number = 0;
  creationDate: Date | string = '';
  idUser: any = 0;
  user?: { idUser: number };
  ownerName: string = '';
  ownerLastName: string = '';
  ownerPhoneNumber: string = '';
}

export interface EstateFilterDTO {
  idEstate: number;
  title: string;
  description: string;
  adress: string;
  district: string;
  city: string;
  monthlyPrice: number;
  type: string;
  state: boolean;
  rooms: number;
  bathrooms: number;
  areaM2: number;
  creationDate: string;
  user: { idUser: number; name: string; lastName: string; username: string };
}

export interface OwnerEstateDTO {
  name: string;
  lastname: string;
  rooms: number;
  monthlyPrice: number;
}

export interface EstateUsersDTO {
  name: string;
  lastname: string;
  city: string;
  district: string;
  monthlyPrice: number;
}

export interface AboveAverageRentsDTO {
  title: string;
  district: string;
  montlhy_price: number;
  rooms: number;
}

export interface EstatePricePerRoomDTO {
  title: string;
  city: string;
  rooms: number;
  monthlyPrice: number;
  pricePerRoom: number;
}

export interface EstatePriceRangeDTO {
  type: string;
  lowRange: number;
  midRange: number;
  highRange: number;
}
