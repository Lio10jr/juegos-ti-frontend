import { Component , OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/service/user/users.service';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  protected loginForm: FormGroup;
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  constructor( private router: Router, private ts: UsersService){
    this.loginForm = this.createFormGroup();
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  createFormGroup() {
    return new FormGroup({
      email: new FormControl('',[ 
        Validators.required,
        Validators.pattern(this.emailPattern),
        Validators.minLength(10),

      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(10)
      ]),
    });
  }

  ngOnInit(): void{}

  onResetForm() {
    this.loginForm.reset();
  }

  onSaveForm() {
    if (this.loginForm.valid) {
      const formValues = this.loginForm.value;
      //this.ts.addUsers(formValues.name,formValues.lastname,formValues.email,formValues.phone,formValues.password).subscribe( data => console.log(data));
      this.onResetForm();
      /* window.location.href="task";
      this.router.navigateByUrl('task'); */
    }    
  }
}
