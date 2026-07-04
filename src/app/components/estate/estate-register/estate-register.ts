import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Estate } from '../../../models/Estate';
import { Estateservice } from '../../../services/estateservice';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-estate-register',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDatepickerModule,
  ],
  templateUrl: './estate-register.html',
  styleUrl: './estate-register.css',
})
export class EstateRegister {
  estate: Estate = new Estate();
  today: Date = new Date();

  constructor(
    private eS: Estateservice,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.estate.creationDate = new Date();
  }

  aceptar() {
    this.estate.creationDate = this.formatearFecha(this.estate.creationDate);
    this.eS.insert(this.estate).subscribe(() => {
      this.snackBar.open('Inmueble registrado correctamente', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/estates/list']);
    });
  }

  cancelar() {
    this.router.navigate(['/estates/list']);
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
