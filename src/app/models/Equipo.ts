export class Equipo{
    pk_idequ: string;
    nom_equ:string;
    logo:string;
    semestre:string;
    representante:string;
    fk_idcamp:string;
    constructor(pk_idequ: string,nom_equ:string,logo:string,semestre:string,representante:string,fk_idcamp:string){
        this.pk_idequ=pk_idequ;
        this.nom_equ=nom_equ;
        this.logo=logo;
        this.semestre=semestre;
        this.representante=representante;
        this.fk_idcamp=fk_idcamp;
    }
}