import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Estate } from '../../../models/Estate';
import { Favorite } from '../../../models/Favorite';
import { User } from '../../../models/User';
import { Estateservice } from '../../../services/estateservice';
import { Favoriteservice } from '../../../services/favoriteservice';
import { Userservice } from '../../../services/userservice';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-favorite-register',
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
  templateUrl: './favorite-register.html',
  styleUrl: './favorite-register.css',
})
export class FavoriteRegister implements OnInit {
  favorite: Favorite = new Favorite();
  users: User[] = [];
  estates: Estate[] = [];
  today: Date = new Date();

  constructor(
    private favoriteService: Favoriteservice,
    private userService: Userservice,
    private estateService: Estateservice,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.favorite.creationDate = new Date();
  }

  ngOnInit(): void {
    this.userService.list().subscribe((users) => (this.users = users));
    this.estateService.list().subscribe((estates) => (this.estates = estates));
  }

  save(): void {
    this.favorite.creationDate = this.formatearFecha(this.favorite.creationDate);
    this.favoriteService.insert(this.favorite).subscribe(() => {
      this.snackBar.open('Favorito registrado correctamente', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/favorites/list']);
    });
  }

  cancel(): void {
    this.router.navigate(['/favorites/list']);
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
