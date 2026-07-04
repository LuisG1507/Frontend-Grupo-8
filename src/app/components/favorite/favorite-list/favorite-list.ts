import { AsyncPipe, DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
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
    RouterLink,
  ],
  templateUrl: './favorite-list.html',
  styleUrl: './favorite-list.css',
})
export class FavoriteList implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Favorite> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private favoriteService: Favoriteservice,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.favoriteService.list().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.paginator.firstPage();
    });
  }

  deleteFavorite(id: number): void {
    this.favoriteService.delete(id).subscribe(() => {
      this.snackBar.open('Favorito eliminado correctamente', 'Cerrar', { duration: 3000 });
      this.loadFavorites();
    });
  }
}
