import { Component } from '@angular/core';
import { EquipoService } from 'src/app/service/api/equipo.service';
import { Validators, FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { Equipo } from 'src/app/models/Equipo';
import { CampeonatoService } from 'src/app/service/api/campeonato.service';
import { environment } from 'src/app/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-equipos',
  templateUrl: './admin-equipos.component.html',
  styleUrls: ['./admin-equipos.component.css']
})

export class AdminEquiposComponent {
  protected apiUrlImg: string = environment.apiUrlImg;
  isLoading = false;
  showModal = false;
  showModalUP = false;
  protected equipoForm: FormGroup;
  EquipoArray: Equipo[] = [];
  CampeonatoArray: any[] = [];
  EquiposFiltrados: Equipo[] = [];
  isResultLoaded = false;
  isUpdateFormActive = false;
  equipoData: any;
  opcionSeleccionadaCamp: string = '';
  selectedFile: File | null = null;
  urlImg: string | null = null;
  name: string = "";
  log: string = "";
  semest: string = "";
  repre: string = "";
  idcamp: string = "";

  constructor(private toastr: ToastrService, private ts: EquipoService, private tsC: CampeonatoService) {
    this.isLoading = true;
    this.equipoForm = this.createFormGroup();
    this.ts.getAllEquipo().subscribe((resultData: any) => {
      this.isResultLoaded = true;
      this.EquipoArray = resultData;
      this.EquiposFiltrados = resultData;
    });
    this.tsC.getAllCampeonato().subscribe((resultData: any) => {
      this.isResultLoaded = true;
      this.CampeonatoArray = resultData;
    });
    this.isLoading = false;
  }

  get nom_equ() { return this.equipoForm.get('nom_equ'); }
  get semestre() { return this.equipoForm.get('semestre'); }
  get representante() { return this.equipoForm.get('representante'); }
  get fk_idcamp() { return this.equipoForm.get('fk_idcamp'); }

  onSelectCampeonato(event: any) {
    /* this.numGroupsSelected = event.target.value; */
    this.opcionSeleccionadaCamp = event.target.value;

    if (this.opcionSeleccionadaCamp != '') {
      this.isResultLoaded = true;
      this.EquiposFiltrados = this.EquipoArray.filter((equipo) => equipo.fk_idcamp === this.opcionSeleccionadaCamp);
    } else {
      this.EquiposFiltrados = this.EquipoArray;
    }
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
    try {
      if (this.equipoForm.valid) {
        const formValues = this.equipoForm.value;
        const campeonatoSeleccionado = formValues.estado;
        if (campeonatoSeleccionado == "") {
          this.toastr.info('Seleccione un Campeonato!', 'Equipo!');
        } else {
          if (this.selectedFile) {
            this.ts.addEquipo(formValues, this.selectedFile!).subscribe(
              () => {
                this.ts.getAllEquipo().subscribe((resultData: any) => {
                  this.isResultLoaded = true;
                  this.EquipoArray = resultData;
                  this.EquiposFiltrados = resultData;
                });
                this.closeModalINS();
                this.toastr.success('Equipo Creado!', 'Equipo!');
              }
            );
            this.selectedFile = null;
          } else {
            this.toastr.warning('Ingrese el logo del Equipo!', 'Equipo!');
          }

        }
      }
    } catch (error) {
      this.toastr.error('Error al Crear Equipo!', 'Equipo!');
      console.log(error);
    }

  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  setUpdate(data: any) {
    this.name = data.nom_equ;
    this.log = '';
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
    try {
      if (this.selectedFile) {

        const obEq = new Equipo('', bodyData.name, '', bodyData.semest, bodyData.repre, bodyData.idcamp);
        this.ts.updateEquipo(dataID, obEq, this.selectedFile!).subscribe((resultData: any) => {
          this.onResetForm();
          this.closeModalUP();
        });
        this.ts.getAllEquipo().subscribe((resultData: any) => {
          this.isResultLoaded = true;
          this.EquipoArray.splice(0, this.EquipoArray.length);
          this.EquipoArray = resultData;
          this.EquiposFiltrados = resultData;
          this.selectedFile = null;
          this.toastr.success('Equipo Actualizado!', 'Equipo!');
        });
      } else {
        const obEq = new Equipo('', bodyData.name, '', bodyData.semest, bodyData.repre, bodyData.idcamp);

        this.ts.updateEquipoEdit(dataID, obEq).subscribe((resultData: any) => {
          this.onResetForm();
          this.selectedFile = null;
          this.closeModalUP();
        });
        this.ts.getAllEquipo().subscribe((resultData: any) => {
          this.isResultLoaded = true;
          this.EquipoArray.splice(0, this.EquipoArray.length);
          this.EquipoArray = resultData;
          this.EquiposFiltrados = resultData;
          this.toastr.success('Equipo Actualizado!', 'Equipo!');
        });
      }
    } catch (error) {
      this.toastr.error('Error al Actualizar Equipo!', 'Equipo!');
      console.log(error);
    }

  }

  setDelete(data: any) {
    try {
      this.ts.deleteEquipo(data.pk_idequ).subscribe((resultData: any) => {
        this.ts.getAllEquipo().subscribe((resultData: any) => {
          this.isResultLoaded = true;
          this.EquipoArray.splice(0, this.EquipoArray.length);
          this.EquipoArray = resultData;
          this.EquiposFiltrados = resultData;
          this.toastr.success('Equipo Eliminado!', 'Equipo!');
        });
      });
    } catch (error) {
      this.toastr.error('Error al Eliminar Equipo!', 'Equipo!');
      console.log(error);
    }

  }

  openModalINS() {
    this.showModal = true;
  }

  closeModalINS() {
    this.selectedFile = null;
    this.showModal = false;
  }

  openModalUP() {
    this.showModalUP = true;
  }

  closeModalUP() {
    this.selectedFile = null;
    this.showModalUP = false;
  }

}
