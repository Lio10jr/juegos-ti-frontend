export class ViewEncuentrosFase {
    id_enc: string;
    name_camp: string;
    nom_equ_local: string;
    logo_local: string;
    nombre_fase: string;
    numgrupo: number;
    golesLocal: number;
    nom_equ_visit: string;
    logo_visit: string;
    golesVisit: number;
    campo: string;
    fecha_hora: Date;
    estado_encuentro: string;
    constructor(
        id_enc: string,
        name_camp: string,
        nom_equ_local: string,
        logo_local: string,
        nombre_fase: string,
        numgrupo: number,
        golesLocal: number,
        nom_equ_visit: string,
        logo_visit: string,
        golesVisit: number,
        campo: string,
        fecha_hora: Date,
        estado_encuentro: string
    ) {
        this.id_enc = id_enc;
        this.name_camp = name_camp;
        this.nom_equ_local = nom_equ_local;
        this.logo_local = logo_local;
        this.nombre_fase = nombre_fase;
        this.numgrupo = numgrupo;
        this.golesLocal = golesLocal;
        this.nom_equ_visit = nom_equ_visit;
        this.logo_visit = logo_visit;
        this.golesVisit = golesVisit;
        this.campo = campo;
        this.fecha_hora = fecha_hora;
        this.estado_encuentro = estado_encuentro;
    }


}