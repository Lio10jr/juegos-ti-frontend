import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { Tabla_Posiciones } from 'src/app/models/Tabla_Posiciones';

@Injectable({
  providedIn: 'root'
})
export class PosicionesService {
  private apiUrl: string = environment.apiUrl;
  options: any;
  
  constructor(private _http: HttpClient) { }

  getAllP() {
    return this._http.get(this.apiUrl + 'tabla_posiciones');
  }

  getAllPosiciones() {
    return this._http.get(this.apiUrl + 'tabla_posicionesView');
  }

  getPosicionesById(id_posicion: string, id_campeonato:string) {
    return this._http.get(this.apiUrl + 'tabla_posiciones/' + id_posicion + '/' + id_campeonato);
  }

  getPosicionesByCampView(id_campeonato:string) {
    return this._http.get(this.apiUrl + 'tabla_posicionesView/' + id_campeonato);
  }

  getPosicionesByCampT(id_campeonato:string) {
    return this._http.get(this.apiUrl + 'tabla_posiciones/' + id_campeonato);
  }

  addPosiciones(data: Tabla_Posiciones): Observable<Tabla_Posiciones> {
    return this._http.post<Tabla_Posiciones>(this.apiUrl + 'tabla_posicionessave', data);
  }

  updatePosiciones(dataID: string, data: any) {
    const newTablaPosicion = data;
    return this._http.put(this.apiUrl + 'tabla_posicionesupdate/' + dataID, newTablaPosicion);
  }

  deletePosiciones(data: any) {
    return this._http.delete(this.apiUrl + 'tabla_posicionesdelete/' + data);
  }
}
