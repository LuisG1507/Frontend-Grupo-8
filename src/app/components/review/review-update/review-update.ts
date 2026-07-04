import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Review } from '../../../models/Review';
import { Reviewservice } from '../../../services/reviewservice';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-review-update',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSnackBarModule, MatDatepickerModule],
  templateUrl: './review-update.html',
  styleUrl: './review-update.css',
})
export class ReviewUpdate implements OnInit {
  review: Review = new Review();
  id: number = 0;
  today: Date = new Date();

  constructor(
    private rS: Reviewservice,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.rS.listId(this.id).subscribe((data) => {
      this.review = data;
      this.review.idUser = data.user?.idUser ?? data.idUser;
      this.review.idEstate = data.estate?.idEstate ?? data.idEstate;
      this.review.creationDate = new Date(`${data.creationDate}T00:00:00`);
    });
  }

  aceptar() {
    this.review.creationDate = this.formatearFecha(this.review.creationDate);
    this.rS.update(this.id, this.review).subscribe(() => {
      this.snackBar.open('Reseña actualizada correctamente', 'Cerrar', { duration: 3000 });
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
