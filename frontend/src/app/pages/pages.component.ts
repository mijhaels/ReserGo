import { Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

@Component({
    selector: 'app-pages',
    templateUrl: './pages.component.html',
    styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
    menuItems: NbMenuItem[] = [
        // {
        //     title: 'Segundo parcial',
        //     group: true
        // },
        {
            icon: {icon: 'utensils', pack: 'fas'},
            title: 'Restaurantes',
            link: '/reservas-app/restaurantes',
            pathMatch: 'prefix'
        },
        {
            icon: {icon: 'map-marker-alt', pack: 'fas'},
            title: 'Mesas',
            link: '/reservas-app/mesas',
            pathMatch: 'prefix'
        },
        {
            icon: {icon: 'user', pack: 'fas'},
            title: 'Clientes',
            link: '/reservas-app/clientes',
            pathMatch: 'prefix'
        },
        {
            icon: {icon: 'check-double', pack: 'fas'},
            title: 'Reservar mesa',
            link: '/reservas-app/reservar',
            pathMatch: 'prefix'
        },
        {
            icon: {icon: 'list', pack: 'fas'},
            title: 'Listar reservas',
            link: '/reservas-app/lista-reservas',
            pathMatch: 'prefix'
        },
        // {
        //     title: 'Primer final',
        //     group: true
        // },
        // {
        //     icon: {icon: 'tag', pack: 'fas'},
        //     title: 'Categoría de Productos',
        //     link: '/reservas-app/categorias-productos',
        //     pathMatch: 'prefix'
        // },
        // {
        //     icon: {icon: 'hamburger', pack: 'fas'},
        //     title: 'Productos',
        //     link: '/reservas-app/productos',
        //     pathMatch: 'prefix'
        // },
        // {
        //     icon: {icon: 'cookie-bite', pack: 'fas'},
        //     title: 'Consumos',
        //     link: '/reservas-app/consumos',
        //     pathMatch: 'prefix'
        // },
        // {
        //     icon: {icon: 'receipt', pack: 'fas'},
        //     title: 'Gestión de consumos',
        //     link: '/reservas-app/gestion-consumos',
        //     pathMatch: 'prefix'
        // }
    ];
    constructor() { }

    ngOnInit(): void {
    }

}
