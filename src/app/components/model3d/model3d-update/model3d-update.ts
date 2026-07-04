import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Estate } from '../../../models/Estate';
import { Model3d } from '../../../models/Model3d';
import { Estateservice } from '../../../services/estateservice';
import { FirebaseStorageService } from '../../../services/firebase-storage.service';
import { LoginService } from '../../../services/login-service';
import { Model3dservice } from '../../../services/model3dservice';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-model3d-update',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDatepickerModule,
  ],
  templateUrl: './model3d-update.html',
  styleUrl: './model3d-update.css',
})
export class Model3dUpdate implements OnInit {
  model3d: Model3d = new Model3d();
  estates: Estate[] = [];
  id: number = 0;
  selectedFile: File | null = null;
  selectedFileName = 'Conservar archivo actual';
  saving = false;
  originalFileUrl = '';
  today: Date = new Date();

  constructor(
    private mS: Model3dservice,
    private eS: Estateservice,
    private storageService: FirebaseStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private loginService: LoginService,
  ) {}

  /** Recupera el registro, su inmueble y la URL que debe conservarse o reemplazarse. */
  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.loginService.tieneRol('ARRENDADOR') && !this.loginService.tieneRol('ADMIN')) {
      this.eS.listMine().subscribe((data) => (this.estates = data));
    } else {
      this.eS.list().subscribe((data) => (this.estates = data));
    }
    this.mS.listId(this.id).subscribe((data) => {
      this.model3d = data;
      this.model3d.idEstate = data.estate?.idEstate ?? data.idEstate;
      this.originalFileUrl = data.fileURL;
      this.model3d.createDate = new Date(`${data.createDate}T00:00:00`);
    });
  }

  /** Valida el nuevo GLB sin modificar todavia el archivo almacenado. */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (!file) {
      return;
    }

    const validationError = this.storageService.validateGlb(file);
    if (validationError) {
      this.selectedFile = null;
      this.selectedFileName = 'Conservar archivo actual';
      input.value = '';
      this.snackBar.open(validationError, 'Cerrar', { duration: 3500 });
      return;
    }

    this.selectedFile = file;
    this.selectedFileName = file.name;
  }

  /** Actualiza los datos y reemplaza el archivo solamente cuando se selecciono otro GLB. */
  async aceptar(): Promise<void> {
    this.saving = true;
    let uploadedUrl = '';
    let cleanupWarning = false;

    try {
      if (this.selectedFile) {
        uploadedUrl = await this.storageService.uploadGlb(this.selectedFile);
        this.model3d.fileURL = uploadedUrl;
      }

      this.model3d.createDate = this.formatearFecha(this.model3d.createDate);
      await firstValueFrom(this.mS.update(this.model3d));

      if (uploadedUrl && this.originalFileUrl !== uploadedUrl) {
        // El archivo anterior se borra solo despues de confirmar el update del backend.
        try {
          await this.storageService.deleteByUrl(this.originalFileUrl);
        } catch {
          cleanupWarning = true;
        }
      }

      this.snackBar.open(
        cleanupWarning
          ? 'Modelo actualizado. No se pudo retirar el archivo anterior.'
          : 'Modelo 3D actualizado correctamente',
        'Cerrar',
        { duration: 4000 },
      );
      await this.router.navigate(['/models3d/list']);
    } catch (error) {
      // Si el update falla, se elimina el archivo nuevo y se restaura la URL original.
      if (uploadedUrl) {
        await this.storageService.deleteByUrl(uploadedUrl).catch(() => undefined);
        this.model3d.fileURL = this.originalFileUrl;
      }
      this.snackBar.open(this.errorText(error, 'No se pudo actualizar el modelo 3D.'), 'Cerrar', {
        duration: 4000,
      });
    } finally {
      this.saving = false;
    }
  }

  /** Regresa al listado sin guardar modificaciones. */
  cancelar() {
    this.router.navigate(['/models3d/list']);
  }

  /** Extrae el mensaje del backend cuando existe. */
  private errorText(error: any, fallback: string): string {
    return typeof error?.error === 'string' && error.error.trim() ? error.error : fallback;
  }

  formatearFecha(fecha: Date | string): string {
    if (typeof fecha === 'string') {
      return fecha.includes('T') ? fecha.split('T')[0] : fecha;
    }
    const year = fecha.getFullYear();
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const day = fecha.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
