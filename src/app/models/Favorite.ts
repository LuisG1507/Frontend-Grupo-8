export class Favorite {
  idFavorite: number = 0;
  creationDate: Date | string = '';
  idUser: number = 0;
  idEstate: number = 0;
  user?: { idUser: number; username?: string };
  estate?: { idEstate: number; title?: string; location?: string };
}
