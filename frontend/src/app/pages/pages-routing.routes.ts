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
import { CategoriaProdcutoListComponent } from './categorias-productos/categoria-producto-list/categoria-producto-list.component';
import { CategoriaProductoWindowComponent } from './categorias-productos/categoria-producto-window/categoria-producto-window.component';
import { ProductoListComponent } from './productos/producto-list/producto-list.component';
import { ProductoWindowComponent } from './productos/producto-window/producto-window.component';
import { ConsumoListComponent } from './consumos/consumo-list/consumo-list.component';
import { ConsumoWindowComponent } from './consumos/consumo-window/consumo-window.component';
import { GestionConsumosComponent } from './gestion-consumos/gestion-consumos.component';

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
            {path: 'categorias-productos', component: CategoriaProdcutoListComponent},
            {path: 'categorias-productos/:id', component: CategoriaProductoWindowComponent},
            {path: 'productos', component: ProductoListComponent},
            {path: 'productos/:id', component: ProductoWindowComponent},
            {path: 'consumos', component: ConsumoListComponent},
            {path: 'consumos/:id', component: ConsumoWindowComponent},
            {path: 'gestion-consumos', component: GestionConsumosComponent},
            {path: '**', redirectTo: 'restaurantes'}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
