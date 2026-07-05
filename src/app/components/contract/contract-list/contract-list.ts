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
import { Contract } from '../../../models/Contract';
import { Contractservice } from '../../../services/contractservice';

@Component({
  selector: 'app-contract-list',
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
  templateUrl: './contract-list.html',
  styleUrl: './contract-list.css',
})
export class ContractList implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Contract> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9'];

  isLoading: boolean = false;
  isDeleting: boolean = false;

  @ViewChild(MatPaginator) set paginator(mp: MatPaginator) {
    if (mp) {
      this.dataSource.paginator = mp;
    }
  }

  constructor(
    private cS: Contractservice,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.cargarContratos();
  }

  cargarContratos() {
    this.isLoading = true;
    this.cS.list().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('No se pudo cargar la lista de contratos', 'Cerrar', { duration: 3000 });
      },
    });
  }

  eliminar(id: number) {
    this.isDeleting = true;
    this.cS.delete(id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.snackBar.open('Contrato eliminado correctamente', 'Cerrar', { duration: 3000 });
        this.cargarContratos();
      },
    });
  }
}
