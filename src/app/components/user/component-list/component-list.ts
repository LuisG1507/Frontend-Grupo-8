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
import { User } from '../../../models/User';
import { Userservice } from '../../../services/userservice';

@Component({
  selector: 'app-component-list',
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
  templateUrl: './component-list.html',
  styleUrl: './component-list.css',
})
export class ComponentList implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<User> = new MatTableDataSource();
  displayedColumns: string[] = [
    'c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'c11', 'c12',
  ];

  isLoading: boolean = false;
  isDeleting: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private uS: Userservice,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.isLoading = true;
    this.uS.list().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
          this.paginator.firstPage();
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('No se pudo cargar la lista de usuarios', 'Cerrar', { duration: 3000 });
      },
    });
  }

  eliminar(id: number) {
    this.isDeleting = true;
    this.uS.delete(id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.snackBar.open('Usuario eliminado correctamente', 'Cerrar', { duration: 3000 });
        this.cargarUsuarios();
      },
      error: () => {
        this.isDeleting = false;
        this.snackBar.open('No se pudo eliminar el usuario', 'Cerrar', { duration: 3000 });
      },
    });
  }
}
