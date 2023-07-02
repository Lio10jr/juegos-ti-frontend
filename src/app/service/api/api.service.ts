import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { Credenciales } from 'src/app/models';
import { map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})

export class ApiService {

    private apiUrl: string = environment.apiUrl;
    options: any;

    private headers: HttpHeaders = new HttpHeaders({
        'enctype': 'multipart/form-data',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    });


    constructor(
        private _http: HttpClient,
        private cookieService: CookieService
    ) { }




    login(creds: Credenciales) {

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        return this._http.post(this.apiUrl + 'login', creds, {
            headers,
            withCredentials: true,
            observe: 'response'
        }).pipe(map((response: HttpResponse<any>) => {
            const body = response.body;

            const token = body.message;
            this.cookieService.set('token', token || '', 1);

            return body;
        }));
    }

    /* Metodo para retornar el token */
    getToken() {
        return this.cookieService.get('token');
    }
}