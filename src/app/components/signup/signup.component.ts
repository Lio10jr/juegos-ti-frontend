import { Component , OnInit } from '@angular/core';
import { UsersService } from 'src/app/service/user/users.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
@Component({    
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  protected signupForm: FormGroup;

  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  constructor( private router: Router, private ts: UsersService){
    this.signupForm = this.createFormGroup();
  }

  get name() { return this.signupForm.get('name'); }
  get lastname() { return this.signupForm.get('lastname'); }
  get email() { return this.signupForm.get('email'); }
  get phone() { return this.signupForm.get('phone'); }
  get rol() { return this.signupForm.get('rol'); }
  get password() { return this.signupForm.get('password'); }

  createFormGroup() {
    return new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      lastname: new FormControl('',[
        Validators.required,
        Validators.minLength(4),
      ]),
      email: new FormControl('',[ 
        Validators.required,
        Validators.pattern(this.emailPattern),
        Validators.minLength(10),

      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern(/^[0-9]{10}$/)
      ]),
      rol: new FormControl(null),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(10)
      ]),
    });
  }

  ngOnInit(): void{}

  onResetForm() {
    this.signupForm.reset();
  }

  onSaveForm() {
    if (this.signupForm.valid) {      
      const formValues = this.signupForm.value;
      const rolSeleccionado = formValues.rol;
      if (rolSeleccionado) {
        const rol = '28d2850c-2418-11ee-b6b0-088fc34793bc';
        this.ts.addUsers(formValues.name,formValues.lastname,formValues.email,formValues.phone,rol,formValues.password).subscribe( 
          () => {
            this.ts.addUsersMongo(formValues.name,formValues.lastname,formValues.email,formValues.phone,rol,formValues.password).subscribe( 
              () => {
                this.router.navigate(['/admin'])
              }
            );
          }
        );
      } else {
        const rol = '04cbf312-2418-11ee-b6b0-088fc34793bc';
        this.ts.addUsers(formValues.name,formValues.lastname,formValues.email,formValues.phone,rol,formValues.password).subscribe( 
          () => {
            this.ts.addUsersMongo(formValues.name,formValues.lastname,formValues.email,formValues.phone,rol,formValues.password).subscribe( 
              () => {
                this.router.navigate(['/admin'])
              }
            );
          }
        );
      }
    }    
  }

}
