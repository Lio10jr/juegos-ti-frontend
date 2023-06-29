import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Users } from 'src/app/Users';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UsersService {

  private apiUrl: string = environment.apiUrl;
  options:any;

  private headers: HttpHeaders = new HttpHeaders({
    'enctype': 'multipart/form-data',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  });

  constructor(private _http: HttpClient) { }

  //  USERS
  getUsers(): Observable<Users[]> {
    return this._http.get<Users[]>(this.apiUrl+'getUser');
  }

  addUsers(name:string,lastname:string,email:string,phone:number,passwors:string):Observable<Users>
  {
    const newUsers = new Users(name,lastname,email,phone,passwors);
    return this._http.post<Users>(this.apiUrl+'addUser', newUsers);
    //return this.http.post<Task>(`${this.apiUrl+'add'}`, newTask, { headers: this.headers });
  }
}
