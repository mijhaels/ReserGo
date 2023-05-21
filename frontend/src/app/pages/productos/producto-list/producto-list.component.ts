import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoModel } from '../../../models/producto';
import { ProductoService } from '../../../services/abm/producto.service';

@Component({
    selector: 'app-producto-list',
    templateUrl: './producto-list.component.html',
    styleUrls: ['./producto-list.component.scss']
})
export class ProductoListComponent implements OnInit {
    source: ProductoModel[] = [];
    url = '/sitio/productos';
    columns = [
        { field: 'id', header: 'ID', type: 'numeric' },
        { field: 'nombre', header: 'Nombre', type: 'text' },
        { field: 'categoriaProductoId', header: 'ID Categoria Producto', type: 'number' },
        { field: 'precio', header: 'Precio', type: 'amount' },
    ];

    constructor(
        private router: Router,
        private productoService: ProductoService,
    ) { }

    ngOnInit(): void {
        this.getSource();
    }

    async getSource(): Promise<void> {
        try {
            const resp = await this.productoService.get();
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
