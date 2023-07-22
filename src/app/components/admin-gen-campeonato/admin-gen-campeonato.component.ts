import { Component, OnInit } from '@angular/core';
import { EquipoService } from 'src/app/service/api/equipo.service';
import { Equipo } from 'src/app/models/Equipo';
import { Router } from '@angular/router';
import { environment } from 'src/app/environments/environment';
import { CampeonatoService } from 'src/app/service/api/campeonato.service';
import { elementAt } from 'rxjs';

@Component({
  selector: 'app-admin-gen-campeonato',
  templateUrl: './admin-gen-campeonato.component.html',
  styleUrls: ['./admin-gen-campeonato.component.css']
})
export class AdminGenCampeonatoComponent implements OnInit {
  protected apiUrlImg: string = environment.apiUrlImg;
  showModal = false;
  showModalNULL = false;
  showModalError = false;
  showModalEncuentros = false;
  EquipoArray: any[] = [];
  EquipoArrayGrupos: any[] = [];
  CampeonatoArray: any[] = [];
  isResultLoaded = false;
  opcionSeleccionada!: string;
  numGroupsSelected: string = '';
  numGrupo: number = 0;
  EquipoSelected: Equipo = new Equipo('', '', '', '', '');
  copiaEquipoArrayGrupos: any;
  grupo1: Equipo[] = [];
  grupo2: Equipo[] = [];
  grupo3: Equipo[] = [];
  grupo4: Equipo[] = [];
  grupo5: Equipo[] = [];
  errorValidacion: string = "";
  numGrupoRecomendado: string = "";

  constructor(private router: Router, private ts: EquipoService, private tsC: CampeonatoService) {
    this.tsC.getAllCampeonato().subscribe((resultData: any) => {
      this.isResultLoaded = true;
      // Filtrar campeonatos con estado en true
      this.CampeonatoArray = resultData.filter((campeonato: any) => campeonato.estado === true);
    });
    this.opcionSeleccionada = '';
  }

  ngOnInit() {

  }


  onSelect(event: any) {
    this.numGroupsSelected = event.target.value;
  }

  onSelectCampeonato(event: any) {
    /* this.numGroupsSelected = event.target.value; */
    this.opcionSeleccionada = event.target.value;

    if (this.opcionSeleccionada != null) {
      this.ts.getAllEquipo().subscribe((resultData: any) => {
        this.isResultLoaded = true;
        this.EquipoArray = resultData.filter((equipo: any) => equipo.fk_idcamp === this.opcionSeleccionada);
        this.EquipoArrayGrupos = resultData.filter((equipo: any) => equipo.fk_idcamp === this.opcionSeleccionada);
        this.copiaEquipoArrayGrupos = [...this.EquipoArrayGrupos];
        this.recomendacionGrupos();
      });
    }
  }

  recomendacionGrupos() {
    const numG = this.copiaEquipoArrayGrupos.length;
    if ( numG >= 15 && numG <= 20) {
      this.numGrupoRecomendado = '5';
    }else {
      if ( numG >= 12 && numG <= 16) {
        this.numGrupoRecomendado = '4';
      }else {
        if ( numG >= 9 && numG <= 12) {
          this.numGrupoRecomendado = '3';
        }else {
          if ( numG >= 6 && numG <= 8) {
            this.numGrupoRecomendado = '2';
          }else {
            this.numGrupoRecomendado = 'Fuera del campo asigando'
          }
        }
      }
    }
  }

