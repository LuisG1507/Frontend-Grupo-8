import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Estate } from '../../../models/Estate';
import { Model3d } from '../../../models/Model3d';
import { Estateservice } from '../../../services/estateservice';
import { FirebaseStorageService } from '../../../services/firebase-storage.service';
import { LoginService } from '../../../services/login-service';
import { Model3dservice } from '../../../services/model3dservice';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-model3d-register',
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
  templateUrl: './model3d-register.html',
  styleUrl: './model3d-register.css',
})
export class Model3dRegister implements OnInit {
  model3d: Model3d = new Model3d();
  estates: Estate[] = [];
  selectedFile: File | null = null;
  selectedFileName = 'Ningún archivo seleccionado';
  saving = false;
  today: Date = new Date();

  constructor(
    private mS: Model3dservice,
    private eS: Estateservice,
    private storageService: FirebaseStorageService,
    private router: Router,
    private snackBar: MatSnackBar,
    private loginService: LoginService,
  ) {
    // El registro comienza con la fecha local y un estado inicial valido.
    this.model3d.createDate = new Date();
    this.model3d.state = 'ACTIVO';
  }

  /** Carga los inmuebles que se muestran en el selector de clave foranea. */
  ngOnInit(): void {
    if (this.loginService.tieneRol('ARRENDADOR') && !this.loginService.tieneRol('ADMIN')) {
      this.eS.listMine().subscribe((data) => (this.estates = data));
    } else {
      this.eS.list().subscribe((data) => (this.estates = data));
    }
  }

  /** Recibe el archivo del input y lo conserva solo si pasa las validaciones. */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (!file) {
      return;
    }

    const validationError = this.storageService.validateGlb(file);
    if (validationError) {
      this.selectedFile = null;
      this.selectedFileName = 'Ningún archivo seleccionado';
      input.value = '';
      this.snackBar.open(validationError, 'Cerrar', { duration: 3500 });
      return;
    }

    this.selectedFile = file;
    this.selectedFileName = file.name;
  }

  /** Sube el GLB y, con la URL obtenida, registra el Model3D en el backend. */
  async aceptar(): Promise<void> {
    if (!this.selectedFile) {
      this.snackBar.open('Selecciona el archivo GLB del modelo.', 'Cerrar', { duration: 3500 });
      return;
    }

    this.saving = true;
    let uploadedUrl = '';

    try {
      uploadedUrl = await this.storageService.uploadGlb(this.selectedFile);
      this.model3d.fileURL = uploadedUrl;
      this.model3d.createDate = this.formatearFecha(this.model3d.createDate);
      await firstValueFrom(this.mS.insert(this.model3d));
      this.snackBar.open('Modelo 3D registrado correctamente', 'Cerrar', { duration: 3000 });
      await this.router.navigate(['/models3d/list']);
    } catch (error) {
      // Si PostgreSQL rechaza el registro, se retira el archivo recien subido.
      if (uploadedUrl) {
        await this.storageService.deleteByUrl(uploadedUrl).catch(() => undefined);
      }
      this.snackBar.open(this.errorText(error, 'No se pudo registrar el modelo 3D.'), 'Cerrar', {
        duration: 4000,
      });
    } finally {
      this.saving = false;
    }
  }

  /** Regresa al listado sin realizar cambios. */
  cancelar() {
    this.router.navigate(['/models3d/list']);
  }

  /** Prioriza el mensaje enviado por Spring Boot y usa uno general como respaldo. */
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
