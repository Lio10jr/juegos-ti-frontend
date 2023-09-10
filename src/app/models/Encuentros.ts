export class Encuentros{
    id_enc:string;
    fk_idcamp:string;
    fk_idequlocal:string;
    fk_id_fase_e:number;
    goleslocal:number;
    fk_idequvisit:string;
    golesvisit:number;
    campo:string;
    fecha_hora:Date;
    estado_encuentro:string;
    numgrupo: number;
    constructor(id_enc:string,fk_idcamp:string,fk_idequlocal:string,fk_id_fase_e:number,goleslocal:number,fk_idequvisit:string,golesvisit:number,campo:string,fecha_hora:Date,estado_encuentro:string, numgrupo: number){
        this.id_enc=id_enc;
        this.fk_idcamp=fk_idcamp;
        this.fk_idequlocal=fk_idequlocal;
        this.fk_id_fase_e=fk_id_fase_e;
        this.goleslocal=goleslocal;
        this.fk_idequvisit=fk_idequvisit;
        this.golesvisit=golesvisit;
        this.campo=campo;
        this.fecha_hora=fecha_hora;
        this.estado_encuentro=estado_encuentro;
        this.numgrupo=numgrupo;
    }
}