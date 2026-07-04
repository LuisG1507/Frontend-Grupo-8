import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Contract } from '../../../models/Contract';
import { Contractservice } from '../../../services/contractservice';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';


@Component({
  selector: 'app-contract-register',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './contract-register.html',
  styleUrl: './contract-register.css',
})
export class ContractRegister {
  contract: Contract = new Contract();

  constructor(
    private cS: Contractservice,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    const d = new Date();
    this.contract.createdAt = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  aceptar() {
    const start = this.contract.startDate instanceof Date
      ? this.contract.startDate
      : new Date(this.contract.startDate);
    const end = this.contract.endDate instanceof Date
      ? this.contract.endDate
      : new Date(this.contract.endDate);

    if (end <= start) {
      this.snackBar.open('La fecha de fin debe ser posterior a la fecha de inicio.', 'Cerrar', { duration: 3500 });
      return;
    }
    if (this.contract.idLessor === this.contract.idLessee) {
      this.snackBar.open('El arrendador y el arrendatario deben ser diferentes.', 'Cerrar', { duration: 3500 });
      return;
    }

    this.contract.startDate = this.formatearFechaHora(this.contract.startDate);
    this.contract.endDate = this.formatearFechaHora(this.contract.endDate, true);
    this.contract.createdAt = this.formatearFechaHora(this.contract.createdAt);
    this.cS.insert(this.contract).subscribe(() => {
      this.snackBar.open('Contrato registrado correctamente', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/contracts/list']);
    });
  }

  cancelar() {
    this.router.navigate(['/contracts/list']);
  }

  formatearFechaHora(fecha: Date | string, finDelDia = false): string {
    if (typeof fecha === 'string') {
      if (fecha.includes('T')) {
        return fecha.length === 16 ? `${fecha}:00` : fecha.substring(0, 19);
      }
      return `${fecha}T${finDelDia ? '23:59:59' : '00:00:00'}`;
    }
    const year = fecha.getFullYear();
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const day = fecha.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${finDelDia ? '23:59:59' : '00:00:00'}`;
  }
}
