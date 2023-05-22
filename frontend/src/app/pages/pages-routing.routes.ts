import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RestauranteListComponent } from './restaurantes/restaurante-list/restaurante-list.component';
import { RestauranteWindowComponent } from './restaurantes/restaurante-window/restaurante-window.component';
import { PagesComponent } from './pages.component';
import { ClienteListComponent } from './clientes/cliente-list/cliente-list.component';
import { ClienteWindowComponent } from './clientes/cliente-window/cliente-window.component';
import { MesaListComponent } from './mesas/mesa-list/mesa-list.component';
import { MesaWindowComponent } from './mesas/mesa-window/mesa-window.component';
import { ReservarComponent } from './reservar/reservar.component';
import { ListaReservasComponent } from './lista-reservas/lista-reservas.component';

const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        children: [
            {path: 'restaurantes', component: RestauranteListComponent},
            {path: 'restaurantes/:id', component: RestauranteWindowComponent},
            {path: 'clientes', component: ClienteListComponent},
            {path: 'clientes/:id', component: ClienteWindowComponent},
            {path: 'mesas', component: MesaListComponent},
            {path: 'mesas/:id', component: MesaWindowComponent},
            {path: 'reservar', component: ReservarComponent},
            {path: 'lista-reservas', component: ListaReservasComponent},
            {path: '**', redirectTo: 'restaurantes'}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
