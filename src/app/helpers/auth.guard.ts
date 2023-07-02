import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { ApiService } from '../service/api/api.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(ApiService) as ApiService;
  const router = inject(Router);
  const token = authService.getToken();

  if (token) {
    return true;

  }
  router.navigate(['login']);
  return false;
};

