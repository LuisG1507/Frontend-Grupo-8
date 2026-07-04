import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';
import { LoginService } from '../services/login-service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        loginService.cerrar();
        router.navigate(['/login']);
      } else {
        const message =
          typeof error.error === 'string' && error.error.trim()
            ? error.error
            : 'Revise los datos ingresados e intente nuevamente.';
        snackBar.open(message, 'Cerrar', { duration: 4500 });
      }

      return throwError(() => error);
    })
  );
};
