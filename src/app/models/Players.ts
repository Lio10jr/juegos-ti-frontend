export class Players{
    pk_ced: string;
    nombre:string;
    apellido:string;
    semestre:string;
    f_nacimiento:Date;
    fk_idequ:string;
    constructor(pk_ced:string,nombre:string,apellido:string,semestre:string, f_nacimiento:Date,fk_idequ:string){
        this.pk_ced=pk_ced;
        this.nombre=nombre;
        this.apellido=apellido;
        this.semestre=semestre;
        this.f_nacimiento=f_nacimiento;
        this.fk_idequ=fk_idequ;
    }
}