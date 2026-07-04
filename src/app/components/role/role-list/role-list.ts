import { AsyncPipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Role } from '../../../models/Role';
import { Roleservice } from '../../../services/roleservice';

@Component({
  selector: 'app-role-list',
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
  templateUrl: './role-list.html',
  styleUrl: './role-list.css',
})
export class RoleList implements OnInit {
  dataSource: MatTableDataSource<Role> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5'];

  isLoading: boolean = false;
  isDeleting: boolean = false;

  // Setter: se ejecuta cada vez que el mat-paginator aparece en el DOM
  // (incluso si @if lo destruye y lo vuelve a crear), asegurando que
  // siempre quede correctamente enlazado al dataSource.
  @ViewChild(MatPaginator) set paginator(mp: MatPaginator) {
    if (mp) {
      this.dataSource.paginator = mp;
    }
  }

  constructor(
    private rS: Roleservice,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarRoles();
  }

  cargarRoles() {
    this.isLoading = true;
    this.rS.list().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('No se pudo cargar la lista de roles', 'Cerrar', { duration: 3000 });
      },
    });
  }

  eliminar(id: number) {
    this.isDeleting = true;
    this.rS.delete(id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.snackBar.open('Rol eliminado correctamente', 'Cerrar', { duration: 3000 });
        this.cargarRoles();
      },
      error: () => {
        this.isDeleting = false;
        this.snackBar.open('No se pudo eliminar el rol', 'Cerrar', { duration: 3000 });
      },
    });
  }
}
