import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Estate } from '../../../models/Estate';
import { Estateservice } from '../../../services/estateservice';
import { LoginService } from '../../../services/login-service';

@Component({
  selector: 'app-estate-list',
  imports: [
    AsyncPipe,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    RouterLink,
  ],
  templateUrl: './estate-list.html',
  styleUrl: './estate-list.css',
})
export class EstateList implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Estate> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10'];

  isLoading: boolean = false;
  isDeleting: boolean = false;

  @ViewChild(MatPaginator) set paginator(mp: MatPaginator) {
    if (mp) {
      this.dataSource.paginator = mp;
    }
  }

  constructor(
    private eS: Estateservice,
    private snackBar: MatSnackBar,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.cargarInmuebles();
  }

  cargarInmuebles() {
    this.isLoading = true;

    if (this.isArrendador() && !this.isAdmin()) {
      this.eS.listMine().subscribe({
        next: (data) => {
          this.dataSource.data = data;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('No se pudo cargar la lista de inmuebles', 'Cerrar', { duration: 3000 });
        },
      });
    } else {
      this.eS.list().subscribe({
        next: (data) => {
          this.dataSource.data = data;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('No se pudo cargar la lista de inmuebles', 'Cerrar', { duration: 3000 });
        },
      });
    }
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

  eliminar(id: number) {
    if (!window.confirm(`¿Eliminar el inmueble #${id}?`)) {
      return;
    }

    this.isDeleting = true;
    this.eS.delete(id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.snackBar.open('Inmueble eliminado correctamente', 'Cerrar', { duration: 3000 });
        this.cargarInmuebles();
      },
      error: (error) => {
        this.isDeleting = false;
        const message =
          typeof error?.error === 'string' && error.error.trim()
            ? error.error
            : 'No se pudo eliminar el inmueble.';
        this.snackBar.open(message, 'Cerrar', { duration: 4500 });
      },
    });
  }
}
