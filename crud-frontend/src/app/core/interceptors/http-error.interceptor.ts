import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const snackBar = inject(MatSnackBar);
      snackBar.open(extractErrorMessage(error), 'Cerrar', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        panelClass: ['mat-mdc-snack-bar-error'],
      });
      return throwError(() => error);
    }),
  );

function extractErrorMessage(error: HttpErrorResponse): string {
  if (error.error && typeof error.error === 'object') {
    const message = (error.error as { message?: unknown }).message;
    if (typeof message === 'string' && message) {
      return message;
    }
    if (Array.isArray(message)) {
      return message.map(String).join(' · ');
    }
  }
  if (typeof error.error === 'string' && error.error) {
    return error.error;
  }
  return `Error ${error.status ?? 'desconocido'} al procesar la peticion`;
}