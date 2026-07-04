import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsService {
  private loadPromise?: Promise<any>;
  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /** Carga el SDK de Maps una sola vez y espera su callback oficial de inicializacion. */
  load(): Promise<any> {
    if (!this.isBrowser) {
      return Promise.reject(new Error('Google Maps solo está disponible en el navegador.'));
    }

    const browserWindow = window as Window & {
      google?: any;
      smartRentGoogleMapsReady?: () => void;
    };
    if (typeof browserWindow.google?.maps?.importLibrary === 'function') {
      return Promise.resolve(browserWindow.google);
    }

    if (!this.loadPromise) {
      this.loadPromise = new Promise((resolve, reject) => {
        // Google ejecuta este callback cuando importLibrary ya esta disponible.
        browserWindow.smartRentGoogleMapsReady = () => {
          delete browserWindow.smartRentGoogleMapsReady;
          if (typeof browserWindow.google?.maps?.importLibrary === 'function') {
            resolve(browserWindow.google);
          } else {
            reject(new Error('Google Maps no terminÃ³ de inicializarse.'));
          }
        };

        const script = document.createElement('script');
        script.src =
          `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
            environment.googleMapsApiKey,
          )}&loading=async&libraries=marker&language=es&region=PE&callback=smartRentGoogleMapsReady`;
        script.async = true;
        script.defer = true;
        script.addEventListener(
          'error',
          () => {
            delete browserWindow.smartRentGoogleMapsReady;
            reject(new Error('No se pudo cargar Google Maps.'));
          },
          { once: true },
        );
        document.head.appendChild(script);
      });
    }

    return this.loadPromise;
  }

  /** Convierte una direccion escrita en un resultado con coordenadas geograficas. */
  async geocode(google: any, address: string): Promise<any> {
    const geocoder = new google.maps.Geocoder();
    const response = await geocoder.geocode({ address });
    if (!response.results.length) {
      throw new Error('Dirección no encontrada');
    }
    return response.results[0];
  }
}
