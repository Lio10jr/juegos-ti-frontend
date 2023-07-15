export class Users{
    name:string;
    lastname:string;
    email:string;
    phone:number;
    rol:string;
    password:string;
    constructor(name:string,lastname:string,email:string,phone:number,rol:string,password:string){
        this.name=name;
        this.lastname=lastname;
        this.email=email;
        this.phone=phone;
        this.rol=rol;
        this.password=password;
    }
}