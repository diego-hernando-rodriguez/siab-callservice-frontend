import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent,
  HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiResponse } from '../interfaces';

/**
 * Intercepts HTTP responses to handle:
 * 1. Successful responses with success=false in the body (business errors)
 * 2. HTTP error responses (4xx, 5xx)
 * 3. Validation errors — marks fields as invalid
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse && event.body) {
          const body = event.body as ApiResponse<any>;
          if (body.success === false) {
            this.handleBusinessError(body);
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status >= 500) {
          this.showToast('Ocurrió un error inesperado. Intente nuevamente.');
        } else if (error.error && typeof error.error === 'object') {
          const apiError = error.error as ApiResponse<any>;
          if (apiError.errorCode === 'VALIDATION_ERROR' && apiError.data) {
            this.handleValidationErrors(apiError.data);
          } else if (apiError.message) {
            this.showToast(apiError.message);
          } else {
            this.showToast(`Error ${error.status}: ${error.statusText}`);
          }
        } else {
          this.showToast(`Error ${error.status}: ${error.statusText}`);
        }
        console.error('HTTP Error:', error);
        return throwError(() => error);
      })
    );
  }

  private handleBusinessError(body: ApiResponse<any>): void {
    if (body.message) {
      this.showToast(body.message);
    }
  }

  private handleValidationErrors(fieldErrors: Record<string, string>): void {
    const messages = Object.entries(fieldErrors)
      .map(([field, msg]) => `${field}: ${msg}`)
      .join('\n');
    this.showToast(messages || 'Error de validación');
  }

  /**
   * Shows a toast notification. In a real app this would use MessageService
   * from PrimeNG. For now we log to console; the component layer can
   * subscribe to a shared notification service.
   */
  private showToast(message: string): void {
    // TODO: inject PrimeNG MessageService and call this.messageService.add(...)
    console.warn('[ErrorInterceptor]', message);
  }
}
