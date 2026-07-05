import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Background } from '../../../models/Background';
import { Backgroundservice } from '../../../services/backgroundservice';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DataSource } from '@angular/cdk/collections';

@Component({
  selector: 'app-background-list',
  imports: [MatProgressSpinnerModule, AsyncPipe, MatCardModule, MatTableModule, MatPaginatorModule, DatePipe, MatButtonModule, MatIconModule, MatSnackBarModule, RouterLink, MatInputModule, MatFormFieldModule],
  templateUrl: './background-list.html',
  styleUrl: './background-list.css',
})
export class BackgroundList implements OnInit {
  dataSource: MatTableDataSource<Background> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8'];
  datosF : any[] =[]
  

  isLoading: boolean = false;
  isDeleting: boolean = false;


  @ViewChild(MatPaginator) set paginator(mp: MatPaginator) {
    if (mp) {
      this.dataSource.paginator = mp;
    }
  }

  constructor(
    private bS: Backgroundservice,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarAntecedentes();
  }

  cargarAntecedentes() {
    this.isLoading = true;
    this.bS.list().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('No se pudo cargar la lista de antecedentes', 'Cerrar', { duration: 3000 });
      },
    });
  }

  eliminar(id: number) {
    this.isDeleting = true;
    this.bS.delete(id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.snackBar.open('Antecedente eliminado correctamente', 'Cerrar', { duration: 3000 });
        this.cargarAntecedentes();
      },
      error: () => {
        this.isDeleting = false;
        this.snackBar.open('No se pudo eliminar el antecedente', 'Cerrar', { duration: 3000 });
      },
    });
  }

  filtrar(event: Event) {
  const valorFiltro = (event.target as HTMLInputElement).value;
  this.dataSource.filter = valorFiltro.trim().toLowerCase();
}
}
