import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';


// Componentes
import { AdminCampeonatoComponent } from './admin-campeonato/admin-campeonato.component';
import { AdminEncuentrosComponent } from './admin-encuentros/admin-encuentros.component';
import { AdminEquiposComponent } from './admin-equipos/admin-equipos.component';
import { AdminParticipantesComponent } from './admin-participantes/admin-participantes.component';
import { AdminGenCampeonatoComponent } from './admin-gen-campeonato/admin-gen-campeonato.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminComponent } from './admin.component';
import { IonicModule } from '@ionic/angular';
import { AuthInterceptor } from 'src/app/helpers/auth.interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ToastrModule } from 'ngx-toastr';
import { AdminTablaPosicionesComponent } from './admin-tabla-posiciones/admin-tabla-posiciones.component';



@NgModule({
  declarations: [
    AdminComponent,
    SidebarComponent,
    AdminCampeonatoComponent,
    AdminEncuentrosComponent,
    AdminEquiposComponent,
    AdminParticipantesComponent,
    AdminGenCampeonatoComponent,
    AdminTablaPosicionesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AdminRoutingModule,
    IonicModule.forRoot(),
    ToastrModule.forRoot(),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AdminComponent]
})
export class AdminModule { }
