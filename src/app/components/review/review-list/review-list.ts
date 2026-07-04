import { AsyncPipe, DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Review } from '../../../models/Review';
import { LoginService } from '../../../services/login-service';
import { Reviewservice } from '../../../services/reviewservice';

@Component({
  selector: 'app-review-list',
  imports: [AsyncPipe, MatCardModule, MatTableModule, MatPaginatorModule, DatePipe, MatButtonModule, MatIconModule, MatSnackBarModule, RouterLink],
  templateUrl: './review-list.html',
  styleUrl: './review-list.css',
})
export class ReviewList implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Review> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private rS: Reviewservice,
    private snackBar: MatSnackBar,
    private loginService: LoginService,
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.cargarResenias();
  }

  /** El arrendador recibe solo las resenas de sus inmuebles; los otros roles consultan la lista general. */
  cargarResenias() {
    const consulta = this.isArrendador() && !this.isAdmin()
      ? this.rS.listMine()
      : this.rS.list();

    consulta.subscribe((data) => {
      this.dataSource.data = data;
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
        this.paginator.firstPage();
      }
    });
  }

  isAdmin(): boolean {
    return this.loginService.tieneRol('ADMIN');
  }

  isArrendador(): boolean {
    return this.loginService.tieneRol('ARRENDADOR');
  }

  eliminar(id: number) {
    this.rS.delete(id).subscribe(() => {
      this.snackBar.open('Reseña eliminada correctamente', 'Cerrar', { duration: 3000 });
      this.cargarResenias();
    });
  }
}
