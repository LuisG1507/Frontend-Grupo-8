import { AsyncPipe, DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Review } from '../../../models/Review';
import { LoginService } from '../../../services/login-service';
import { Reviewservice } from '../../../services/reviewservice';

@Component({
  selector: 'app-review-list',
  imports: [
    AsyncPipe,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    RouterLink,
  ],
  templateUrl: './review-list.html',
  styleUrl: './review-list.css',
})
export class ReviewList implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Review> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8'];

  isLoading: boolean = false;
  isDeleting: boolean = false;

 
  @ViewChild(MatPaginator) set paginator(mp: MatPaginator) {
    if (mp) {
      this.dataSource.paginator = mp;
    }
  }

  constructor(
    private rS: Reviewservice,
    private snackBar: MatSnackBar,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.cargarResenias();
  }

  /** El arrendador recibe solo las resenas de sus inmuebles; los otros roles consultan la lista general. */
  cargarResenias() {
    this.isLoading = true;

    const consulta = this.isArrendador() && !this.isAdmin() ? this.rS.listMine() : this.rS.list();

    consulta.subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('No se pudo cargar la lista de resenas', 'Cerrar', { duration: 3000 });
      },
    });
  }

  isAdmin(): boolean {
    return this.loginService.tieneRol('ADMIN');
  }

  isArrendador(): boolean {
    return this.loginService.tieneRol('ARRENDADOR');
  }

  eliminar(id: number) {
    this.isDeleting = true;
    this.rS.delete(id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.snackBar.open('Reseña eliminada correctamente', 'Cerrar', { duration: 3000 });
        this.cargarResenias();
      },
      
    });
  }
}
