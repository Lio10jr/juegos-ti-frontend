export class Equipo{
    nom_equ:string;
    logo:string;
    semestre:string;
    representante:string;
    fk_idcamp:string;
    constructor(nom_equ:string,logo:string,semestre:string,representante:string,fk_idcamp:string){
        this.nom_equ=nom_equ;
        this.logo=logo;
        this.semestre=semestre;
        this.representante=representante;
        this.fk_idcamp=fk_idcamp;
    }
}