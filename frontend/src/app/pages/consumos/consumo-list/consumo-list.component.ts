import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConsumoModel } from 'src/app/models/consumo';
import { ConsumoService } from '../../../services/abm/consumo.service';

@Component({
    selector: 'app-consumo-list',
    templateUrl: './consumo-list.component.html',
    styleUrls: ['./consumo-list.component.scss']
})
export class ConsumoListComponent implements OnInit {
    source: ConsumoModel[] = [];
    url = '/sitio/consumos';
    columns = [
        { field: 'id', header: 'ID', type: 'numeric' },
        { field: 'estado', header: 'Estado', type: 'status' },
        { field: 'total', header: 'Total (GS)', type: 'amount' },
        { field: 'fecha_hora_creacion', header: 'Fecha/Hora creacion', type: 'date' },
        { field: 'fecha_hora_cierre', header: 'Fecha/Hora cierre', type: 'date' },
        { field: 'mesaId', header: 'ID Mesa', type: 'numeric' },
        { field: 'clienteId', header: 'ID Cliente', type: 'numeric' },
    ];

    constructor(
        private router: Router,
        private consumoService: ConsumoService,
    ) { }

    ngOnInit(): void {
        this.getSource();
    }

    async getSource(): Promise<void> {
        try {
            const resp = await this.consumoService.get();
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
