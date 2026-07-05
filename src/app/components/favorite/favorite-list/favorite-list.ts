import { AsyncPipe, DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Favorite } from '../../../models/Favorite';
import { Favoriteservice } from '../../../services/favoriteservice';

@Component({
  selector: 'app-favorite-list',
  imports: [
    AsyncPipe,
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    RouterLink,
  ],
  templateUrl: './favorite-list.html',
  styleUrl: './favorite-list.css',
})
export class FavoriteList implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Favorite> = new MatTableDataSource();

  isLoading: boolean = false;
  isDeleting: boolean = false;

  // Setter: se ejecuta cada vez que el mat-paginator aparece en el DOM
  // (incluso si @if/@else lo destruye y lo vuelve a crear al terminar
  // la carga), asegurando que siempre quede correctamente enlazado
  // al dataSource, sin importar el orden en que se dispare.
  @ViewChild(MatPaginator) set paginator(mp: MatPaginator) {
    if (mp) {
      this.dataSource.paginator = mp;
    }
  }

  constructor(
    private favoriteService: Favoriteservice,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.isLoading = true;
    this.favoriteService.list().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('No se pudo cargar la lista de favoritos', 'Cerrar', { duration: 3000 });
      },
    });
  }

  deleteFavorite(id: number): void {
    this.isDeleting = true;
    this.favoriteService.delete(id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.snackBar.open('Favorito eliminado correctamente', 'Cerrar', { duration: 3000 });
        this.loadFavorites();
      },
      
    });
  }
}
