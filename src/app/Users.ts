export class Users{
    name:string;
    lastname:string;
    email:string;
    phone:number;
    password:string;
    constructor(name:string,lastname:string,email:string,phone:number,password:string){
        this.name=name;
        this.lastname=lastname;
        this.email=email;
        this.phone=phone;
        this.password=password;
    }
}