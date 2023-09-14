import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api/api.service';
import { CookieService } from 'ngx-cookie-service';
import { catchError, finalize, tap } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  authenticated = false;
  protected apiUrl: string = environment.apiUrl;
  isAdmin = false;
  constructor( private http: HttpClient,private apiService: ApiService,
    private cookieService: CookieService) {}

  ngOnInit() {
    const token = this.apiService.getToken();

    if (token) {
      this.authenticated = true;
    }
    const access_token = this.apiService.getToken();
    if (access_token) {

      // Crear los encabezados de la solicitud
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
      });

      this.http.get(this.apiUrl + 'user', {
        headers,
        withCredentials: true
      }).subscribe(
        (response: any) => {
          if ( response.user.fk_rol === "04cbf312-2418-11ee-b6b0-088fc34793bc") {
            this.isAdmin = true;
          }
        }
      );
    }
  }

  logout(): void {
    const token = this.apiService.getToken();

    if (token) {

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });


      this.http.post('http://localhost:8000/api/logout', {}, {
        headers, withCredentials: true,
        observe: 'response'
      })
        .pipe(
          tap((response: HttpResponse<any>) => {
            // Realizar acciones adicionales si es necesario
          }),
          catchError((error: any) => {
            // Manejar el error en caso de que ocurra
            return throwError(error);
          }),
          finalize(() => {
            // Acciones finales después de la solicitud, como limpiar el localStorage
            this.cookieService.delete('access_token')
            localStorage.clear();
            this.authenticated = false;

          })
        )
        .subscribe();
    } else {
      // Manejar el caso en el que no se obtuvo un token válido
      console.log('No se encontró un token válido');
    }
  }
}
