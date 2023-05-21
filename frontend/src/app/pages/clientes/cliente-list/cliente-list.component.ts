import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from '../../../services/abm/cliente.service';
import { ClienteModel } from '../../../models/cliente';

@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.scss']
})
export class ClienteListComponent implements OnInit {
    source: ClienteModel[] = [];
    url = '/sitio/clientes';
    columns = [
        { field: 'id', header: 'ID', type: 'numeric' },
        { field: 'cedula', header: 'Cedula', type: 'numeric' },
        { field: 'nombre', header: 'Nombre', type: 'text' },
        { field: 'apellido', header: 'Apellido', type: 'text' },
    ];

    constructor(
        private router: Router,
        private clienteService: ClienteService,
    ) { }

    ngOnInit(): void {
        this.getSource();
    }

    async getSource(): Promise<void> {
        try {
            const resp = await this.clienteService.get();
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
