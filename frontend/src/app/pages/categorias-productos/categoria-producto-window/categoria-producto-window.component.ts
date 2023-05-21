import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { CategoriaProductoModel } from '../../../models/categoria-producto';
import { CategoriaProductoService } from '../../../services/abm/categoria-producto.service';

@Component({
    selector: 'app-categoria-producto-window',
    templateUrl: './categoria-producto-window.component.html',
    styleUrls: ['./categoria-producto-window.component.scss']
})
export class CategoriaProductoWindowComponent implements OnInit {
    title: string;
    nuevo: boolean;
    formGroup = new CategoriaProductoModel(this.categoriaProductoService).getFormGroup();
    constructor(
        private categoriaProductoService: CategoriaProductoService,
        private route: ActivatedRoute,
        private router: Router,
        private toastrService: NbToastrService
    ) { }

    ngOnInit(): void {
        // tslint:disable-next-line: deprecation
        this.route.params.subscribe({
            next: (params) => {
                if (params.id !== 'nuevo') {
                    this.title = 'Editar categoría de producto';
                    this.nuevo = false;
                    this.getFormGroup(params.id);
                } else {
                    this.title = 'Nueva categoría de producto';
                    this.nuevo = true;
                }
            }
        });
    }

    async getFormGroup(id: number): Promise<void> {
        try {
            const resp = await this.categoriaProductoService.get(id);
            console.log(resp);
            if (resp.ok) {
                const model = new CategoriaProductoModel(this.categoriaProductoService);
                model.deserialize(resp.resp);
                this.formGroup = model.getFormGroup();
            } else {
                this.toastrService.show(`${resp.resp}`,
                    `${resp.msg}`, { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'danger' });
            }
        } catch (error) {
            this.toastrService.show(`${error}`, 'Error', { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'danger' });
        }
    }

    async onSave(): Promise<void> {
        Object.keys(this.formGroup.controls).forEach(key => {
            this.formGroup.get(key)?.markAsTouched();
        });
        try {
            if (this.formGroup.valid) {
                const model = new CategoriaProductoModel(this.categoriaProductoService).deserialize(this.formGroup.getRawValue());
                const resp = await model.save();
                console.log(resp);
                if (resp.ok) {
                    this.router.navigate(['/sitio/categorias-productos']);
                    this.toastrService.show(
                        `id: ${resp.resp.id}`,
                        `${resp.msg}`,
                        { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'success'}
                    );
                } else {
                    this.toastrService.show(`${resp.resp}`,
                        `${resp.msg}`, { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'danger' });
                }
            }
        } catch (error) {
            this.toastrService.show(`${error}`, 'Error', { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'danger' });
        }
    }

    async onDelete(): Promise<void> {
        try {
            const resp = await this.categoriaProductoService.delete(this.formGroup.get('id').value);
            if (resp.ok) {
                this.router.navigate(['/sitio/categorias-productos']);
                this.toastrService.show(
                    `id: ${resp.resp.id}`,
                    `${resp.msg}`,
                    { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'success'}
                );
            } else {
                this.toastrService.show(`${resp.resp}`,
                    `${resp.msg}`, { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'danger' });
            }
        } catch (error) {
            this.toastrService.show(`${error}`, 'Error', { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'danger' });
        }
    }
}
