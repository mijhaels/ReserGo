import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriaProductoService } from '../../../services/abm/categoria-producto.service';
import { CategoriaProductoModel } from '../../../models/categoria-producto';

@Component({
  selector: 'app-categoria-producto-list',
  templateUrl: './categoria-producto-list.component.html',
  styleUrls: ['./categoria-producto-list.component.scss']
})
export class CategoriaProdcutoListComponent implements OnInit {
    source: CategoriaProductoModel[] = [];
    url = '/sitio/categorias-productos';
    columns = [
        { field: 'id', header: 'ID', type: 'numeric' },
        { field: 'nombre', header: 'Nombre', type: 'text' },
    ];

    constructor(
        private router: Router,
        private categoriaProductoService: CategoriaProductoService,
    ) { }

    ngOnInit(): void {
        this.getSource();
    }

    async getSource(): Promise<void> {
        try {
            const resp = await this.categoriaProductoService.get();
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