  validarSorteArrayEquipos() {
    if (this.numGroupsSelected != '' && this.EquipoArrayGrupos.length != 0) {
      /* SORTEO
      2 grupos    3 grupos    4 grupos    5 grupos
      - minimo 6  - minimo 9  - minimo 12 - minimo 15
      - maximo 8  - maximo 12 - maximo 16 - maximo 20*/
      if (this.numGroupsSelected == '2') {
        if (this.copiaEquipoArrayGrupos.length >= 6 && this.copiaEquipoArrayGrupos.length <= 8) {
          if (this.copiaEquipoArrayGrupos.length === 0) {
            this.openModalNULL();
            this.numGrupo = 0;
          } else {
            const indiceAleatorio = Math.floor(Math.random() * this.copiaEquipoArrayGrupos.length);
            const datoAleatorio = this.copiaEquipoArrayGrupos[indiceAleatorio];
            this.copiaEquipoArrayGrupos.splice(indiceAleatorio, 1);
            this.EquipoSelected = new Equipo(datoAleatorio.nom_equ, datoAleatorio.logo, datoAleatorio.semestre, datoAleatorio.representante, datoAleatorio.fk_idcamp,);
            this.openModal();
            this.numGrupo++;

            if (this.numGrupo == 1) {
              this.grupo1.push(this.EquipoSelected);
            }
            if (this.numGrupo == 2) {
              this.grupo2.push(this.EquipoSelected);
              this.numGrupo = 0;
            }
          }
        } else {
          this.errorValidacion = "Los equipos no son suficientes para formar los grupos";
          this.showModalError = true;
        }
      }
      if (this.numGroupsSelected == '3') {
        if (this.copiaEquipoArrayGrupos.length >= 9 && this.copiaEquipoArrayGrupos.length <= 12) {
          if (this.copiaEquipoArrayGrupos.length === 0) {
            this.openModalNULL();
            this.numGrupo = 0;
          } else {
            const indiceAleatorio = Math.floor(Math.random() * this.copiaEquipoArrayGrupos.length);
            const datoAleatorio = this.copiaEquipoArrayGrupos[indiceAleatorio];
            this.copiaEquipoArrayGrupos.splice(indiceAleatorio, 1);
            this.EquipoSelected = new Equipo(datoAleatorio.nom_equ, datoAleatorio.logo, datoAleatorio.semestre, datoAleatorio.representante, datoAleatorio.fk_idcamp,);
            this.openModal();
            this.numGrupo++;
            if (this.numGrupo == 1) {
              this.grupo1.push(this.EquipoSelected);

            }
            if (this.numGrupo == 2) {
              this.grupo2.push(this.EquipoSelected);

            }
            if (this.numGrupo == 3) {
              this.grupo3.push(this.EquipoSelected);
              this.numGrupo = 0;
            }

          }
        } else {
          this.errorValidacion = "Los equipos no son suficientes para formar los grupos";
          this.showModalError = true;
        }
      }
      if (this.numGroupsSelected == '4') {
        if (this.copiaEquipoArrayGrupos.length >= 12 && this.copiaEquipoArrayGrupos.length <= 16) {
          if (this.copiaEquipoArrayGrupos.length === 0) {
            this.openModalNULL();
            this.numGrupo = 0;
          } else {
            const indiceAleatorio = Math.floor(Math.random() * this.copiaEquipoArrayGrupos.length);
            const datoAleatorio = this.copiaEquipoArrayGrupos[indiceAleatorio];
            this.copiaEquipoArrayGrupos.splice(indiceAleatorio, 1);
            this.EquipoSelected = new Equipo(datoAleatorio.nom_equ, datoAleatorio.logo, datoAleatorio.semestre, datoAleatorio.representante, datoAleatorio.fk_idcamp,);
            this.openModal();
            this.numGrupo++;
            if (this.numGrupo == 1) {
              this.grupo1.push(this.EquipoSelected);

            }
            if (this.numGrupo == 2) {
              this.grupo2.push(this.EquipoSelected);

            }
            if (this.numGrupo == 3) {
              this.grupo3.push(this.EquipoSelected);

            }
            if (this.numGrupo == 4) {
              this.grupo4.push(this.EquipoSelected);
              this.numGrupo = 0;
            }
          }
        } else {
          this.errorValidacion = "Los equipos no son suficientes para formar los grupos";
          this.showModalError = true;
        }
      }
      if (this.numGroupsSelected == '5') {
        if (this.copiaEquipoArrayGrupos.length >= 15 && this.copiaEquipoArrayGrupos.length <= 20) {
          if (this.copiaEquipoArrayGrupos.length === 0) {
            this.openModalNULL();
            this.numGrupo = 0;
          } else {
            const indiceAleatorio = Math.floor(Math.random() * this.copiaEquipoArrayGrupos.length);
            const datoAleatorio = this.copiaEquipoArrayGrupos[indiceAleatorio];
            this.copiaEquipoArrayGrupos.splice(indiceAleatorio, 1);
            this.EquipoSelected = new Equipo(datoAleatorio.nom_equ, datoAleatorio.logo, datoAleatorio.semestre, datoAleatorio.representante, datoAleatorio.fk_idcamp,);
            this.openModal();
            this.numGrupo++;
            if (this.numGrupo == 1) {
              this.grupo1.push(this.EquipoSelected);

            }
            if (this.numGrupo == 2) {
              this.grupo2.push(this.EquipoSelected);

            }
            if (this.numGrupo == 3) {
              this.grupo3.push(this.EquipoSelected);

            }
            if (this.numGrupo == 4) {
              this.grupo4.push(this.EquipoSelected);
              this.numGrupo = 0;
            }
            if (this.numGrupo == 5) {
              this.grupo5.push(this.EquipoSelected);
              this.numGrupo = 0;
            }
          }
        } else {
          this.errorValidacion = "Los equipos no son suficientes para formar los grupos";
          this.showModalError = true;
        }
      }

    } else {
      this.errorValidacion = "Seleccione el numero de grupo y el campeonato";
      this.showModalError = true;
    }

  }

