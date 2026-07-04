export class Review {
  idReview: number = 0;
  calification: number = 0;
  comment: string = '';
  creationDate: Date | string = '';
  idUser: number = 0;
  idEstate: number = 0;
  user?: { idUser: number };
  estate?: { idEstate: number };
}
