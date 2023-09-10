import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/app/environments/environment';
import { Encuentros } from 'src/app/models/Encuentros';
import { Equipo } from 'src/app/models/Equipo';
import { Fase_Encuentros } from 'src/app/models/Fase_Encuentros';
import { Tabla_Posiciones } from 'src/app/models/Tabla_Posiciones';
import { CampeonatoService } from 'src/app/service/api/campeonato.service';
import { EncuentrosService } from 'src/app/service/api/encuentros.service';
import { EquipoService } from 'src/app/service/api/equipo.service';
import { PosicionesService } from 'src/app/service/api/posiciones.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-admin-tabla-posiciones',
  templateUrl: './admin-tabla-posiciones.component.html',
  styleUrls: ['./admin-tabla-posiciones.component.css']
})
export class AdminTablaPosicionesComponent implements OnInit, OnChanges {
  protected apiUrlImg: string = environment.apiUrlImg;
  opcionSeleccionadaCampeonato: string = '';
  CampeonatoArray: any[] = [];
  isResultLoaded = false;
  TablaPArray: any[] = [];
  TablaPFiltrados: any[] = [];
  EncuentrosArray: any[] = [];
  EncuentrosArrayFiltro: any[] = [];
  encuentroFase2: any[] = [];
  encuentroFase3: any[] = [];
  encuentroFase4: any[] = [];
  encuentroFase5: any[] = [];
  tablaFase: any[] = [];
  idCampeonatoActivo: string = "";
  nombrebtnFase: string = "Generar Siguiente Fase"
  isdisable: boolean = false;
  TablaPArrayIds: any[] = [];
  encuentros: Encuentros[] = [];
  numGrupos: number = 0;
  numFase: number = 0;
  grupo1: any[] = [];
  grupo2: any[] = [];
  grupo3: any[] = [];
  grupo4: any[] = [];
  grupo5: any[] = [];
  isCampeon: boolean = false;
  equipoCampeon!: Equipo;
  constructor(private toastr: ToastrService, private tsC: CampeonatoService, private tsT: PosicionesService, private tsE: EncuentrosService, private tsEq: EquipoService) { }

  ngOnChanges(changes: SimpleChanges) {}

  ngOnInit() {
    this.tsC.getAllCampeonato().subscribe((resultData: any) => {
      this.isResultLoaded = true;
      this.CampeonatoArray = resultData;

      const campeonatoActivo = this.CampeonatoArray.find(campeonato => campeonato.estado === true);
      if (campeonatoActivo) {
        const campeonatoActivoId = campeonatoActivo.pk_idcamp;
        this.idCampeonatoActivo = campeonatoActivoId;
        this.cargarDatos(campeonatoActivo, campeonatoActivoId);
      }
    });
  }

