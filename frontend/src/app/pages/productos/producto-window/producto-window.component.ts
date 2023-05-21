import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { ProductoModel } from '../../../models/producto';
import { ProductoService } from '../../../services/abm/producto.service';
import { CategoriaProductoService } from '../../../services/abm/categoria-producto.service';
import { FormControl } from '@angular/forms';

function emptyValidator(control: FormControl): any {
    if (!control || !control.value || Number(control.value) === 0) {
        return {required: true};
    }
}

@Component({
    selector: 'app-producto-window',
    templateUrl: './producto-window.component.html',
    styleUrls: ['./producto-window.component.scss']
})
export class ProductoWindowComponent implements OnInit {
    title: string;
    formGroup = new ProductoModel(this.productoService).getFormGroup();
    nuevo: boolean;
    categoriaProductos: any[] = [];
    precioFormControl = new FormControl('', emptyValidator);

    constructor(
        private productoService: ProductoService,
        private route: ActivatedRoute,
        private router: Router,
        private toastrService: NbToastrService,
        private categoriaProductoService: CategoriaProductoService,
    ) {
        // tslint:disable-next-line: deprecation
        this.formGroup.get('categoriaProductoId').valueChanges.subscribe({
            next: () => {
                this.formGroup.get('precio').setValue(1);
            }
        });
    }

    ngOnInit(): void {
        this.getCategoriaProductos();
        // tslint:disable-next-line: deprecation
        this.route.params.subscribe({
            next: (params) => {
                if (params.id !== 'nuevo') {
                    this.title = 'Editar producto';
                    this.nuevo = false;
                    this.getFormGroup(params.id);
                } else {
                    this.title = 'Nuevo producto';
                    this.nuevo = true;
                }
            }
        });
    }

    getPrecios(id: number): number[] {
        const categoriaProducto = this.getCategoriaProducto(id);
        if (!categoriaProducto) {
            return [1];
        }
        const precios = [1];
        for (let i = 2; i <= categoriaProducto.precios; i++) {
            precios.push(i);
        }
        return precios;
    }

    getCategoriaProducto(id: number): any {
        return this.categoriaProductos?.find(categoriaProducto => categoriaProducto.id === id);
    }

    async getCategoriaProductos(): Promise<void> {
        try {
            const resp = await this.categoriaProductoService.get();
            console.log(resp);
            if (resp.ok) {
                resp.resp.sort((a, b) => {
                    let str1 = a?.toString()?.toUpperCase().replace(' ', '');
                    let str2 = b?.toString()?.toUpperCase().replace(' ', '');
                    if (!str1) {
                        str1 = '';
                    }
                    if (!str2) {
                        str2 = '';
                    }
                    return str1.localeCompare(str2) * -1;
                });
                this.categoriaProductos = resp.resp;
                if (this.nuevo && resp.resp.length) {
                    this.formGroup.get('categoriaProductoId').setValue(resp.resp[0].id);
                }
            } else {
                this.toastrService.show(`${resp.resp}`,
                    `${resp.msg}`, { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'danger' });
            }
        } catch (error) {
            this.toastrService.show(`${error}`, 'Error',
                { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'danger' });
        }
    }

    async getFormGroup(id: number): Promise<void> {
        try {
            const resp = await this.productoService.get(id);
            console.log(resp);
            if (resp.ok) {
                const model = new ProductoModel(this.productoService);
                model.deserialize(resp.resp);
                this.formGroup = model.getFormGroup();
                this.precioFormControl.setValue(this.formGroup.get('precio').value);
                // tslint:disable-next-line: deprecation
                this.formGroup.get('categoriaProductoId').valueChanges.subscribe({
                    next: () => {
                        this.formGroup.get('precio').setValue(1);
                    }
                });
            } else {
                this.toastrService.show(`${resp.resp}`,
                    `${resp.msg}`, { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'danger' });
            }
        } catch (error) {
            this.toastrService.show(`${error}`, 'Error',
                { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'danger' });
        }
    }

    async onSave(): Promise<void> {
        Object.keys(this.formGroup.controls).forEach(key => {
            this.formGroup.get(key)?.markAsTouched();
        });
        try {
            if (this.formGroup.valid) {
                const model = new ProductoModel(this.productoService).deserialize(this.formGroup.getRawValue());
                const resp = await model.save();
                console.log(resp);
                if (resp.ok) {
                    this.router.navigate(['/sitio/productos']);
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
            const resp = await this.productoService.delete(this.formGroup.get('id').value);
            if (resp.ok) {
                this.router.navigate(['/sitio/productos']);
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

    asANumber(value: string): number {
        const valueStr = value?.toString();
        if (valueStr) {
            let num = value?.toString().replace('.', '');
            num = num.replace(',', '.');
            return Number(num);
        }
        return 0;
    }


    changePrecio(newValue: string): void {
        const value = this.asANumber(newValue);
        this.formGroup.get('precio')?.setValue(value);
        if (value === 0) {
            this.formGroup.get('precio')?.setErrors({required: true});
        }
    }

    focusoutPrecio(): void {
        this.formGroup.get('precio')?.markAsTouched();
    }

    isADigit(event: any): boolean {
        if (event.key === '0') {
            return true;
        } else if (event.key === '1') {
            return true;
        } else if (event.key === '2') {
            return true;
        } else if (event.key === '3') {
            return true;
        } else if (event.key === '4') {
            return true;
        } else if (event.key === '5') {
            return true;
        } else if (event.key === '6') {
            return true;
        } else if (event.key === '7') {
            return true;
        } else if (event.key === '8') {
            return true;
        } else if (event.key === '9') {
            return true;
        }
        if (event.keyCode === 8 || event.keyCode === 9) {
            return true;
        }
        return false;
    }
}
