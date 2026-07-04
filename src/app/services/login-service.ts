import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';
import { JwtRequestDTO } from '../models/JwtRequestDTO';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  login(request: JwtRequestDTO) {
    return this.http.post<{ jwttoken: string }>(`${environment.base}/login`, request);
  }

  verificar(): boolean {
    if (!this.isBrowser()) {
      return false;
    }

    return sessionStorage.getItem('token') != null;
  }

  showRole(): string | null {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    return decodedToken?.roles ?? null;
  }

  showUsername(): string | null {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    return decodedToken?.sub ?? null;
  }

  tieneRol(rol: string): boolean {
    const roles = this.showRole();
    return roles ? roles.split(',').map((item) => item.trim()).includes(rol) : false;
  }

  cerrar(): void {
    if (this.isBrowser()) {
      sessionStorage.clear();
    }
  }

  private getToken(): string | null {
    if (!this.isBrowser()) {
      return null;
    }

    return sessionStorage.getItem('token');
  }
}
