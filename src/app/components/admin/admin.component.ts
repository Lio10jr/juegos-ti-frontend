import { Component, OnInit } from '@angular/core';
import { ComponentesService } from 'src/app/service/components/componentes.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  selectedOption: string = '';
  showModal = false;

  constructor(private sidebarService: ComponentesService) {
    this.sidebarService.sidebarOption$.subscribe(option => {
      this.selectedOption = option;
    });
  }
  ngOnInit() {
    
  }

  openModal() {
    this.showModal = true;
    const openModal = document.querySelector('.ins');
    const modal = document.querySelector('.modal');
    const closeModal = document.querySelector('.modal-close');

    openModal!.addEventListener('click', (e) => {
        e.preventDefault();
        modal!.classList.add('modal--show');
    });

    closeModal!.addEventListener('click', (e) => {
        e.preventDefault();
        modal!.classList.remove('modal--show');
    });
  }

  closeModal() {
    this.showModal = false;
  }
}
