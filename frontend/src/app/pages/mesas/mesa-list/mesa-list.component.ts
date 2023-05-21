import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MesaModel } from '../../../models/mesa';
import { MesaService } from '../../../services/abm/mesa.service';

@Component({
    selector: 'app-mesa-list',
    templateUrl: './mesa-list.component.html',
    styleUrls: ['./mesa-list.component.scss']
})
export class MesaListComponent implements OnInit {
    source: MesaModel[] = [];
    url = '/sitio/mesas';
    columns = [
        { field: 'id', header: 'ID', type: 'numeric' },
        { field: 'nombre', header: 'Nombre', type: 'text' },
        { field: 'restauranteId', header: 'ID Restaurante', type: 'numeric' },
        { field: 'planta', header: 'Planta', type: 'numeric' },
        { field: 'capacidad', header: 'Capacidad', type: 'numeric' },
    ];

    constructor(
        private router: Router,
        private mesaService: MesaService,
    ) { }

    ngOnInit(): void {
        this.getSource();
    }

    async getSource(): Promise<void> {
        try {
            const resp = await this.mesaService.get();
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
