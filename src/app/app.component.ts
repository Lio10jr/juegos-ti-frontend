import { Component } from '@angular/core';
import { NgForm }   from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Campeonato Deportivo de la Escuela de T.I.';
  onSubmit(form: NgForm){
  	console.log(form.value);
  }
}
