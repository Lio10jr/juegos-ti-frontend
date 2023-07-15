import { Component, OnInit } from '@angular/core';
import { ComponentesService } from 'src/app/service/components/componentes.service';

@Component({
  selector: 'app-admin-participantes',
  templateUrl: './admin-participantes.component.html',
  styleUrls: ['./admin-participantes.component.css']
})
export class AdminParticipantesComponent implements OnInit  {
  showModal = false;
  
  constructor() {
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
