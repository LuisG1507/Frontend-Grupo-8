import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Maps depende de window y del SDK remoto, por eso se renderiza en el navegador.
  {
    path: 'estates/map',
    renderMode: RenderMode.Client
  },
  // Firebase y model-viewer tambien necesitan APIs exclusivas del navegador.
  {
    path: 'models3d/**',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
