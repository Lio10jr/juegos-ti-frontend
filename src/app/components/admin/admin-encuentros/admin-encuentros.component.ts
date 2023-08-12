import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/app/environments/environment';
import { ViewEncuentrosFase } from 'src/app/models/ViewEncuentrosFase';
import { CampeonatoService } from 'src/app/service/api/campeonato.service';
import { EncuentrosService } from 'src/app/service/api/encuentros.service';

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

  constructor(private router: Router, private tsE: EncuentrosService, private tsC: CampeonatoService) {
    this.tsE.getAllViewEncuentros().subscribe((resultData: any) => {
      this.isResultLoaded = true;
      console.log(resultData)
      this.EncuentrosArray = resultData;
      this.EncuentrosArrayFiltro = resultData;
    });
    this.tsC.getAllCampeonato().subscribe((resultData: any) => {
      this.isResultLoaded = true;
      this.CampeonatoArray = resultData;
    });
  }

  onSelectCampeonato(event: any) {
    this.opcionSeleccionadaCamp = event.target.value;

    if (this.opcionSeleccionadaCamp != '') {
      const campeonato = this.CampeonatoArray.find((campeonato) => campeonato.pk_idcamp === this.opcionSeleccionadaCamp);
      this.isResultLoaded = true;
      this.EncuentrosArrayFiltro = this.EncuentrosArray.filter((encuentro) => encuentro.fk_idcamp === campeonato.name_camp);
    } else {
      this.EncuentrosArrayFiltro = this.EncuentrosArray;
    }
  }

  onUpdateForm() {
    const bodyData = {
      "goles_local": this.goles_local,
      "goles_visitante": this.goles_visitante
    };

    this.encuentroUpdate.goleslocal = this.goles_local;
    this.encuentroUpdate.golesvisit = this.goles_visitante;
    this.tsE.updateEncuentros(this.encuentroUpdate.id_enc, this.encuentroUpdate).subscribe((result: any) => {
      this.closeModal();
    });
    this.tsE.getAllViewEncuentros().subscribe((resultData: any) => {
      this.isResultLoaded = true;
      console.log(resultData)
      this.EncuentrosArray = resultData;
      this.EncuentrosArrayFiltro = resultData;
    });
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
