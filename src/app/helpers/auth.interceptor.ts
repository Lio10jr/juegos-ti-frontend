import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../service/api/api.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private apiService: ApiService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const access_token = this.apiService.getToken();

    if (access_token) {
      const cloned = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${access_token}`)
      })
      return next.handle(cloned);
    }
    return next.handle(request);
  }
}
