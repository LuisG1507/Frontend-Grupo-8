import { AsyncPipe, DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { User } from '../../../models/User';
import { Userservice } from '../../../services/userservice';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-component-list',
  imports: [AsyncPipe, MatCardModule, MatTableModule, MatPaginatorModule, DatePipe, MatButtonModule, MatIconModule, MatSnackBarModule, RouterLink, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './component-list.html',
  styleUrl: './component-list.css',
})
export class ComponentList implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<User> = new MatTableDataSource();
  allUsers: User[] = [];
  searchDniInput: string = '';
  displayedColumns: string[] = [
    'c0',
    'c1',
    'c2',
    'c3',
    'c4',
    'c5',
    'c6',
    'c7',
    'c8',
    'c9',
    'c10',
    'c11',
    'c12',
  ];

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
    this.uS.list().subscribe((data) => {
      this.allUsers = data;
      this.dataSource.data = data;
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
        this.paginator.firstPage();
      }
    });
  }

  buscarPorDni(): void {
    if (!this.searchDniInput.trim()) {
      this.cargarUsuarios();
      return;
    }
    const termino = this.searchDniInput.trim();
    const filtrados = this.allUsers.filter(u => u.dni && u.dni.toString().includes(termino));
    this.dataSource.data = filtrados;
    if (this.paginator) {
      this.paginator.firstPage();
    }
    if (filtrados.length === 0) {
      this.snackBar.open('No hay usuarios con ese DNI', 'Cerrar', { duration: 3000 });
    }
  }

  eliminar(id: number) {
    this.uS.delete(id).subscribe(() => {
      this.snackBar.open('Usuario eliminado correctamente', 'Cerrar', { duration: 3000 });
      this.cargarUsuarios();
    });
  }
}
