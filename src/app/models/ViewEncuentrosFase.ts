export class ViewEncuentrosFase {
    id_enc: string;
    name_camp: string;
    nom_equ_local: string;
    logo_local: string;
    nombre_fase: string;
    numero_fase: number;
    golesLocal: number;
    nom_equ_visit: string;
    logo_visit: string;
    golesVisit: number;
    campo: string;
    fecha_hora: Date;
    constructor(
        id_enc: string,
        name_camp: string,
        nom_equ_local: string,
        logo_local: string,
        nombre_fase: string,
        numero_fase: number,
        golesLocal: number,
        nom_equ_visit: string,
        logo_visit: string,
        golesVisit: number,
        campo: string,
        fecha_hora: Date
    ) {
        this.id_enc = id_enc;
        this.name_camp = name_camp;
        this.nom_equ_local = nom_equ_local;
        this.logo_local = logo_local;
        this.nombre_fase = nombre_fase;
        this.numero_fase = numero_fase;
        this.golesLocal = golesLocal;
        this.nom_equ_visit = nom_equ_visit;
        this.logo_visit = logo_visit;
        this.golesVisit = golesVisit;
        this.campo = campo;
        this.fecha_hora = fecha_hora;
    }


}