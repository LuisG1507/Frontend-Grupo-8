import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Estate } from '../../../models/Estate';
import { Estateservice } from '../../../services/estateservice';
import { GoogleMapsService } from '../../../services/google-maps.service';
import { LoginService } from '../../../services/login-service';

@Component({
  selector: 'app-estate-map',
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule, RouterLink],
  templateUrl: './estate-map.html',
  styleUrl: './estate-map.css',
})
export class EstateMap implements AfterViewInit {
  @ViewChild('mapCanvas') mapCanvas!: ElementRef<HTMLDivElement>;

  loading = true;
  errorMessage = '';
  totalEstates = 0;
  locatedEstates = 0;
  unlocatedEstates = 0;
  private readonly isBrowser: boolean;

  constructor(
    private estateService: Estateservice,
    private googleMapsService: GoogleMapsService,
    private loginService: LoginService,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /** Espera que exista el contenedor HTML antes de construir el mapa. */
  ngAfterViewInit(): void {
    if (this.isBrowser) {
      void this.loadMap();
    }
  }

  /** Lista inmuebles, geocodifica sus direcciones y crea un marcador por resultado. */
  private async loadMap(): Promise<void> {
    try {
      let estates: Estate[];

      if (this.isArrendador() && !this.isAdmin()) {
        estates = await firstValueFrom(this.estateService.listMine());
      } else {
        estates = await firstValueFrom(this.estateService.list());
      }

      const google = await this.googleMapsService.load();
      this.totalEstates = estates.length;

      // Cada biblioteca se espera explicitamente para evitar errores de carga asincrona.
      const { Map, InfoWindow } = await google.maps.importLibrary('maps');
      const { LatLngBounds } = await google.maps.importLibrary('core');
      const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');

      const map = new Map(this.mapCanvas.nativeElement, {
        center: { lat: -12.0464, lng: -77.0428 },
        zoom: 11,
        mapId: 'DEMO_MAP_ID',
        mapTypeControl: false,
        streetViewControl: false,
      });
      const infoWindow = new InfoWindow();
      const bounds = new LatLngBounds();

      for (const estate of estates) {
        const address = this.estateAddress(estate);
        if (!address) {
          this.unlocatedEstates++;
          continue;
        }

        try {
          // Geocoding transforma el texto de la direccion en latitud y longitud.
          const result = await this.googleMapsService.geocode(google, address);
          const marker = new AdvancedMarkerElement({
            map,
            position: result.geometry.location,
            title: estate.title,
          });

          marker.addListener('click', () => {
            infoWindow.setContent(this.createInfoContent(estate, result.formatted_address));
            infoWindow.open({ map, anchor: marker });
          });

          bounds.extend(result.geometry.location);
          this.locatedEstates++;
        } catch {
          this.unlocatedEstates++;
        }
      }

      if (this.locatedEstates > 0) {
        // Ajusta el encuadre para que todos los marcadores sean visibles.
        map.fitBounds(bounds);
        google.maps.event.addListenerOnce(map, 'idle', () => {
          if ((map.getZoom() ?? 0) > 16) {
            map.setZoom(16);
          }
        });
      } else if (estates.length > 0) {
        this.errorMessage = 'Google Maps no pudo localizar las direcciones registradas.';
      }
    } catch (error) {
      console.error('Error al cargar Google Maps:', error);
      const detail = error instanceof Error ? error.message : '';
      this.errorMessage = detail
        ? `No se pudo cargar el mapa: ${detail}`
        : 'No se pudo cargar el mapa o la lista de inmuebles.';
    } finally {
      this.loading = false;
    }
  }

  isArrendador(): boolean {
    return this.loginService.tieneRol('ARRENDADOR');
  }

  isAdmin(): boolean {
    return this.loginService.tieneRol('ADMIN');
  }

  /** Forma la direccion que Google intentara localizar. */
  private estateAddress(estate: Estate): string {
    return [estate.adress, estate.district, estate.city].filter(Boolean).join(', ');
  }

  /** Construye de forma segura el contenido mostrado al pulsar un marcador. */
  private createInfoContent(estate: Estate, formattedAddress: string): HTMLElement {
    const content = document.createElement('div');
    const title = document.createElement('strong');
    const address = document.createElement('p');
    const price = document.createElement('span');

    title.textContent = estate.title;
    address.textContent = formattedAddress;
    price.textContent = `S/ ${estate.monthlyPrice.toFixed(2)} al mes`;
    content.append(title, address, price);
    return content;
  }
}
