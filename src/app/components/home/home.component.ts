import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { ApiService } from 'src/app/service/api/api.service';
import { CampeonatoService } from 'src/app/service/api/campeonato.service';
import { PosicionesService } from 'src/app/service/api/posiciones.service';
import { EncuentrosService } from 'src/app/service/api/encuentros.service';
import { EquipoService } from 'src/app/service/api/equipo.service';
import { Equipo } from 'src/app/models/Equipo';
import { format } from 'date-fns';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  message = '';
  protected apiUrl: string = environment.apiUrl;
  protected apiUrlImg: string = environment.apiUrlImg;
  opcionSeleccionadaCampeonato: string = '';
  opcionSeleccionadaCampeonatoEquipos: string = '';
  opcionSeleccionadaCampeonatoResultados: string = '';
  opcionSeleccionadaCampeonatoProximos: string = '';
  CampeonatoArray: any[] = [];
  isResultLoaded = false;
  TablaPArray: any[] = [];
  TablaPFiltrados: any[] = [];
  EquipoArray: Equipo[] = [];
  EquiposFiltrados: Equipo[] = [];
  EncuentrosArray: any[] = [];
  EncuentrosArrayFiltro: any[] = [];
  EncuentrosArrayProximos: any[] = [];
  EncuentrosArrayProximosFiltro: any[] = [];
  constructor(
    private http: HttpClient,
    private apiService: ApiService, 
    private tsC: CampeonatoService, 
    private tsT: PosicionesService, 
    private tsE: EncuentrosService, 
    private tsEq: EquipoService
  ) { }

  ngOnInit() {
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
          this.message = `Hi ${response.user.nombre}`;
        }
      );
    }
    
    this.tsC.getAllCampeonato().subscribe((resultData: any) => {
      this.isResultLoaded = true;
      this.CampeonatoArray = resultData;

      const campeonatoActivo = this.CampeonatoArray.find(campeonato => campeonato.estado === true);
      if (campeonatoActivo) {
        const campeonatoActivoId = campeonatoActivo.pk_idcamp;
        this.opcionSeleccionadaCampeonato = campeonatoActivo.pk_idcamp;
        this.cargarDatos(campeonatoActivoId, campeonatoActivo, "general");
      } else {
        this.cargarDatos(this.CampeonatoArray[0].pk_idcamp, this.CampeonatoArray[0], "general");
      }
    });
  }

  cargarDatos(campeonatoActivoId: any,campeonatoActivo: any, section: any) {
    if (section === "general") {
      this.tsT.getPosicionesByCampView(campeonatoActivoId).subscribe((resultData: any) => {
        this.isResultLoaded = true;
        if (resultData && resultData.length > 0) {
          this.TablaPArray = resultData.sort(this.criterioDeOrden);
          let tabla: any[] = resultData.sort(this.criterioDeOrden);
      
          tabla.forEach((elemento) => {
            const numgrupo = elemento.numgrupo;
            if (!this.TablaPFiltrados[numgrupo]) {
              this.TablaPFiltrados[numgrupo] = [];
            }
            this.TablaPFiltrados[numgrupo].push(elemento);
          });
        } else {
          // Si resultData es vacío, inicializa los arrays como vacíos
          this.TablaPArray = [];
          this.TablaPFiltrados = [];
        }
      });
      this.tsEq.getEquipoCampeonato(campeonatoActivoId).subscribe((resultData: any) => {
        this.isResultLoaded = true;
        if (resultData && resultData.length > 0) {
          this.EquipoArray = resultData;
          this.EquiposFiltrados = resultData;
        } else {
          this.EquipoArray = [];
          this.EquiposFiltrados = [];
        }
      });
      this.tsE.getAllViewEncuentrosByCamp(campeonatoActivo.name_camp).subscribe((resultData: any) => {
        this.isResultLoaded = true;
        const result: any[] = resultData;
        if (result.length === 0) {
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
      this.tsE.getAllViewEncuentrosByCamp(campeonatoActivo.name_camp).subscribe((resultData: any) => {
        this.isResultLoaded = true;
        const result: any[] = resultData;
        if (result.length === 0) {
          this.EncuentrosArrayProximos = [];
          this.EncuentrosArrayProximosFiltro = [];
        } else {
          result.forEach(encuentro => {
            const fase = encuentro.nombre_fase;
            if (fase === "Fase de Grupos") {
              if (!this.EncuentrosArrayProximos[1]) {
                this.EncuentrosArrayProximos[1] = [];
              }
              this.EncuentrosArrayProximos[1].push(encuentro);
            } else if (fase === "Octavos de Final") {
              if (!this.EncuentrosArrayProximos[2]) {
                this.EncuentrosArrayProximos[2] = [];
              }
              this.EncuentrosArrayProximos[2].push(encuentro);
            } else if (fase === "Cuartos de Final") {
              if (!this.EncuentrosArrayProximos[3]) {
                this.EncuentrosArrayProximos[3] = [];
              }
              this.EncuentrosArrayProximos[3].push(encuentro);
            } else if (fase === "SemiFinal") {
              if (!this.EncuentrosArrayProximos[4]) {
                this.EncuentrosArrayProximos[4] = [];
              }
              this.EncuentrosArrayProximos[4].push(encuentro);
            } else if (fase === "Final") {
              if (!this.EncuentrosArrayProximos[5]) {
                this.EncuentrosArrayProximos[5] = [];
              }
              this.EncuentrosArrayProximos[5].push(encuentro);
            }
          });
          this.EncuentrosArrayProximosFiltro = this.EncuentrosArrayProximos;
        }
      });
      this.isResultLoaded = false;
    }
    if (section === "tabla") {
      this.tsT.getPosicionesByCampView(campeonatoActivoId).subscribe((resultData: any) => {
        this.isResultLoaded = true;
        if (resultData && resultData.length > 0) {
          this.TablaPArray = resultData.sort(this.criterioDeOrden);
          let tabla: any[] = resultData.sort(this.criterioDeOrden);
      
          tabla.forEach((elemento) => {
            const numgrupo = elemento.numgrupo;
            if (!this.TablaPFiltrados[numgrupo]) {
              this.TablaPFiltrados[numgrupo] = [];
            }
            this.TablaPFiltrados[numgrupo].push(elemento);
          });
        } else {
          // Si resultData es vacío, inicializa los arrays como vacíos
          this.TablaPArray = [];
          this.TablaPFiltrados = [];
        }
      });
    }
    if (section === "equipos") {
      this.tsEq.getEquipoCampeonato(campeonatoActivoId).subscribe((resultData: any) => {
        this.isResultLoaded = true;
        if (resultData && resultData.length > 0) {
          this.EquipoArray = resultData;
          this.EquiposFiltrados = resultData;
        } else {
          this.EquipoArray = [];
          this.EquiposFiltrados = [];
        }
      });
      this.isResultLoaded = false;
    }
    if (section === "resultados") {
      this.tsE.getAllViewEncuentrosByCamp(campeonatoActivo.name_camp).subscribe((resultData: any) => {
        this.isResultLoaded = true;
        const result: any[] = resultData;
        if (result.length === 0) {
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
    if (section === "proximos") {
      this.tsE.getAllViewEncuentrosByCamp(campeonatoActivo.name_camp).subscribe((resultData: any) => {
        this.isResultLoaded = true;
        const result: any[] = resultData;
        if (result.length === 0) {
          this.EncuentrosArrayProximos = [];
          this.EncuentrosArrayProximosFiltro = [];
        } else {
          result.forEach(encuentro => {
            const fase = encuentro.nombre_fase;
            if (fase === "Fase de Grupos") {
              if (!this.EncuentrosArrayProximos[1]) {
                this.EncuentrosArrayProximos[1] = [];
              }
              this.EncuentrosArrayProximos[1].push(encuentro);
            } else if (fase === "Octavos de Final") {
              if (!this.EncuentrosArrayProximos[2]) {
                this.EncuentrosArrayProximos[2] = [];
              }
              this.EncuentrosArrayProximos[2].push(encuentro);
            } else if (fase === "Cuartos de Final") {
              if (!this.EncuentrosArrayProximos[3]) {
                this.EncuentrosArrayProximos[3] = [];
              }
              this.EncuentrosArrayProximos[3].push(encuentro);
            } else if (fase === "SemiFinal") {
              if (!this.EncuentrosArrayProximos[4]) {
                this.EncuentrosArrayProximos[4] = [];
              }
              this.EncuentrosArrayProximos[4].push(encuentro);
            } else if (fase === "Final") {
              if (!this.EncuentrosArrayProximos[5]) {
                this.EncuentrosArrayProximos[5] = [];
              }
              this.EncuentrosArrayProximos[5].push(encuentro);
            }
          });
          this.EncuentrosArrayProximosFiltro = this.EncuentrosArrayProximos;
        }
      });
    }
  }

  limpiar() {
    this.TablaPArray = [];
    this.TablaPFiltrados = [];
  }

  criterioDeOrden(equipoA: any, equipoB: any): number {
    if (equipoA.pts !== equipoB.pts) {
      return equipoB.pts - equipoA.pts;
    }
    if (equipoA.gd !== equipoB.gd) {
      return equipoB.gd - equipoA.gd;
    }
    return equipoB.pg - equipoA.pg;
  }

  onSelectCampeonato(event: any) {
    this.opcionSeleccionadaCampeonato = event.target.value;
    if (this.opcionSeleccionadaCampeonato != '') {
      this.isResultLoaded = true;
      const camp = this.CampeonatoArray.filter((campeonato => campeonato.pk_idcamp === this.opcionSeleccionadaCampeonato));
      this.limpiar();
      this.cargarDatos(camp[0].pk_idcamp, camp[0], "tabla");
    } else {
      this.limpiar();
    }
  }

  onSelectCampeonatoEquipos(event: any) {
    this.opcionSeleccionadaCampeonatoEquipos = event.target.value;
    if (this.opcionSeleccionadaCampeonatoEquipos != '') {
      this.isResultLoaded = true;
      const camp = this.CampeonatoArray.filter((campeonato => campeonato.pk_idcamp === this.opcionSeleccionadaCampeonatoEquipos));
      this.cargarDatos(camp[0].pk_idcamp, camp[0], "equipos");
    }
  }

  onSelectCampeonatoResultados(event: any) {
    this.opcionSeleccionadaCampeonatoResultados = event.target.value;
    if (this.opcionSeleccionadaCampeonatoResultados != '') {
      this.isResultLoaded = true;
      this.EncuentrosArray = [];
      this.EncuentrosArrayFiltro = [];
      const camp = this.CampeonatoArray.filter((campeonato => campeonato.pk_idcamp === this.opcionSeleccionadaCampeonatoResultados));
      this.cargarDatos(camp[0].pk_idcamp, camp[0], "resultados");
    }
  }

  onSelectCampeonatoProximos(event: any) {
    this.opcionSeleccionadaCampeonatoProximos = event.target.value;
    if (this.opcionSeleccionadaCampeonatoProximos != '') {
      this.isResultLoaded = true;
      this.EncuentrosArrayProximos = [];
      this.EncuentrosArrayProximosFiltro = [];
      const camp = this.CampeonatoArray.filter((campeonato => campeonato.pk_idcamp === this.opcionSeleccionadaCampeonatoProximos));
      this.cargarDatos(camp[0].pk_idcamp, camp[0], "proximos");
    }
  }

  Format(date: any): string {
    const fecha: Date = new Date(date);
   return format(fecha, "do MMM, yyyy");
  }
}
