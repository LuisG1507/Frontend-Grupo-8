import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Role } from '../../../models/Role';
import { Roleservice } from '../../../services/roleservice';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-role-register',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatSelectModule,
  ],
  templateUrl: './role-register.html',
  styleUrl: './role-register.css',
})
export class RoleRegister {
  role: Role = new Role();

  constructor(
    private rS: Roleservice,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  aceptar() {
    this.rS.insert(this.role).subscribe(() => {
      this.snackBar.open('Rol registrado correctamente', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/roles/list']);
    });
  }

  cancelar() {
    this.router.navigate(['/roles/list']);
  }
}
