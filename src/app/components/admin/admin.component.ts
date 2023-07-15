import { Component, OnInit } from '@angular/core';
import { ComponentesService } from 'src/app/service/components/componentes.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  selectedOption: string = '';

  constructor(private sidebarService: ComponentesService) {
    this.sidebarService.sidebarOption$.subscribe(option => {
      this.selectedOption = option;
    });
  }
  ngOnInit() {
    
  }

}
