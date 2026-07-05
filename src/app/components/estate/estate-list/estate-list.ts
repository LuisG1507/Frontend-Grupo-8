import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Estate } from '../../../models/Estate';
import { Estateservice } from '../../../services/estateservice';
import { LoginService } from '../../../services/login-service';

@Component({
  selector: 'app-estate-list',
  imports: [
    AsyncPipe,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ],
  templateUrl: './estate-list.html',
  styleUrl: './estate-list.css',
})
export class EstateList implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Estate> = new MatTableDataSource();
  allEstates: Estate[] = [];
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10'];

  districtInput: string = '';
  cityInput: string = '';
  typeInput: string = '';

  searchTitleInput: string = '';
  distritos: string[] = [];
  ciudades: string[] = [];
  tipos: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private eS: Estateservice,
    private snackBar: MatSnackBar,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.cargarInmuebles();
  }

  cargarInmuebles() {
    this.isLoading = true;

    if (this.isArrendador() && !this.isAdmin()) {
      this.eS.listMine().subscribe((data) => {
        this.allEstates = data;
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.paginator.firstPage();
        this.extraerFiltros(data);
      });
    } else {
      this.eS.list().subscribe((data) => {
        this.allEstates = data;
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.paginator.firstPage();
        this.extraerFiltros(data);
      });
    }
  }

  private extraerFiltros(data: Estate[]): void {
    if (this.ciudades.length === 0) {
      this.ciudades = [...new Set(data.map((e) => e.city).filter(Boolean))].sort();
      this.tipos = [...new Set(data.map((e) => e.type).filter(Boolean))].sort();
    }
    this.actualizarDistritos();
  }

  actualizarDistritos(): void {
    if (!this.cityInput) {
      this.distritos = [];
    } else {
      const filtrados = this.allEstates.filter(e => e.city === this.cityInput);
      this.distritos = [...new Set(filtrados.map(e => e.district).filter(Boolean))].sort();
    }
  }

  onCityChange(): void {
    this.districtInput = ''; // Limpiar distrito
    this.actualizarDistritos();
  }

  isAdmin(): boolean {
    return this.loginService.tieneRol('ADMIN');
  }

  isArrendador(): boolean {
    return this.loginService.tieneRol('ARRENDADOR');
  }

  isArrendatario(): boolean {
    return this.loginService.tieneRol('ARRENDATARIO');
  }


  limpiarFiltro(): void {
    this.cityInput = '';
    this.districtInput = '';
    this.typeInput = '';
    this.searchTitleInput = '';
    this.cargarInmuebles();
  }

  buscarFiltro(): void {
    if (!this.cityInput || !this.districtInput || !this.typeInput) {
      this.snackBar.open('Debes seleccionar Ciudad, Distrito y Tipo para filtrar.', 'Cerrar', { duration: 3000 });
      return;
    }
    this.eS.filtroEstate(this.cityInput, this.districtInput, this.typeInput).subscribe({
      next: (data) => {
        this.dataSource.data = data as any; 
        if (this.paginator) this.paginator.firstPage();
      },
      error: (_e: unknown) => {
        this.dataSource.data = [];
        this.snackBar.open('No hay inmuebles con ese filtro', 'Cerrar', { duration: 3000 });
      }
    });
  }


  buscarPorNombre(): void {
    if (!this.searchTitleInput.trim()) {
      this.cargarInmuebles();
      return;
    }
    const termino = this.searchTitleInput.toLowerCase().trim();
    const filtrados = this.allEstates.filter(e => e.title.toLowerCase().includes(termino));
    this.dataSource.data = filtrados;
    if (this.paginator) this.paginator.firstPage();
    if (filtrados.length === 0) {
      this.snackBar.open('No hay inmuebles con ese nombre', 'Cerrar', { duration: 3000 });
    }
  }


  eliminar(id: number) {
    if (!window.confirm(`¿Eliminar el inmueble #${id}?`)) {
      return;
    }
    this.eS.delete(id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.snackBar.open('Inmueble eliminado correctamente', 'Cerrar', { duration: 3000 });
        this.cargarInmuebles();
      },
      error: (error) => {
        this.isDeleting = false;
        const message =
          typeof error?.error === 'string' && error.error.trim()
            ? error.error
            : 'No se pudo eliminar el inmueble.';
        this.snackBar.open(message, 'Cerrar', { duration: 4500 });
      },
    });
  }
}