  cargarDatos(campeonatoActivo: any, campeonatoActivoId: any) {
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
    this.tsT.getPosicionesByCampT(campeonatoActivoId).subscribe((resultData: any) => {
      this.isResultLoaded = true;
      if (resultData && resultData.length > 0) {
        let TablaPArray: Tabla_Posiciones[] = resultData;
        TablaPArray = TablaPArray.sort(this.criterioDeOrden);
        TablaPArray.forEach((elemento) => {
          const numgrupo = elemento.numgrupo;
          if (!this.TablaPArrayIds[numgrupo]) {
            this.TablaPArrayIds[numgrupo] = [];
          }
          this.TablaPArrayIds[numgrupo].push(elemento);
        });
      } else {
        this.TablaPArrayIds = [];
      }
      
    });
    this.tsE.getEncuentrosByIdCamp(campeonatoActivoId).subscribe((resultData: any) => {
      if (resultData && resultData.length > 0) {
        this.encuentros = resultData;
        const estadoEncuentro = this.encuentros.some(encuentro => encuentro.estado_encuentro !== 'Terminado');
        if (!estadoEncuentro) {
          const verificarNumGrupo = this.encuentros.some((encuentro) => encuentro.numgrupo === 0);
          this.isdisable = true;
          if (verificarNumGrupo) {
            // Si viene de otra fase que no es de grupos
            const num = this.verificarFasexEcuentro(resultData);
            this.numFase = num;
            if (num === 2) {
              this.encuentroFase2 = this.encuentros.filter(elemento => elemento.fk_id_fase_e === 2);
            } else if (num === 3) {
              this.encuentroFase3 = this.encuentros.filter(elemento => elemento.fk_id_fase_e === 3);
            } else if (num === 4) {
              this.encuentroFase4 = this.encuentros.filter(elemento => elemento.fk_id_fase_e === 4);
            } else if (num === 5) {
              const estado = this.encuentros.some(encuentro => encuentro.fk_id_fase_e === 5 && encuentro.estado_encuentro !== 'Terminado');
              this.encuentroFase5 = this.encuentros.filter(elemento => elemento.fk_id_fase_e === 5);
              if (!estado) {
                this.isdisable = false;
                this.encuentroFase5.forEach((elem: any) => {
                  if (elem.goleslocal > elem.golesvisit) {
                    this.tsEq.getEquipo(elem.fk_idequlocal).subscribe((resultData: any) => {
                      this.equipoCampeon = resultData[0];
                      this.isCampeon = true;
  
                    });
                  } else if (elem.goleslocal < elem.golesvisit) {
                    this.tsEq.getEquipo(elem.fk_idequvisit).subscribe((resultData: any) => {
                      this.equipoCampeon = resultData[0];
                      this.isCampeon = true;
                    });
                  }
                });
              } else {
                this.nombrebtnFase = "Terminar Campeonato";
              }
            }
          } else {
            // si viene de Fase de grupos
            this.numFase = this.verificarFasexEcuentro(resultData);
            this.numGrupos = this.verificarGruposxFase(resultData);
            this.isdisable = true;
          }
        }
      } else {
        this.encuentros = [];
        this.isdisable = false;
        this.numFase = 0;
        this.numGrupos = 0;
        this.isCampeon = false;
        this.equipoCampeon = new Equipo('', '', '', '', '', '');
        this.encuentroFase2 = [];
        this.encuentroFase3 = [];
        this.encuentroFase4 = [];
        this.encuentroFase5 = [];
      }
      
    });
    this.tsE.getAllViewEncuentrosByCamp(campeonatoActivo.name_camp).subscribe((resultData: any) => {
      this.isResultLoaded = true;
      if (resultData && resultData.length > 0) {
        const result: any[] = resultData;
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
      } else {
        this.EncuentrosArray = [];
        this.EncuentrosArrayFiltro = [];
      }
    });
  }

  criterioDeOrden(equipoA: any, equipoB: any): number {
    // Ordenar por puntos (de mayor a menor)
    if (equipoA.pts !== equipoB.pts) {
      return equipoB.pts - equipoA.pts;
    }

    // Si los puntos son iguales, ordenar por diferencia de goles (de mayor a menor)
    if (equipoA.gd !== equipoB.gd) {
      return equipoB.gd - equipoA.gd;
    }

    // Si la diferencia de goles es igual, ordenar por partidos ganados (de mayor a menor)
    return equipoB.pg - equipoA.pg;
  }

  limpiar() {
    this.TablaPArray = [];
    this.TablaPArrayIds = [];
    this.TablaPFiltrados = [];
    this.encuentros = [];
    this.numGrupos = 0;
    this.numFase = 0;
    this.grupo1 = [];
    this.grupo2 = [];
    this.grupo3 = [];
    this.grupo4 = [];
    this.grupo5 = [];
  }
  onSelectCampeonato(event: any) {
    this.opcionSeleccionadaCampeonato = event.target.value;
    if (this.opcionSeleccionadaCampeonato != '') {
      this.isResultLoaded = true;
      const camp = this.CampeonatoArray.filter((campeonato => campeonato.pk_idcamp === this.opcionSeleccionadaCampeonato));
      this.cargarDatos(camp[0], this.opcionSeleccionadaCampeonato);      
    } else {
      
    }
  }

  verificarGruposxFase(encuentros: any[]): number {
    const gruposSet = new Set<number>();
    for (const posicion of encuentros) {
      gruposSet.add(posicion.numgrupo);
    }
    return gruposSet.size;
  }

  verificarFasexEcuentro(encuentros: any[]): number {
    let maxNumFase = 0;

    for (const enc of encuentros) {
      const numFase = enc.fk_id_fase_e;
      if (numFase > maxNumFase) {
        maxNumFase = numFase;
      }
    }
    return maxNumFase;
  }

