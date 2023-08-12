import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminEquiposComponent } from './admin-equipos/admin-equipos.component';
import { AdminEncuentrosComponent } from './admin-encuentros/admin-encuentros.component';
import { AdminGenCampeonatoComponent } from './admin-gen-campeonato/admin-gen-campeonato.component';
import { AdminParticipantesComponent } from './admin-participantes/admin-participantes.component';
import { AdminCampeonatoComponent } from './admin-campeonato/admin-campeonato.component';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';


const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'equipos', component: AdminEquiposComponent },
      { path: 'campeonatos', component: AdminCampeonatoComponent },
      { path: 'participantes', component: AdminParticipantesComponent },
      { path: 'generar_campeonato', component: AdminGenCampeonatoComponent },
      { path: 'encuentros', component: AdminEncuentrosComponent },
      { path: '**', redirectTo: 'login'}
    ]
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild( routes )
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
