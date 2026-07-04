import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Review } from '../../../models/Review';
import { Reviewservice } from '../../../services/reviewservice';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-review-register',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSnackBarModule, MatDatepickerModule],
  templateUrl: './review-register.html',
  styleUrl: './review-register.css',
})
export class ReviewRegister {
  review: Review = new Review();
  today: Date = new Date();

  constructor(
    private rS: Reviewservice,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.review.creationDate = new Date();
  }

  aceptar() {
    this.review.creationDate = this.formatearFecha(this.review.creationDate);
    this.rS.insert(this.review).subscribe(() => {
      this.snackBar.open('Reseña registrada correctamente', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/reviews/list']);
    });
  }

  cancelar() {
    this.router.navigate(['/reviews/list']);
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