  generarFase() {
    if (this.numFase === 1) {  // FASE DE GRUPOS
      if (this.numGrupos === 2) {
        //  Pasan 4 equipos, los primeros y 3 mejores segundos (solo de 4 equipos x grupo)
        let cont = 2;
        const tabla = Object.keys(this.TablaPArrayIds);
        tabla.forEach((numgrupo: any) => {
          this.TablaPArrayIds[numgrupo].forEach((element: any, indice: number) => {
            if (indice === 0 || indice === 1) {
              if (cont === 1) {
                this.grupo1.push(element.fk_idequ);
              }
              if (cont === 2) {
                this.grupo2.push(element.fk_idequ);
              }
            }
          });
          cont--;
        });

        // generar encuentros SEMIFINAL
        this.creaerEncuentro(4, this.grupo1[0], this.grupo2[1]);
        this.creaerEncuentro(4, this.grupo1[1], this.grupo2[0]);

      } else if (this.numGrupos === 3) {
        //  Pasan 8 equipos, los primeros y 2dos 2 mejores terceros (solo de 4 equipos x grupo)
        let cont = 3;
        let mejorTerceros: any[] = [];
        const tabla = Object.keys(this.TablaPArrayIds);
        tabla.forEach((numgrupo: any) => {
          this.TablaPArrayIds[numgrupo].forEach((element: any, indice: number) => {
            if (indice === 0 || indice === 1) {
              if (cont === 1) {
                this.grupo1.push(element.fk_idequ);
              }
              if (cont === 2) {
                this.grupo2.push(element.fk_idequ);
              }
              if (cont === 3) {
                this.grupo3.push(element.fk_idequ);
              }
            }
            if (indice === 3) {
              mejorTerceros.push(element);
            }
          });
          cont--;
        });
        mejorTerceros = mejorTerceros.sort(this.criterioDeOrden);
        const arraydosMejoresTerceros = mejorTerceros.slice(0, 2);
        let dosMejoresTerceros: string[] = [];
        arraydosMejoresTerceros.forEach(element => {
          dosMejoresTerceros.push(element.fk_idequ);
        });
        // generar encuentros SEMIFINAL
        this.creaerEncuentro(3, this.grupo1[0], this.grupo2[1]);
        this.creaerEncuentro(3, this.grupo1[1], this.grupo2[0]);
        this.creaerEncuentro(3, this.grupo3[0], dosMejoresTerceros[0]);
        this.creaerEncuentro(3, this.grupo3[1], dosMejoresTerceros[1]);

      } else if (this.numGrupos === 4) {
        //  Pasan 8 equipos, los primeros y 2dos
        let cont = 4;
        const tabla = Object.keys(this.TablaPArrayIds);
        tabla.forEach((numgrupo: any) => {
          this.TablaPArrayIds[numgrupo].forEach((element: any, indice: number) => {
            if (indice === 0 || indice === 1) {
              if (cont === 1) {
                this.grupo1.push(element.fk_idequ);
              }
              if (cont === 2) {
                this.grupo2.push(element.fk_idequ);
              }
              if (cont === 3) {
                this.grupo3.push(element.fk_idequ);
              }
              if (cont === 4) {
                this.grupo4.push(element.fk_idequ);
              }
            }
          });
          cont--;
        });

        // generar encuentros SEMIFINAL
        this.creaerEncuentro(3, this.grupo1[0], this.grupo2[1]);
        this.creaerEncuentro(3, this.grupo1[1], this.grupo2[0]);
        this.creaerEncuentro(3, this.grupo3[0], this.grupo4[1]);
        this.creaerEncuentro(3, this.grupo3[1], this.grupo4[0]);

      } else if (this.numGrupos === 5) {
        //  Pasan 8 equipos, Pasan los primeros y 3 mejores segundos (solo de 4 equipos x grupo)
        let cont = 5;
        let mejorSegundos: any[] = [];
        const tabla = Object.keys(this.TablaPArrayIds);
        tabla.forEach((numgrupo: any) => {
          const index = this.TablaPArrayIds[numgrupo].length;
          this.TablaPArrayIds[numgrupo].forEach((element: any, indice: number) => {
            if (indice === 0) {
              if (cont === 1) {
                this.grupo1.push(element.fk_idequ);
              }
              if (cont === 2) {
                this.grupo2.push(element.fk_idequ);
              }
              if (cont === 3) {
                this.grupo3.push(element.fk_idequ);
              }
              if (cont === 4) {
                this.grupo4.push(element.fk_idequ);
              }
              if (cont === 5) {
                this.grupo5.push(element.fk_idequ);
              }
            }
            if (indice === 3) {
              mejorSegundos.push(element);
            }
          });
          cont--;
        });
        mejorSegundos = mejorSegundos.sort(this.criterioDeOrden);
        const arraytresmejorSegundos = mejorSegundos.slice(0, 2);
        let tresMejoresSegundos: string[] = [];
        arraytresmejorSegundos.forEach(element => {
          tresMejoresSegundos.push(element.fk_idequ);
        });
        // generar encuentros SEMIFINAL
        this.creaerEncuentro(3, this.grupo1[0], tresMejoresSegundos[2]);
        this.creaerEncuentro(3, this.grupo2[0], tresMejoresSegundos[1]);
        this.creaerEncuentro(3, this.grupo3[0], tresMejoresSegundos[0]);
        this.creaerEncuentro(3, this.grupo4[0], this.grupo5[0]);
      }
    } else if (this.numFase === 2) {  // OCTAVOS DE FINAL
      // Inicializa un array para los equipos ganadores de Octavos de Final
      let equiposOctavos: any[] = [];

      // Obtén los equipos ganadores de Octavos de Final
      this.encuentroFase2.forEach((encuentro: any) => {
        if (encuentro.goleslocal > encuentro.golesvisit) {
          equiposOctavos.push(encuentro.fk_idequlocal);
        } else if (encuentro.goleslocal < encuentro.golesvisit) {
          equiposOctavos.push(encuentro.fk_idequvisit);
        }
      });

      // Genera los encuentros de Cuartos de Final
      for (let i = 0; i < equiposOctavos.length; i += 2) {
        const equipo1 = equiposOctavos[i];
        const equipo2 = equiposOctavos[i + 1];

        // Crea el encuentro de Cuartos de Final
        this.creaerEncuentro(3, equipo1, equipo2);
      }
    } else if (this.numFase === 3) {  // CUARTOS DE FINAL
      let equipo1 = '';
      for (let indice = 0; indice < this.encuentroFase3.length; indice++) {
        const elem = this.encuentroFase3[indice];

        if (indice % 2 === 0) {
          // En los índices pares, actualiza el equipo1
          equipo1 = (elem.goleslocal > elem.golesvisit) ? elem.fk_idequlocal : elem.fk_idequvisit;
        } else {
          // En los índices impares, crea el encuentro con equipo1
          if (elem.goleslocal > elem.golesvisit) {
            this.creaerEncuentro(4, equipo1, elem.fk_idequlocal);
          } else if (elem.goleslocal < elem.golesvisit) {
            this.creaerEncuentro(4, equipo1, elem.fk_idequvisit);
          }
        }
      }
    } else if (this.numFase === 4) {  // SEMIFINAL
      let equipo1 = '';
      let equipo2 = '';
      // generar encuentros SEMIFINAL
      this.encuentroFase4.forEach((elem: any, indice: number) => {
        if (indice === 0) {
          if (elem.goleslocal > elem.golesvisit) {
            equipo1 = elem.fk_idequlocal;
          } else if (elem.goleslocal < elem.golesvisit) {
            equipo1 = elem.fk_idequvisit;
          }
        } else {
          if (elem.goleslocal > elem.golesvisit) {
            equipo2 = elem.fk_idequlocal;
          } else if (elem.goleslocal < elem.golesvisit) {
            equipo2 = elem.fk_idequvisit;
          }
        }
      });
      this.creaerEncuentro(5, equipo1, equipo2);

    } else if (this.numFase === 5) {  // FINAL
      this.encuentroFase5.forEach((elem: any) => {
        if (elem.goleslocal > elem.golesvisit) {
          this.tsEq.getEquipo(elem.fk_idequlocal).subscribe((resultData: any) => {
            this.equipoCampeon = resultData[0];
            this.isCampeon = true;
          });
        } else if (elem.goleslocal < elem.golesvisit) {
          this.tsEq.getEquipo(elem.fk_idequvisit).subscribe((resultData: any) => {
            this.equipoCampeon = resultData[0];
            this.isCampeon = true;
          });
        }
      });
      this.tsC.updateEstadoCampeonato(this.idCampeonatoActivo, false).subscribe({        
        error: (error) => {
          console.log(error);
        }
      });
    }
    this.isdisable = false;
  }

  creaerEncuentro(fase: any, equipolocal: string, equipovisit: string) {
    const newEncuentro1 = new Encuentros(uuidv4(), this.idCampeonatoActivo, equipolocal, fase, 0, equipovisit, 0, 'UTMACH', new Date(), 'Proximo', 0);
    this.tsE.addEncuentros(newEncuentro1).subscribe();

  }

}
