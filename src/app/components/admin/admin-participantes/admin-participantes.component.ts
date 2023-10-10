import { Component, OnInit } from '@angular/core';
import { PlayersService } from 'src/app/service/api/players.service';
import { Router } from '@angular/router';
import { Validators, FormControl, FormGroup, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Players } from 'src/app/models/Players';
import { EquipoService } from 'src/app/service/api/equipo.service';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-admin-participantes',
  templateUrl: './admin-participantes.component.html',
  styleUrls: ['./admin-participantes.component.css']
})
export class AdminParticipantesComponent {
  protected apiUrl: string = environment.apiUrl;
  showModal = false;
  showModalUP = false;
  protected playersForm: FormGroup;
  EquipoArray: any[] = [];
  EquipoArrayRepresentante: any[] = [];
  PlayersFiltrados: any[] = [];
  PlayersArray: any[] = [];
  isResultLoaded = false;
  isUpdateFormActive = false;
  playersData: any;
  opcionSeleccionadaEquipo: string = '';
  ced: string = "";
  name: string = "";
  ape: string = "";
  semest: string = "";
  fecha!: Date;
  idequ: string = "";
  isAdmin = false;
  representanteUser: string = "";
  equipoRepresentante: string = "";
  idEquipo: string = "";
  
  constructor(private toastr: ToastrService, private ts: PlayersService, private tsE: EquipoService, private http: HttpClient, private apiService: ApiService) {
    const access_token = this.apiService.getToken();
    if (access_token) {

      // Crear los encabezados de la solicitud
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
      });

      this.http.get(this.apiUrl + 'user', {
        headers,
        withCredentials: true
      }).subscribe(
        (response: any) => {
          if ( response.user.fk_rol === "04cbf312-2418-11ee-b6b0-088fc34793bc") {
            this.isAdmin = true;
          } else {
            const nombres = response.user.nombre + " " + response.user.apellido;
            this.representanteUser = nombres;
          }
        }
      );
    }

    this.playersForm = this.createFormGroup();    
    this.tsE.getAllEquipo().subscribe((resultData: any) => {
      this.isResultLoaded = true;
      this.EquipoArray = resultData;
      let idequipo = "";
      this.EquipoArray.forEach((equipo: any, indice: number) => {
        if ( indice === 0 ) {
          idequipo = equipo.pk_idequ;
          this.idEquipo = equipo.pk_idequ;
        }
        if ( equipo.representante === this.representanteUser) {
          this.equipoRepresentante = equipo.pk_idequ;
          this.EquipoArrayRepresentante.push(equipo);
        }
      });
      this.ts.getAllPlayersEquipo(idequipo).subscribe((resultData: any) => {
        this.isResultLoaded = true;
        this.PlayersArray = resultData;
        this.PlayersFiltrados = resultData;
      });
    });
    
  }

  get pk_ced() { return this.playersForm.get('pk_ced'); }
  get nombre() { return this.playersForm.get('nombre'); }
  get apellido() { return this.playersForm.get('apellido'); }
  get semestre() { return this.playersForm.get('semestre'); }
  get f_nacimiento() { return this.playersForm.get('f_nacimiento'); }
  get fk_idequ() { return this.playersForm.get('fk_idequ'); }

  onSelectEquipo(event: any) {
    this.opcionSeleccionadaEquipo = event.target.value;
    if (this.opcionSeleccionadaEquipo != '') {
      this.idEquipo = event.target.value;
      this.ts.getAllPlayersEquipo(this.opcionSeleccionadaEquipo).subscribe((resultData: any) => {
        this.isResultLoaded = true;
        this.PlayersArray = resultData;
        this.PlayersFiltrados = resultData;
      });
    } else {
      this.PlayersFiltrados = [];
      this.PlayersArray = [];
    }
  }

  createFormGroup() {
    return new FormGroup({
      pk_ced: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
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

  onResetForm() {
    this.playersForm.reset();
  }

  obtenerNombreEquipo(fkEquipo: string): string {
    const equipo = this.EquipoArray.find(equipo => equipo.pk_idequ === fkEquipo);
    return equipo ? equipo.nom_equ : '';
  }

  onSaveForm() {
    try {
      if (this.playersForm.valid) {
        const formValues = this.playersForm.value;
        const semestreSeleccionado = formValues.semestre;
        if (semestreSeleccionado == "") {
          console.log('Seleccione un estado');
        } else {
          this.ts.addPlayers(formValues).subscribe(
            () => {              
              this.ts.getAllPlayersEquipo(this.idEquipo).subscribe((resultData: any) => {
                this.isResultLoaded = true;
                this.PlayersArray = resultData;
                this.PlayersFiltrados = resultData;
              });
              this.closeModalINS();
              this.toastr.success('Participante Creado!', 'Participante!');
              this.onResetForm();
            }
          );
        }
      }
    } catch (error) {
      this.toastr.error('Error al Crear Participante!', 'Participante!');
      console.log(error);
    }
    
  }

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
    try {
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
      this.ts.getAllPlayersEquipo(this.idEquipo).subscribe((resultData: any) => {
        this.isResultLoaded = true;
        this.PlayersArray.splice(0, this.EquipoArray.length);
        this.PlayersArray = resultData;
        this.PlayersFiltrados = resultData;
        this.toastr.success('Participante Actualizado!', 'Participante!');
      });
    } catch (error) {
      this.toastr.error('Error al Actualizar Participante!', 'Participante!');
      console.log(error);
    }
    
  }

  setDelete(data: any) {
    try {
      this.ts.deletePlayers(data.pk_ced).subscribe((resultData: any) => {
        this.ts.getAllPlayersEquipo(this.idEquipo).subscribe((resultData: any) => {
          this.isResultLoaded = true;
          this.PlayersArray.splice(0, this.PlayersArray.length);
          this.PlayersArray = resultData;
          this.PlayersFiltrados = resultData;
          this.toastr.success('Participante Eliminar!', 'Participante!');
      });
      });
    } catch (error) {
      this.toastr.error('Error al Eliminar Participante!', 'Participante!');
      console.log(error);
    }
  }

  openModalINS() {
    this.showModal = true;
  }

  closeModalINS() {
    this.onResetForm();
    this.showModal = false;
  }

  openModalUP() {
    this.showModalUP = true;
  }

  closeModalUP() {
    this.onResetForm();
    this.showModalUP = false;
  }
}