  limpiarGrupos() {
    this.copiaEquipoArrayGrupos = [...this.EquipoArrayGrupos];
    this.numGroupsSelected = '';
    this.grupo1.splice(0);
    this.grupo2.splice(0);
    this.grupo3.splice(0);
    this.grupo4.splice(0);
    this.grupo5.splice(0);
    this.numGrupo = 0;
  }

  generarEncuentros() {
    /* PRIMER GRUPO */

    const numEquipos = 4;
    let EquipoAux1: Equipo = new Equipo('', '', '', '', '');
    let EquipoAux2: Equipo = new Equipo('', '', '', '', '');
    let EquipoAux3: Equipo = new Equipo('', '', '', '', '');
    let EquipoAux4: Equipo = new Equipo('', '', '', '', '');
    let contEquipo: number = 0;

    this.grupo1.forEach(element => {
      contEquipo++;
      if (contEquipo == 1) {
        EquipoAux1 = element;
      }
      if (contEquipo == 2) {
        EquipoAux2 = element;
      }
      if (contEquipo == 3) {
        EquipoAux3 = element;
      }
      if (contEquipo == 4) {
        EquipoAux4 = element;
      }
    });

    /* ENCUENTROS GRUPO 1*/

  }

  openModal() {
    this.showModal = true;
    const openModal = document.querySelector('.ins');
    const modal = document.querySelector('.modal');
    const closeModal = document.querySelector('.modal-close');

    openModal?.addEventListener('click', (e) => {
      e.preventDefault();
      modal?.classList.add('modal--show');
    });

    closeModal?.addEventListener('click', (e) => {
      e.preventDefault();
      modal?.classList.remove('modal--show');
    });
  }

  closeModal() {
    this.showModal = false;
    this.EquipoSelected = new Equipo('', '', '', '', '');
  }

  openModalNULL() {
    this.showModalNULL = true;
    const openModal = document.querySelector('.ins');
    const modal = document.querySelector('.modal');
    const closeModal = document.querySelector('.modal-close');

    openModal?.addEventListener('click', (e) => {
      e.preventDefault();
      modal?.classList.add('modal--show');
    });

    closeModal?.addEventListener('click', (e) => {
      e.preventDefault();
      modal?.classList.remove('modal--show');
    });
  }

  closeModalNULL() {
    this.showModalNULL = false;
    this.EquipoSelected = new Equipo('', '', '', '', '');
  }

  closeModalError() {
    this.showModalError = false;
  }

  closeModalEncuentros() {
    this.showModalError = false;
  }
}
