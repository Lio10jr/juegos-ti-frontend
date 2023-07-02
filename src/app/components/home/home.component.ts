import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { ApiService } from 'src/app/service/api/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  message = '';
  private apiUrl: string = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    const token = this.apiService.getToken();
    if (token) {

      // Crear los encabezados de la solicitud
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });

      this.http.get(this.apiUrl + 'user', {
        headers,
        withCredentials: true
      }).subscribe(
        (response: any) => {
          this.message = `Hi ${response.name}`;
        },
        err => {
          this.message = 'No estas logeado';
        }
      );
    } else {
      this.message = 'No estas logeado';
    }
  }

}
