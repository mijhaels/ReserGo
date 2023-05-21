import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestauranteModel } from '../../../models/restaurante';
import { RestauranteService } from '../../../services/abm/restaurante.service';

@Component({
    selector: 'app-restaurante-list',
    templateUrl: './restaurante-list.component.html',
    styleUrls: ['./restaurante-list.component.scss']
})
export class RestauranteListComponent implements OnInit {
    source: RestauranteModel[] = [];
    url = '/sitio/restaurantes';
    columns = [
        { field: 'id', header: 'ID', type: 'numeric' },
        { field: 'nombre', header: 'Nombre', type: 'text' },
        { field: 'direccion', header: 'Dirección', type: 'text' },
    ];

    constructor(
        private router: Router,
        private restauranteService: RestauranteService,
    ) { }

    ngOnInit(): void {
        this.getSource();
    }

    async getSource(): Promise<void> {
        try {
            const resp = await this.restauranteService.get();
            console.log(resp);
            if (resp.ok) {
                this.source = resp.resp;
            } else {
                // mostrar error
            }
        } catch {
            // mostrar error
        }
    }

    onNew(): void {
        this.router.navigate([`${this.url}/nuevo`]);
    }

    onSelect(event: any): void {
        if (event.id) {
            this.router.navigate([`${this.url}/${event.id}`]);
        }
    }
}
