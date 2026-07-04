import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Background } from '../../../models/Background';
import { Backgroundservice } from '../../../services/backgroundservice';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-background-update',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSnackBarModule, MatSelectModule, MatDatepickerModule],
  templateUrl: './background-update.html',
  styleUrl: './background-update.css',
})
export class BackgroundUpdate implements OnInit {
  background: Background = new Background();
  id: number = 0;
  today: Date = new Date();

  constructor(
    private bS: Backgroundservice,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.bS.listId(this.id).subscribe((data) => {
      this.background = data;
      this.background.idUser = data.user?.idUser ?? data.idUser;
      this.background.registrationDate = new Date(`${data.registrationDate}T00:00:00`);
    });
  }

  aceptar() {
    this.background.registrationDate = this.formatearFecha(this.background.registrationDate);
    this.bS.update(this.id, this.background).subscribe(() => {
      this.snackBar.open('Antecedente actualizado correctamente', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/backgrounds/list']);
    });
  }

  cancelar() {
    this.router.navigate(['/backgrounds/list']);
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
