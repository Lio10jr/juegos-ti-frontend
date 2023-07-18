import { Component, OnInit } from '@angular/core';
import { ComponentesService } from 'src/app/service/components/componentes.service';
import { CampeonatoService } from 'src/app/service/campeonato/campeonato.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { Campeonato } from 'src/app/models/Campeonato';

@Component({
  selector: 'app-admin-campeonato',
  templateUrl: './admin-campeonato.component.html',
  styleUrls: ['./admin-campeonato.component.css']
})
export class AdminCampeonatoComponent implements OnInit {
  showModal = false;
  showModalUP = false;
  protected campeonatoForm: FormGroup;
  CampeonatoArray : any[] = [];
  isResultLoaded = false;
  isUpdateFormActive = false;
  campeonatoData: any;

  name: string ="";
  anio: string ="";
  estado_camp: string ="";

  constructor( private router: Router, private ts: CampeonatoService){
    this.campeonatoForm = this.createFormGroup();
  }

  get name_camp() { return this.campeonatoForm.get('name_camp'); }
  get anio_camp() { return this.campeonatoForm.get('anio_camp'); }
  get estado() { return this.campeonatoForm.get('estado'); }

  createFormGroup() {
    return new FormGroup({
      name_camp: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      anio_camp: new FormControl('',[
        Validators.required,
        Validators.minLength(4),
      ]),
      estado: new FormControl('',[ 
        Validators.required,
        this.validarEstadoSeleccionado,
      ]),
    });
  }

  validarEstadoSeleccionado(control: AbstractControl): { [key: string]: any } | null {
    if (control.value === '' || control.value === 'Seleccione un Estado') {
      return { 'estadoInvalido': true };
    }
    return null;
  }

  ngOnInit() {
    this.ts.getAllCampeonato().subscribe((resultData: any)=>
    {
        this.isResultLoaded = true;
        this.CampeonatoArray = resultData;
    });
  }

  onResetForm() {
    this.campeonatoForm.reset();
  }

  onSaveForm() {
    if (this.campeonatoForm.valid) {      
      const formValues = this.campeonatoForm.value;
      const estadoSeleccionado = formValues.estado;
      if (estadoSeleccionado == "" ) {
        console.log('Seleccione un estado');        
      } else {
        this.ts.addCampeonato(formValues.name_camp,formValues.anio,formValues.estado).subscribe(
          ()=>{ 
            this.ts.getAllCampeonato().subscribe((resultData: any)=>
            {
                this.isResultLoaded = true;
                this.CampeonatoArray = resultData;
            });
            this.closeModalINS();
          }
        );
      }
    }    
  }

  setView(data: any)
  {   
    const formValues = this.campeonatoForm.value;
    this.ts.deleteCampeonato(formValues).subscribe((resultData: any)=>
    {
      this.ts.getAllCampeonato();   
    });
  }

  setUpdate(data: any)
  {  
    this.name = data.name_camp;
    this.anio = data.anio_camp;
    this.estado_camp = data.estado;
    this.campeonatoData = data;
    this.openModalUP();
  }

  onUpdateForm(dataID: any) {
    
    let bodyData = {
      "name" : this.name,
      "anio" : this.anio,
      "estado_camp" : this.estado_camp
    };

    const obCmap = new Campeonato(bodyData.name,bodyData.anio,bodyData.estado_camp);

    this.ts.updateCampeonato(dataID,obCmap).subscribe((resultData: any)=>
      {
        this.onResetForm();
        this.closeModalUP();  
      });
    this.ts.getAllCampeonato().subscribe((resultData: any)=>
    {
        this.isResultLoaded = true;
        this.CampeonatoArray.splice(0, this.CampeonatoArray.length);
        this.CampeonatoArray = resultData;
    });
  }

  setDelete(data: any)
  {   
    this.ts.deleteCampeonato(data.pk_idcamp).subscribe((resultData: any)=>
    {
      this.ts.getAllCampeonato().subscribe((resultData: any)=>
      {
          this.isResultLoaded = true;
          this.CampeonatoArray.splice(0, this.CampeonatoArray.length);
          this.CampeonatoArray = resultData;
      });
   
    });    
  }

  openModalINS() {
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

  closeModalINS() {
    this.showModal = false;
  }

  openModalUP() {
    this.showModalUP = true;
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

  closeModalUP() {
    this.showModalUP = false;
  }
  
}
