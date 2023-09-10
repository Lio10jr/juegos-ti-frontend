import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { isEmpty } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { Equipo } from 'src/app/models/Equipo';
import { ViewEncuentrosFase } from 'src/app/models/ViewEncuentrosFase';
import { CampeonatoService } from 'src/app/service/api/campeonato.service';
import { EncuentrosService } from 'src/app/service/api/encuentros.service';
import { EquipoService } from 'src/app/service/api/equipo.service';

@Component({
  selector: 'app-admin-encuentros',
  templateUrl: './admin-encuentros.component.html',
  styleUrls: ['./admin-encuentros.component.css']
})
export class AdminEncuentrosComponent {
  protected apiUrlImg: string = environment.apiUrlImg;
  showModal = false;
  showModalTerminado = false;
  isResultLoaded = false;
  CampeonatoArray: any[] = [];
  EncuentrosArray: any[] = [];
  EncuentrosArrayFiltro: any[] = [];
  opcionSeleccionadaCamp: string = '';
  encuentroUpdate!: any;
  equipoData: any;
  name_local!: string;
  name_visitante!: string;
  goles_local!: number;
  goles_visitante!: number;
  imagenLocalSrc!: string;
  imagenVisitanteSrc!: string;
  isCampeon: boolean = false;
  equipoCampeon!: Equipo;
  
  constructor( private tsE: EncuentrosService, private tsC: CampeonatoService, private tsEq: EquipoService) {
    this.tsC.getAllCampeonato().subscribe((resultData: any) => {
      this.isResultLoaded = true;
      this.CampeonatoArray = resultData;

      const campeonatoActivo = this.CampeonatoArray.find(campeonato => campeonato.estado === true);
      if (campeonatoActivo) {
        this.cargarDatos(campeonatoActivo);
      }
    });
  }

  cargarDatos(campeonatoActivo: any) {
    this.tsE.getAllViewEncuentrosByCamp(campeonatoActivo.name_camp).subscribe((resultData: any) => {
      this.isResultLoaded = true;
      const result: any[] = resultData;
      if ( result.length === 0) {
        this.EncuentrosArray = [];
        this.EncuentrosArrayFiltro = [];
      } else {
        result.forEach(encuentro => {
          const fase = encuentro.nombre_fase;
          if (fase === "Fase de Grupos") {
            if (!this.EncuentrosArray[1]) {
              this.EncuentrosArray[1] = [];
            }
            this.EncuentrosArray[1].push(encuentro);
          } else if (fase === "Octavos de Final") {
            if (!this.EncuentrosArray[2]) {
              this.EncuentrosArray[2] = [];
            }
            this.EncuentrosArray[2].push(encuentro);
          } else if (fase === "Cuartos de Final") {
            if (!this.EncuentrosArray[3]) {
              this.EncuentrosArray[3] = [];
            }
            this.EncuentrosArray[3].push(encuentro);
          } else if (fase === "SemiFinal") {
            if (!this.EncuentrosArray[4]) {
              this.EncuentrosArray[4] = [];
            }
            this.EncuentrosArray[4].push(encuentro);
          } else if (fase === "Final") {
            if (!this.EncuentrosArray[5]) {
              this.EncuentrosArray[5] = [];
            }
            this.EncuentrosArray[5].push(encuentro);
          }              
        });
        this.EncuentrosArrayFiltro = this.EncuentrosArray;
      }
    });
  }

  onSelectCampeonato(event: any) {
    this.opcionSeleccionadaCamp = event.target.value;

    if (this.opcionSeleccionadaCamp != '') {
      const campeonatoActivo = this.CampeonatoArray.find(campeonato => campeonato.pk_idcamp === this.opcionSeleccionadaCamp);
      if (campeonatoActivo) {
        this.cargarDatos(campeonatoActivo);
      }
    } else {
      this.EncuentrosArrayFiltro = this.EncuentrosArray;
    }
  }

  onUpdateForm() {
    this.encuentroUpdate.goleslocal = this.goles_local;
    this.encuentroUpdate.golesvisit = this.goles_visitante;
    this.encuentroUpdate.estado_encuentro = 'Terminado';
    this.tsE.updateEncuentros(this.encuentroUpdate.id_enc, this.encuentroUpdate).subscribe((result: any) => {
      this.closeModal();
    });
    const campeonatoActivo = this.CampeonatoArray.find(campeonato => campeonato.estado === true);
    if (campeonatoActivo) {
      this.tsE.getAllViewEncuentrosByCamp(campeonatoActivo.name_camp).subscribe((resultData: any) => {
        this.isResultLoaded = true;
        const result: any[] = resultData;
        this.EncuentrosArray = [];
        this.EncuentrosArrayFiltro = [];
        result.forEach(encuentro => {
          const fase = encuentro.nombre_fase;
          if (fase === "Fase de Grupos") {
            if (!this.EncuentrosArray[1]) {
              this.EncuentrosArray[1] = [];
            }
            this.EncuentrosArray[1].push(encuentro);
          } else if (fase === "Octavos de Final") {
            if (!this.EncuentrosArray[2]) {
              this.EncuentrosArray[2] = [];
            }
            this.EncuentrosArray[2].push(encuentro);
          } else if (fase === "Cuartos de Final") {
            if (!this.EncuentrosArray[3]) {
              this.EncuentrosArray[3] = [];
            }
            this.EncuentrosArray[3].push(encuentro);
          } else if (fase === "SemiFinal") {
            if (!this.EncuentrosArray[4]) {
              this.EncuentrosArray[4] = [];
            }
            this.EncuentrosArray[4].push(encuentro);
          } else if (fase === "Final") {
            if (!this.EncuentrosArray[5]) {
              this.EncuentrosArray[5] = [];
            }
            this.EncuentrosArray[5].push(encuentro);
          }
          
        });
        this.EncuentrosArrayFiltro = this.EncuentrosArray;
      });
    }
    this.limpiarForm();
  }

  openModal(estado: string, encuentro: any) {
    if (estado === 'Actualizar') {
      this.tsE.getEncuentrosById(encuentro.id_enc).subscribe((result: any) => {
        this.encuentroUpdate = result[0];
        console.log(this.encuentroUpdate)

      });
      this.name_local = encuentro.fk_idequlocal;
      this.name_visitante = encuentro.fk_idequvisit;
      if (encuentro.logo_local) {
        this.imagenLocalSrc = this.apiUrlImg + encuentro.logo_local;
      } else {
        this.imagenLocalSrc = "./assets/img/Logo_TIC_IS.png";
      }
      if (encuentro.logo_visit) {
        this.imagenVisitanteSrc = this.apiUrlImg + encuentro.logo_visit;
      } else {
        this.imagenVisitanteSrc = "./assets/img/Logo_TIC_IS.png";
      }
      this.showModal = true;
    } else {
      this.limpiarForm();
      this.showModalTerminado = true;
    }

  }

  limpiarForm() {
    this.name_local = "";
    this.name_visitante =  "";
    this.goles_local= 0;
    this.goles_visitante= 0;
    this.imagenLocalSrc =  "";
    this.imagenVisitanteSrc =  "";
  }
  closeModal() {
    this.showModal = false;
  }

  closeModalTerminado() {
    this.showModalTerminado = false;
  }
}
