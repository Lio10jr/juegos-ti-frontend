import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ApiService } from '../service/api/api.service';

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

