import { Component, OnInit } from '@angular/core';
import { PlayersService } from 'src/app/service/api/players.service';
import { Router } from '@angular/router';
import { Validators, FormControl, FormGroup, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Players } from 'src/app/models/Players';
import { EquipoService } from 'src/app/service/api/equipo.service';

@Component({
  selector: 'app-admin-participantes',
  templateUrl: './admin-participantes.component.html',
  styleUrls: ['./admin-participantes.component.css']
})
export class AdminParticipantesComponent implements OnInit {
  showModal = false;
  showModalUP = false;
  protected playersForm: FormGroup;
  EquipoArray: any[] = [];
  PlayersArray: any[] = [];
  isResultLoaded = false;
  isUpdateFormActive = false;
  playersData: any;

  ced: string = "";
  name: string = "";
  ape: string = "";
  semest: string = "";
  fecha!: Date;
  idequ: string = "";

  constructor(private router: Router, private ts: PlayersService, private tsE: EquipoService) {
    this.playersForm = this.createFormGroup();
  }

  get pk_ced() { return this.playersForm.get('pk_ced'); }
  get nombre() { return this.playersForm.get('nombre'); }
  get apellido() { return this.playersForm.get('apellido'); }
  get semestre() { return this.playersForm.get('semestre'); }
  get f_nacimiento() { return this.playersForm.get('f_nacimiento'); }
  get fk_idequ() { return this.playersForm.get('fk_idequ'); }

  createFormGroup() {
    return new FormGroup({
      pk_ced: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      apellido: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      semestre: new FormControl('', [
        Validators.required,
        this.validarSemestreSeleccionado,
      ]),
      f_nacimiento: new FormControl('', Validators.compose([
        Validators.required,
        this.validateMinDate(18),
      ])),
      fk_idequ: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
    });
  }

  validateMinDate(minAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value) {
        const fechaNacimiento = new Date(control.value);
        const fechaHoy = new Date();
        const edadMinima = minAge;

        const diferenciaEnMilisegundos = fechaHoy.getTime() - fechaNacimiento.getTime();
        const edad = Math.floor(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24 * 365.25));

        return edad >= edadMinima ? null : { minDate: true };
      }

      return null;
    };
  }

  validarSemestreSeleccionado(control: AbstractControl): { [key: string]: any } | null {
    if (control.value === '' || control.value === 'Seleccione un Semestre') {
      return { 'semestreInvalido': true };
    }
    return null;
  }

  ngOnInit() {
    this.ts.getAllPlayers().subscribe((resultData: any) => {
      this.isResultLoaded = true;
      this.PlayersArray = resultData;
    });
    this.tsE.getAllEquipo().subscribe((resultData: any) => {
      this.isResultLoaded = true;
      this.EquipoArray = resultData;
    });
  }

  onResetForm() {
    this.playersForm.reset();
  }

  obtenerNombreEquipo(fkEquipo: number): string {
    const equipo = this.EquipoArray.find(equipo => equipo.pk_idequ === fkEquipo);
    return equipo ? equipo.nom_equ : '';
  }

  onSaveForm() {
    if (this.playersForm.valid) {
      const formValues = this.playersForm.value;
      const semestreSeleccionado = formValues.semestre;
      if (semestreSeleccionado == "") {
        console.log('Seleccione un estado');
      } else {
        this.ts.addPlayers(formValues).subscribe(
          () => {
            this.ts.getAllPlayers().subscribe((resultData: any) => {
              this.isResultLoaded = true;
              this.PlayersArray = resultData;
            });
            this.closeModalINS();
          }
        );
      }
    }
  }

  setView(data: any) { }

  setUpdate(data: any) {
    this.ced = data.pk_ced;
    this.name = data.nombre;
    this.ape = data.apellido;
    this.semest = data.semestre;
    this.fecha = data.f_nacimiento;
    this.idequ = data.fk_idequ;
    this.playersData = data;
    this.openModalUP();
  }

  onUpdateForm(dataID: any) {

    let bodyData = {
      "ced": this.ced,
      "name": this.name,
      "ape": this.ape,
      "semest": this.semest,
      "fecha": this.fecha,
      "idequ": this.idequ,
    };

    const obPlay = new Players(bodyData.ced, bodyData.name, bodyData.ape, bodyData.semest, bodyData.fecha, bodyData.idequ);

    this.ts.updatePlayers(dataID, obPlay).subscribe((resultData: any) => {
      this.onResetForm();
      this.closeModalUP();
    });
    this.ts.getAllPlayers().subscribe((resultData: any) => {
      this.isResultLoaded = true;
      this.PlayersArray.splice(0, this.EquipoArray.length);
      this.PlayersArray = resultData;
    });
  }

  setDelete(data: any) {
    this.ts.deletePlayers(data.pk_ced).subscribe((resultData: any) => {
      this.ts.getAllPlayers().subscribe((resultData: any) => {
        this.isResultLoaded = true;
        this.PlayersArray.splice(0, this.PlayersArray.length);
        this.PlayersArray = resultData;
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
