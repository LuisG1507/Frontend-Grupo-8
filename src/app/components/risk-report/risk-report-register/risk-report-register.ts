import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RiskReport } from '../../../models/RiskReport';
import { Riskreportservice } from '../../../services/riskreportservice';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-risk-report-register',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSnackBarModule, MatDatepickerModule, MatSelectModule],
  templateUrl: './risk-report-register.html',
  styleUrl: './risk-report-register.css',
})
export class RiskReportRegister {
  riskReport: RiskReport = new RiskReport();
  today: Date = new Date();

  constructor(
    private rS: Riskreportservice,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.riskReport.creationDate = new Date();
  }

  aceptar() {
    this.riskReport.creationDate = this.formatearFecha(this.riskReport.creationDate);
    this.rS.insert(this.riskReport).subscribe(() => {
      this.snackBar.open('Reporte registrado correctamente', 'Cerrar', { duration: 3000 });
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
