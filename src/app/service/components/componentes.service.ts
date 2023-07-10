import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComponentesService {

  private sidebarOptionSubject = new Subject<string>();

  sidebarOption$ = this.sidebarOptionSubject.asObservable();

  setSidebarOption(option: string) {
    this.sidebarOptionSubject.next(option);
  }
}
