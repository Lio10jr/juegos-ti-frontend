import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Campeonato } from 'src/app/models/Campeonato';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CampeonatoService {

  private apiUrl: string = environment.apiUrl;
  options: any;

  private headers: HttpHeaders = new HttpHeaders({
    'enctype': 'multipart/form-data',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  });

  constructor(private _http: HttpClient) { }

  getAllCampeonato() {
    return this._http.get(this.apiUrl + 'campeonatos');
  }

  addCampeonato(name: string, anio: string, estado: string): Observable<Campeonato> {
    const newCampeonato = new Campeonato(name, anio, estado);
    return this._http.post<Campeonato>(this.apiUrl + 'campeonatossave', newCampeonato);
  }

  updateCampeonato(dataID: string, data: any) {
    const campeonato = data;
    return this._http.put(this.apiUrl + 'campeonatosupdate/' + dataID, campeonato);
  }

  deleteCampeonato(data: any) {
    return this._http.delete(this.apiUrl + 'campeonatosdelete/' + data);
  }
}
