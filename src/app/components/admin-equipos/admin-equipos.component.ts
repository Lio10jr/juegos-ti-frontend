import { Component, OnInit } from '@angular/core';
import { ComponentesService } from 'src/app/service/components/componentes.service';
import { EquipoService } from 'src/app/service/api/equipo.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { Equipo } from 'src/app/models/Equipo';
import { CampeonatoService } from 'src/app/service/api/campeonato.service';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-admin-equipos',
  templateUrl: './admin-equipos.component.html',
  styleUrls: ['./admin-equipos.component.css']
})

export class AdminEquiposComponent implements OnInit {
  protected apiUrlImg: string = environment.apiUrlImg;

  showModal = false;
  showModalUP = false;
  protected equipoForm: FormGroup;
  EquipoArray: any[] = [];
  CampeonatoArray: any[] = [];
  isResultLoaded = false;
  isUpdateFormActive = false;
  equipoData: any;
  selectedFile: File | null = null;
  urlImg: string | null = null;
  name: string = "";
  log: string = "";
  semest: string = "";
  repre: string = "";
  idcamp: string = "";

  constructor(private router: Router, private ts: EquipoService, private tsC: CampeonatoService) {
    this.equipoForm = this.createFormGroup();
  }

  get nom_equ() { return this.equipoForm.get('nom_equ'); }
  get semestre() { return this.equipoForm.get('semestre'); }
  get representante() { return this.equipoForm.get('representante'); }
  get fk_idcamp() { return this.equipoForm.get('fk_idcamp'); }

  ngOnInit() {
    this.ts.getAllEquipo().subscribe((resultData: any) => {
      this.isResultLoaded = true;
      this.EquipoArray = resultData;
    });
    this.tsC.getAllCampeonato().subscribe((resultData: any) => {
      this.isResultLoaded = true;
      this.CampeonatoArray = resultData;
    });
  }

  createFormGroup() {
    return new FormGroup({
      nom_equ: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      semestre: new FormControl('', [
        Validators.required,
        this.validarSemestreSeleccionado,
      ]),
      representante: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      fk_idcamp: new FormControl('', [
        Validators.required,
        this.validarCampeonatoSeleccionado,
      ]),
    });
  }

  validarCampeonatoSeleccionado(control: AbstractControl): { [key: string]: any } | null {
    if (control.value === '' || control.value === 'Seleccione un Campeonato') {
      return { 'campeonatoInvalido': true };
    }
    return null;
  }

  validarSemestreSeleccionado(control: AbstractControl): { [key: string]: any } | null {
    if (control.value === '' || control.value === 'Seleccione un Semestre') {
      return { 'semestreInvalido': true };
    }
    return null;
  }

  onResetForm() {
    this.selectedFile = null;
    this.equipoForm.reset();
  }

  onSaveForm() {
    if (this.equipoForm.valid) {
      const formValues = this.equipoForm.value;
      const campeonatoSeleccionado = formValues.estado;
      if (campeonatoSeleccionado == "") {
        console.log('Seleccione un Campeonato');
      } else {
        if (this.selectedFile) {
          this.ts.addEquipo(formValues, this.selectedFile!).subscribe(
            () => {
              this.ts.getAllEquipo().subscribe((resultData: any) => {
                this.isResultLoaded = true;
                this.EquipoArray = resultData;
              });
              this.closeModalINS();
            }
          );
          this.selectedFile = null;
        }

      }
    }
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }


  setView(data: any) {
    const formValues = this.equipoForm.value;
    this.ts.deleteEquipo(formValues).subscribe((resultData: any) => {
      this.ts.getAllEquipo();
    });
  }

  setUpdate(data: any) {
    this.name = data.nom_equ;
    this.log ='';
    this.semest = data.semestre;
    this.repre = data.representante;
    this.idcamp = data.fk_idcamp;
    this.equipoData = data;
    this.openModalUP();
  }

  onUpdateForm(dataID: any) {
    const bodyData = {
      "name": this.name,
      "semest": this.semest,
      "repre": this.repre,
      "idcamp": this.idcamp
    };
    if (this.selectedFile) {
      
      const obEq = new Equipo(bodyData.name,'',bodyData.semest,bodyData.repre, bodyData.idcamp);
      this.ts.updateEquipo(dataID, obEq, this.selectedFile!).subscribe((resultData: any) => {
        this.onResetForm();
        this.closeModalUP();
      });
      this.ts.getAllEquipo().subscribe((resultData: any) => {
        this.isResultLoaded = true;
        this.EquipoArray.splice(0, this.EquipoArray.length);
        this.EquipoArray = resultData;
        this.selectedFile = null;
      });
    }else {
      const obEq = new Equipo(bodyData.name,'',bodyData.semest,bodyData.repre, bodyData.idcamp);

      this.ts.updateEquipoEdit(dataID, obEq).subscribe((resultData: any) => {
        this.onResetForm();
        this.selectedFile = null;
        this.closeModalUP();
      });
      this.ts.getAllEquipo().subscribe((resultData: any) => {
        this.isResultLoaded = true;
        this.EquipoArray.splice(0, this.EquipoArray.length);
        this.EquipoArray = resultData;
      });
    }
  }

  setDelete(data: any) {
    this.ts.deleteEquipo(data.pk_idequ).subscribe((resultData: any) => {
      this.ts.getAllEquipo().subscribe((resultData: any) => {
        this.isResultLoaded = true;
        this.EquipoArray.splice(0, this.EquipoArray.length);
        this.EquipoArray = resultData;
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
    this.selectedFile = null;
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
    this.selectedFile = null;
    this.showModalUP = false;
  }

}
