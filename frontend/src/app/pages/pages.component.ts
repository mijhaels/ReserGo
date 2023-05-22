import { Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

@Component({
    selector: 'app-pages',
    templateUrl: './pages.component.html',
    styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
    menuItems: NbMenuItem[] = [
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
    ];
    constructor() { }

    ngOnInit(): void {
    }

}
