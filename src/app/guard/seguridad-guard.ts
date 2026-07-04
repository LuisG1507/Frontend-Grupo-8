import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login-service';

export const seguridadGuard: CanActivateFn = () => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  const autenticado = loginService.verificar();

  if (!autenticado) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
