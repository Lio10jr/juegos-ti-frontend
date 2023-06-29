import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Task } from '../Task'; 
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})

export class TaskService {

  private apiUrl: string = environment.apiUrl;
  options:any;

  private headers: HttpHeaders = new HttpHeaders({
    'enctype': 'multipart/form-data',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  });

  constructor(private _http: HttpClient) {
  }

  addTask(title:string):Observable<Task>
  {
    const newTask = new Task(title);
    return this._http.post<Task>(this.apiUrl, newTask);
    //return this.http.post<Task>(`${this.apiUrl+'add'}`, newTask, { headers: this.headers });
  }

  getTasks(): Observable<Task[]> {
    return this._http.get<Task[]>(this.apiUrl);
  }



/* 
  createTask(task: any) {
    return this.http.post(`${this.apiUrl}`, task, { headers: this.headers });
  }

  updateTask(taskId: number, updatedTask: any) {
    return this.http.put(`${this.apiUrl}/${taskId}`, updatedTask, { headers: this.headers });
  }

  deleteTask(taskId: number) {
    return this.http.delete(`${this.apiUrl}/${taskId}`, { headers: this.headers });
  } */
}
