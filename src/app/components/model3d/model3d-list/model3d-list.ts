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
import { firstValueFrom } from 'rxjs';
import { Model3d } from '../../../models/Model3d';
import { FirebaseStorageService } from '../../../services/firebase-storage.service';
import { LoginService } from '../../../services/login-service';
import { Model3dservice } from '../../../services/model3dservice';

@Component({
  selector: 'app-model3d-list',
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
  templateUrl: './model3d-list.html',
  styleUrl: './model3d-list.css',
})
export class Model3dList implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Model3d> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'];
  deletingId: number | null = null;

  isLoading: boolean = false;

  @ViewChild(MatPaginator) set paginator(mp: MatPaginator) {
    if (mp) {
      this.dataSource.paginator = mp;
    }
  }

  constructor(
    private mS: Model3dservice,
    private storageService: FirebaseStorageService,
    private snackBar: MatSnackBar,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {}

  /** Solicita los modelos cuando la vista ya esta lista. */
  ngAfterViewInit(): void {
    this.cargarModelos();
  }

  /** El arrendador consulta sus modelos; los otros roles consultan la lista general. */
  cargarModelos() {
    this.isLoading = true;

    const consulta = this.isArrendador() && !this.isAdmin() ? this.mS.listMine() : this.mS.list();

    consulta.subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('No se pudo cargar la lista de modelos 3D', 'Cerrar', { duration: 3000 });
      },
    });
  }

  isAdmin(): boolean {
    return this.loginService.tieneRol('ADMIN');
  }

  isArrendador(): boolean {
    return this.loginService.tieneRol('ARRENDADOR');
  }

  /** Elimina primero el GLB remoto y luego su registro relacional. */
  async eliminar(model: Model3d): Promise<void> {
    if (!window.confirm(`¿Eliminar el modelo #${model.idModels3D}?`)) {
      return;
    }

    this.deletingId = model.idModels3D;
    try {
      await this.storageService.deleteByUrl(model.fileURL);
      await firstValueFrom(this.mS.delete(model.idModels3D));
      this.snackBar.open('Modelo 3D eliminado correctamente', 'Cerrar', { duration: 3000 });
      this.cargarModelos();
    } catch (error: any) {
      const message =
        typeof error?.error === 'string' && error.error.trim()
          ? error.error
          : 'No se pudo eliminar el modelo 3D.';
      this.snackBar.open(message, 'Cerrar', { duration: 4000 });
    } finally {
      this.deletingId = null;
    }
  }
}
