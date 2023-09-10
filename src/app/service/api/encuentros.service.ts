import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Encuentros } from 'src/app/models/Encuentros';
import { Fase_Encuentros } from 'src/app/models/Fase_Encuentros';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncuentrosService {
  private apiUrl: string = environment.apiUrl;
  options: any;

  constructor(private _http: HttpClient) { }

  getAllEncuentros() {
    return this._http.get(this.apiUrl + 'encuentros');
  }

  getEncuentrosById(id_enc: string) {
    return this._http.get(this.apiUrl + 'encuentros/' + id_enc);
  }

  getEncuentrosByIdCamp(idcamp: string) {
    return this._http.get(this.apiUrl + 'encuentrosCamp/' + idcamp);
  }

  addEncuentros(data: Encuentros): Observable<Encuentros> {
    return this._http.post<Encuentros>(this.apiUrl + 'encuentrossave', data);
  }

  updateEncuentros(dataID: string, data: any) {
    const newEncuentros = data;
    return this._http.put(this.apiUrl + 'encuentrosupdate/' + dataID, newEncuentros);
  }

  deleteEncuentros(data: any) {
    return this._http.delete(this.apiUrl + 'encuentrosdelete/' + data);
  }

  /* Fase Encuentros */
  getAllFaseEncuentros() {
    return this._http.get(this.apiUrl + 'fencuentros');
  }

  getFaseEncuentrosByIdCamp(idcamp: string) {
    return this._http.get(this.apiUrl + 'viewencuentros/' + idcamp);
  }

  addFase_Encuentros(data: Fase_Encuentros): Observable<Fase_Encuentros> {
    return this._http.post<Fase_Encuentros>(this.apiUrl + 'fencuentrossave', data);
  }

  updateFase_Encuentros(dataID: string, data: any) {
    const newEncuentros = data;
    return this._http.put(this.apiUrl + 'fencuentrosupdate/' + dataID, newEncuentros);
  }

  deleteFase_Encuentros(data: any) {
    return this._http.delete(this.apiUrl + 'fencuentrosdelete/' + data);
  }

  /* View Encuentros Fase */
  getAllViewEncuentros() {
    return this._http.get(this.apiUrl + 'viewencuentros');
  }

  getFaseEncuentrosBy(id_fase_e: string) {
    return this._http.get(this.apiUrl + 'fencuentros/' + id_fase_e);
  }

  getAllViewEncuentrosByCamp(fk_idcamp: string) {
    return this._http.get(this.apiUrl + 'viewencuentrosCamp/' + fk_idcamp);
  }
}
