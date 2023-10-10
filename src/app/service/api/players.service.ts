import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Players } from 'src/app/models/Players';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {
  private apiUrl: string = environment.apiUrl;
  options: any;

  private headers: HttpHeaders = new HttpHeaders({
    'enctype': 'multipart/form-data',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  });

  constructor(private _http: HttpClient) { }

  getAllPlayers() {
    return this._http.get(this.apiUrl + 'players');
  }

  getAllPlayersEquipo(fk_idequ: string) {
    return this._http.get(this.apiUrl + 'players/' + fk_idequ);
  }

  addPlayers(data: any): Observable<Players> {
    const newPlayers = new Players(data.pk_ced,data.nombre, data.apellido, data.semestre, data.f_nacimiento, data.fk_idequ);
    return this._http.post<Players>(this.apiUrl + 'playerssave', newPlayers);
  }

  updatePlayers(dataID: string, data: any) {
    const newPlayers = data;
    return this._http.put(this.apiUrl + 'playersupdate/' + dataID, newPlayers);
  }

  deletePlayers(data: any) {
    return this._http.delete(this.apiUrl + 'playersdelete/' + data);
  }
}
