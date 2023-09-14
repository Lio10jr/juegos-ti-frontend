import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ApiService } from '../service/api/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(ApiService) as ApiService;
  const router = inject(Router);
  const access_token = authService.getToken();

  if (access_token) {
    return true;
  }
  router.navigate(['login']);
  return false;
};

export const authGuardRegistro: CanActivateFn = (route, state) => {
  const authService = inject(ApiService) as ApiService;
  const http = inject(HttpClient) as HttpClient;
  const urlApi = 'http://127.0.0.1:8000/api/';
  const router = inject(Router);
  const access_token = authService.getToken();
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${access_token}`
  });
  
  if (access_token) {
    http.get(urlApi + 'user', {
      headers,
      withCredentials: true
    }).subscribe(
      (response: any) => {
        if ( response.user.fk_rol !== "04cbf312-2418-11ee-b6b0-088fc34793bc") {
          router.navigate(['admin']);
          return false;
        }
        return true;
      }
    );
  }
  router.navigate(['login']);
  return false;
};


