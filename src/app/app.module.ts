import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SignupComponent } from './components/signup/signup.component';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { NavComponent } from './components/nav/nav.component';
import { AuthInterceptor } from './helpers/auth.interceptor';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminEquiposComponent } from './components/admin-equipos/admin-equipos.component';
import { AdminParticipantesComponent } from './components/admin-participantes/admin-participantes.component';
import { AdminCampeonatoComponent } from './components/admin-campeonato/admin-campeonato.component';
import { AdminGenCampeonatoComponent } from './components/admin-gen-campeonato/admin-gen-campeonato.component';
import { AdminEncuentrosComponent } from './components/admin-encuentros/admin-encuentros.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    NavComponent,
    SidebarComponent,
    AdminComponent,
    AdminEquiposComponent,
    AdminParticipantesComponent,
    AdminCampeonatoComponent,
    AdminGenCampeonatoComponent,
    AdminEncuentrosComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    IonicModule.forRoot(),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
