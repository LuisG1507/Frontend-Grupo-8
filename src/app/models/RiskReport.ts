export class RiskReport {
  idRiskReport: number = 0;
  type: string = '';
  creationDate: Date | string = '';
  riskLevel: string = '';
  description: string = '';
  details: string = '';
  idUser: any = 0;
  idEstate: number = 0;
  user?: { idUser: number };
  estate?: { idEstate: number };
}
