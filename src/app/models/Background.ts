export class Background {
  idUserBackground: number = 0;
  idBackground: number = 0;
  type: string = '';
  description: string = '';
  source: string = '';
  registrationDate: Date | string = '';
  idUser: number = 0;
  user?: { idUser: number };
}
