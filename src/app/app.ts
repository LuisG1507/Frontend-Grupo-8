import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginService } from './services/login-service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('SmartRent_Frontend');
  role: string = '';
  usuario: string = '';

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  verificar(): boolean {
    const existe = this.loginService.verificar();

    if (existe) {
      this.usuario = this.loginService.showUsername() ?? '';

      // En la cabecera se muestra un solo rol, dando prioridad a ADMIN.
      if (this.isAdmin()) {
        this.role = 'Administrador';
      } else if (this.isArrendador()) {
        this.role = 'Arrendador';
      } else if (this.isArrendatario()) {
        this.role = 'Arrendatario';
      }
    }

    return existe;
  }

  isAdmin(): boolean {
    return this.loginService.tieneRol('ADMIN');
  }

  isArrendador(): boolean {
    return this.loginService.tieneRol('ARRENDADOR');
  }

  isArrendatario(): boolean {
    return this.loginService.tieneRol('ARRENDATARIO');
  }

  cerrar(): void {
    this.loginService.cerrar();
    this.router.navigate(['/login']);
  }
}
