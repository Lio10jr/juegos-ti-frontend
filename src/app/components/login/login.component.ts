import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/service/user/users.service';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/app/environments/environment';
import { ApiService } from 'src/app/service/api/api.service';
import { Credenciales } from 'src/app/models/models';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  private apiUrl: string = environment.apiUrl;
  creds: Credenciales = {
    email: '',
    password: ''
  };

  constructor(private _http: HttpClient, private router: Router, private ts: UsersService, private apiService: ApiService) {
    this.loginForm = this.createFormGroup();

  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  createFormGroup() {
    return new FormGroup({
      email: new FormControl('', [
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

  ngOnInit(): void {
  }

  onResetForm() {
    this.loginForm.reset();
  }

  onLogForm(): void {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (this.loginForm.valid) {
      this.apiService.login(this.loginForm.getRawValue())
        .subscribe(response => {
          this.router.navigate(["/home"]);
        });
    }
  }
}
