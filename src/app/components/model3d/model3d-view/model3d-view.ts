import { DatePipe } from '@angular/common';
import { afterNextRender, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Model3d } from '../../../models/Model3d';
import { Model3dservice } from '../../../services/model3dservice';

@Component({
  selector: 'app-model3d-view',
  imports: [DatePipe, MatButtonModule, MatIconModule, MatProgressSpinnerModule, RouterLink],
  templateUrl: './model3d-view.html',
  styleUrl: './model3d-view.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Model3dView implements OnInit {
  model3d: Model3d | null = null;
  loading = true;
  errorMessage = '';
  viewerError = '';

  constructor(
    private route: ActivatedRoute,
    private modelService: Model3dservice,
  ) {
    // El Web Component se importa solo en el navegador y despues del primer render.
    afterNextRender(() => void import('@google/model-viewer'));
  }

  /** Obtiene el ID de la ruta y consulta la URL del modelo mediante el backend. */
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.modelService.listId(id).subscribe({
      next: (data) => {
        this.model3d = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudo cargar el modelo 3D.';
        this.loading = false;
      },
    });
  }

  /** Admite tanto la relacion Estate completa como el campo idEstate de un DTO. */
  get estateId(): number {
    return Number(this.model3d?.estate?.idEstate ?? this.model3d?.idEstate ?? 0);
  }

  /** Limpia errores anteriores cuando model-viewer termina de cargar el GLB. */
  onViewerLoad(): void {
    this.viewerError = '';
  }

  /** Informa cuando la URL no responde o el contenido no es un GLB valido. */
  onViewerError(): void {
    this.viewerError = 'El archivo GLB no está disponible o no tiene un formato válido.';
  }
}
