import { Component, OnInit } from '@angular/core';
import { ComponentesService } from 'src/app/service/components/componentes.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  constructor(private sidebarService: ComponentesService) {}
  ngOnInit() {
  }

  onSidebarOptionSelected(option: string) {
    this.sidebarService.setSidebarOption(option);
  }
}
