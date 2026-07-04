import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { RiskReport } from '../../../models/RiskReport';
import { Riskreportservice } from '../../../services/riskreportservice';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-risk-report-update',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSnackBarModule, MatSelectModule, MatDatepickerModule],
  templateUrl: './risk-report-update.html',
  styleUrl: './risk-report-update.css',
})
export class RiskReportUpdate implements OnInit {
  riskReport: RiskReport = new RiskReport();
  id: number = 0;
  today: Date = new Date();

  constructor(
    private rS: Riskreportservice,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.rS.listId(this.id).subscribe((data) => {
      this.riskReport = data;
      this.riskReport.idUser = data.user?.idUser ?? data.idUser;
      this.riskReport.idEstate = data.estate?.idEstate ?? data.idEstate;
      this.riskReport.creationDate = new Date(`${data.creationDate}T00:00:00`);
    });
  }

  aceptar() {
    this.riskReport.creationDate = this.formatearFecha(this.riskReport.creationDate);
    this.rS.update(this.id, this.riskReport).subscribe(() => {
      this.snackBar.open('Reporte actualizado correctamente', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/risk-reports/list']);
    });
  }

  cancelar() {
    this.router.navigate(['/risk-reports/list']);
  }

  formatearFecha(fecha: Date | string): string {
    if (typeof fecha === 'string') {
      return fecha.includes('T') ? fecha.split('T')[0] : fecha;
    }
    const year = fecha.getFullYear();
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const day = fecha.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
