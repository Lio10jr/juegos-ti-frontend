import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Equipo } from 'src/app/models/Equipo';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
    providedIn: 'root'
})

export class EquipoService {
    private apiUrl: string = environment.apiUrl;
    options: any;

    private headers: HttpHeaders = new HttpHeaders({
        'enctype': 'multipart/form-data',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    });
    constructor(private _http: HttpClient) { }

    getAllEquipo() {
        return this._http.get(this.apiUrl + 'equipos');
    }

    getEquipo(pk_idequ: string) {
        return this._http.get(this.apiUrl + 'equipos/' + pk_idequ);
    }

    addEquipo(formData: any, image: File): Observable<Equipo> {
        const formData1 = new FormData();
        formData1.append('nom_equ', formData.nom_equ);
        formData1.append('logo', formData.logo);
        formData1.append('semestre', formData.semestre);
        formData1.append('representante', formData.representante);
        formData1.append('fk_idcamp', formData.fk_idcamp);
        formData1.append('image', image);
        return this._http.post<Equipo>(this.apiUrl + 'equipossave', formData1);
    }

    updateEquipoEdit(dataID: string, data: any) {
        const equipo = data;
        return this._http.put(this.apiUrl + 'equiposupdateedit/' + dataID, equipo);
    }

    updateEquipo(dataID: string, data: any, image: File) {
        const equipo = data;
        const formData = new FormData();
        formData.append('nom_equ', equipo.nom_equ);
        formData.append('semestre', equipo.semestre);
        formData.append('representante', equipo.representante);
        formData.append('fk_idcamp', equipo.fk_idcamp);
        formData.append('image',  image);
        return this._http.post(this.apiUrl + 'equiposupdate/' + dataID, formData);
    }

    deleteEquipo(data: any) {
        return this._http.delete(this.apiUrl + 'equiposdelete/' + data);
    }
}