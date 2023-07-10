import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './helpers/auth.guard';
import { AdminComponent } from './components/admin/admin.component';
const routes: Routes = [
  { path:'', redirectTo:'', pathMatch:'full'},
  { path:'home',component:HomeComponent, canActivate: [authGuard]},
  { path:'login',component:LoginComponent },
  { path:'registro',component:SignupComponent },
  { path:'admin',component:AdminComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
