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
import { RiskReport } from '../../../models/RiskReport';
import { LoginService } from '../../../services/login-service';
import { Riskreportservice } from '../../../services/riskreportservice';

@Component({
  selector: 'app-risk-report-list',
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
  templateUrl: './risk-report-list.html',
  styleUrl: './risk-report-list.css',
})
export class RiskReportList implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<RiskReport> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8'];

  isLoading: boolean = false;
  isDeleting: boolean = false;

  @ViewChild(MatPaginator) set paginator(mp: MatPaginator) {
    if (mp) {
      this.dataSource.paginator = mp;
    }
  }

  constructor(
    private rS: Riskreportservice,
    private snackBar: MatSnackBar,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.cargarReportes();
  }

  /** Selecciona el endpoint segun el rol, igual que en el listado de inmuebles. */
  cargarReportes() {
    this.isLoading = true;

    const consulta = this.isArrendador() && !this.isAdmin() ? this.rS.listMine() : this.rS.list();

    consulta.subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('No se pudo cargar la lista de reportes', 'Cerrar', { duration: 3000 });
      },
    });
  }

  isArrendador(): boolean {
    return this.loginService.tieneRol('ARRENDADOR');
  }

  isAdmin(): boolean {
    return this.loginService.tieneRol('ADMIN');
  }

  eliminar(id: number) {
    this.isDeleting = true;
    this.rS.delete(id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.snackBar.open('Reporte eliminado correctamente', 'Cerrar', { duration: 3000 });
        this.cargarReportes();
      },
      
    });
  }
}
