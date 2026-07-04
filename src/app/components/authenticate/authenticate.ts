import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { JwtRequestDTO } from '../../models/JwtRequestDTO';
import { LoginService } from '../../services/login-service';

@Component({
  selector: 'app-authenticate',
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
    RouterLink,
  ],
  templateUrl: './authenticate.html',
  styleUrl: './authenticate.css',
})
export class Authenticate {
  username: string = '';
  password: string = '';
  hidePassword = true;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  login(): void {
    const request = new JwtRequestDTO();
    request.username = this.username;
    request.password = this.password;

    this.loginService.login(request).subscribe({
      next: (data) => {
        sessionStorage.setItem('token', data.jwttoken);
        this.router.navigate(['/']);
      },
      error: (error) => {
        const mensaje =
          error.status === 401
            ? 'Usuario o contrasena incorrectos'
            : 'No se pudo iniciar sesion';

        this.snackBar.open(mensaje, 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      },
    });
  }
}
