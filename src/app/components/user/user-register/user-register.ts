import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from '../../../models/User';
import { Userservice } from '../../../services/userservice';

@Component({
  selector: 'app-user-register',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './user-register.html',
  styleUrl: './user-register.css',
})
export class UserRegister {
  user: User = new User();
  rolesDisponibles: string[] = ['ARRENDADOR', 'ARRENDATARIO'];

  constructor(
    private uS: Userservice,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    const d = new Date();
    const formattedDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    this.user.createdDate = formattedDate;
    this.user.updateDate = formattedDate;
    this.user.statusVerification = false;
    this.user.enabled = true;
  }

  aceptar() {
    // El backend valida el rol y crea tanto el usuario como su rol.
    this.uS.insert(this.user).subscribe({
      next: () => {
        this.snackBar.open('Usuario registrado correctamente', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.snackBar.open(
          error.error || 'No se pudo registrar el usuario',
          'Cerrar',
          { duration: 3000 }
        );
      },
    });
  }

  cancelar() {
    this.router.navigate(['/']);
  }
}
