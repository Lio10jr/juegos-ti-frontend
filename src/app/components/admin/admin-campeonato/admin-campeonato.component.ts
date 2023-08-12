import { Component, OnInit } from '@angular/core';
import { CampeonatoService } from 'src/app/service/api/campeonato.service';
import { Validators, FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { Campeonato } from 'src/app/models/Campeonato';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-campeonato',
  templateUrl: './admin-campeonato.component.html',
  styleUrls: ['./admin-campeonato.component.css']
})
export class AdminCampeonatoComponent {
  showModal = false;
  showModalUP = false;
  protected campeonatoForm: FormGroup;
  CampeonatoArray: any[] = [];
  CampeonatosFiltrados: any[] = [];
  opcionSeleccionadaEstado: string = '';
  isResultLoaded = false;
  isUpdateFormActive = false;
  campeonatoData: any;

  name: string = "";
  anio: string = "";
  estado_camp: string = "";

  constructor(private toastr: ToastrService, private ts: CampeonatoService) {
    this.campeonatoForm = this.createFormGroup();
    this.ts.getAllCampeonato().subscribe((resultData: any) => {
      this.isResultLoaded = true;
      this.CampeonatoArray = resultData;
      this.CampeonatosFiltrados = resultData;
    });
  }

  get name_camp() { return this.campeonatoForm.get('name_camp'); }
  get anio_camp() { return this.campeonatoForm.get('anio_camp'); }
  get estado() { return this.campeonatoForm.get('estado'); }

  onSelectCampeonato(event: any) {
    this.opcionSeleccionadaEstado = event.target.value;
    if (this.opcionSeleccionadaEstado != '') {
      this.isResultLoaded = true;
      this.CampeonatosFiltrados = this.CampeonatoArray.filter((camp) => (camp.estado + '') == this.opcionSeleccionadaEstado);
    } else {
      this.CampeonatosFiltrados = this.CampeonatoArray;
    }
  }

  createFormGroup() {
    return new FormGroup({
      name_camp: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      anio_camp: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      estado: new FormControl('', [
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

  onResetForm() {
    this.campeonatoForm.reset();
  }

  onSaveForm() {
    try {
      if (this.campeonatoForm.valid) {
        const formValues = this.campeonatoForm.value;
        console.log(formValues)
        const estadoSeleccionado = formValues.estado;
        if (estadoSeleccionado == "") {
          console.log('Seleccione un estado');
        } else {
          this.ts.addCampeonato(formValues.name_camp, formValues.anio_camp, formValues.estado).subscribe(
            () => {
              this.closeModalINS();
            }
          );
          this.ts.getAllCampeonato().subscribe((resultData: any) => {
            this.isResultLoaded = true;
            this.CampeonatoArray = resultData;
            this.CampeonatosFiltrados = resultData;
            this.toastr.success('Campeonato Creado!', 'Campeonato!');
          });
        }
      }
    } catch (error) {
      this.toastr.error('Error al Crear Campeonato!', 'Campeonato!');
      console.log(error);
    }

  }

  setUpdate(data: any) {
    this.name = data.name_camp;
    this.anio = data.anio_camp;
    this.estado_camp = data.estado;
    this.campeonatoData = data;
    this.openModalUP();
  }

  onUpdateForm(dataID: any) {
    try {
      let bodyData = {
        "name": this.name,
        "anio": this.anio,
        "estado_camp": this.estado_camp
      };

      const obCmap = new Campeonato(bodyData.name, bodyData.anio, bodyData.estado_camp);

      this.ts.updateCampeonato(dataID, obCmap).subscribe((resultData: any) => {
        this.onResetForm();
        this.closeModalUP();
      });
      this.ts.getAllCampeonato().subscribe((resultData: any) => {
        this.isResultLoaded = true;
        this.CampeonatoArray.splice(0, this.CampeonatoArray.length);
        this.CampeonatoArray = resultData;
        this.CampeonatosFiltrados = resultData;
        this.toastr.success('Campeonato Actualizado!', 'Campeonato!');
      });
    } catch (error) {
      this.toastr.error('Error al Actualizar Campeonato!', 'Campeonato!');
      console.log(error);
    }
  }

  setDelete(data: any) {
    try {
      this.ts.deleteCampeonato(data.pk_idcamp).subscribe((resultData: any) => {
        this.ts.getAllCampeonato().subscribe((resultData: any) => {
          this.isResultLoaded = true;
          this.CampeonatoArray.splice(0, this.CampeonatoArray.length);
          this.CampeonatoArray = resultData;
          this.CampeonatosFiltrados = resultData;
          this.toastr.success('Campeonato Eliminado!', 'Campeonato!');
        });
      });
    } catch (error) {
      this.toastr.error('Error al Eliminar Campeonato!', 'Campeonato!');
      console.log(error);
    }
  }

  openModalINS() {
    this.showModal = true;
  }

  closeModalINS() {
    this.showModal = false;
  }

  openModalUP() {
    this.showModalUP = true;
  }

  closeModalUP() {
    this.showModalUP = false;
  }

}
