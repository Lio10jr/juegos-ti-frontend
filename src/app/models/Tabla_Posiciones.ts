export class Tabla_Posiciones {
    id_posicion: string;
    fk_idcamp: string;
    fk_id_fase_e: number;
    fk_idequ: string;
    numgrupo: number;
    pj: number;
    pg: number;
    pe: number;
    pp: number;
    gf: number;
    gc: number;
    gd: number;
    pts: number;
  
    constructor(id_posicion: string,fk_idcamp: string,fk_id_fase_e: number,fk_idequ: string,pj: number,pg: number,pe: number,pp: number,gf: number,gc: number,gd: number,pts: number, numgrupo: number) {
      this.id_posicion = id_posicion;
      this.fk_idcamp = fk_idcamp;
      this.fk_id_fase_e = fk_id_fase_e;
      this.fk_idequ = fk_idequ;
      this.pj = pj;
      this.pg = pg;
      this.pe = pe;
      this.pp = pp;
      this.gf = gf;
      this.gc = gc;
      this.gd = gd;
      this.pts = pts;
      this.numgrupo = numgrupo;
    }
  }
  