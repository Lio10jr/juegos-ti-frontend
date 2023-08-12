import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  title = 'Campeonato Deportivo de la Escuela de T.I.';
  onSubmit(form: NgForm){
  	console.log(form.value);
  }

}
