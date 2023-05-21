import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbGlobalPhysicalPosition, NbToastrService, NbWindowService } from '@nebular/theme';
import { ConsumoModel } from '../../../models/consumo';
import { ConsumoService } from '../../../services/abm/consumo.service';
import { ClienteService } from '../../../services/abm/cliente.service';
import { MesaService } from 'src/app/services/abm/mesa.service';
import { ProductoService } from '../../../services/abm/producto.service';
import { RestauranteService } from '../../../services/abm/restaurante.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ConsumoDetalleComponent } from '../../../shared/components/consumo-detalle/consumo-detalle.component';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-consumo-window',
    templateUrl: './consumo-window.component.html',
    styleUrls: ['./consumo-window.component.scss']
})
export class ConsumoWindowComponent implements OnInit, OnDestroy {
    title: string;
    formGroup: FormGroup = new ConsumoModel(this.consumoService, this.clienteService).getRawFormGroup();
    nuevo: boolean;
    clientes: any[] = [];
    mesas: any[] = [];
    productos: any[] = [];
    restaurantes: any[] = [];
    subs: Subscription[] = []
    detalleColumns = [
        { field: 'productoId', header: 'Producto', type: 'producto' },
        { field: 'cantidad', header: 'Cantidad', type: 'amount' },
        { field: 'total', header: 'Total (GS)', type: 'amount' },
    ];

    constructor(
        private consumoService: ConsumoService,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private toastrService: NbToastrService,
        private clienteService: ClienteService,
        private mesaService: MesaService,
        private productoService: ProductoService,
        private windowService: NbWindowService,
        private restauranteService: RestauranteService,
    ) { }

    get detalles(): FormArray {
        return this.formGroup.get('detalles') as FormArray;
    }

    async ngOnInit(): Promise<void> {
        this.formGroup = await (new ConsumoModel(this.consumoService, this.clienteService).getFormGroup());
        this.getClientes();
        this.getMesas();
        this.getProductos();
        this.getRestaurantes();
        // tslint:disable-next-line: deprecation
        this.route.params.subscribe({
            next: (params) => {
                if (params.id !== 'nuevo') {
                    this.title = 'Editar consumo';
                    this.nuevo = false;
                    this.getFormGroup(params.id);
                } else {
                    this.title = 'Nuevo consumo';
                    this.nuevo = true;
                    this.subs.push(this.detalles.valueChanges.subscribe({
                        next: () => {
                            let total = 0;
                            for (const detalle of this.detalles.controls) {
                                total += Number(detalle.get('total').value)
                            }
                            this.formGroup.get('total').setValue(total);
                        }
                    }))
                }
            }
        });
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => {
            sub.unsubscribe();
        })
    }

    getProducto(id: number): number[] {
        return this.productos?.find(p => p.id === id);
    }

    getCliente(id: number): any {
        return this.clientes?.find(c => c.id === id);
    }

    getMesa(id: number): any {
        return this.mesas?.find(m => m.id === id);
    }

    getRestaurante(id: number): any {
        return this.restaurantes?.find(r => r.id === id);
    }

    async getClientes(): Promise<void> {
        try {
            const resp = await this.clienteService.get();
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
                this.clientes = resp.resp;
                if (this.nuevo && resp.resp.length) {
                    this.formGroup.get('clienteId').setValue(resp.resp[0].id);
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

    async getRestaurantes(): Promise<void> {
        try {
            const resp = await this.restauranteService.get();
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
                this.restaurantes = resp.resp;
            } else {
                this.toastrService.show(`${resp.resp}`,
                    `${resp.msg}`, { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'danger' });
            }
        } catch (error) {
            this.toastrService.show(`${error}`, 'Error',
                { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'danger' });
        }
    }

    async getMesas(): Promise<void> {
        try {
            const resp = await this.mesaService.get();
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
                this.mesas = resp.resp;
                if (this.nuevo && resp.resp.length) {
                    this.formGroup.get('mesaId').setValue(resp.resp[0].id);
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

    async getProductos(): Promise<void> {
        try {
            const resp = await this.productoService.get();
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
                this.productos = resp.resp;
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
            const resp = await this.consumoService.get(id);
            console.log(resp);
            if (resp.ok) {
                const model = new ConsumoModel(this.consumoService, this.clienteService);
                model.deserialize(resp.resp);
                this.formGroup = await model.getFormGroup();
                this.subs.push(this.detalles.valueChanges.subscribe({
                    next: () => {
                        let total = 0;
                        for (const detalle of this.detalles.controls) {
                            total += Number(detalle.get('total').value)
                        }
                        this.formGroup.get('total').setValue(total);
                    }
                }))
            } else {
                this.toastrService.show(`${resp.resp}`,
                    `${resp.msg}`, { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'danger' });
            }
        } catch (error) {
            this.toastrService.show(`${error}`, 'Error',
                { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'danger' });
        }
    }

    cerrarConsumo(): void {
        this.formGroup.get('estado').setValue('cerrado');
        this.formGroup.get('fecha_hora_cierre').setValue(new Date());
        this.onSave();
    }

    async onSave(): Promise<void> {
        Object.keys(this.formGroup.controls).forEach(key => {
            this.formGroup.get(key)?.markAsTouched();
        });
        try {
            if (this.formGroup.valid) {
                console.log(this.formGroup.getRawValue());
                const model = new ConsumoModel(this.consumoService, this.clienteService).deserialize(this.formGroup.getRawValue());
                const resp = await model.save();
                console.log(resp);
                if (resp.ok) {
                    this.router.navigate(['/sitio/consumos']);
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
            const resp = await this.consumoService.delete(this.formGroup.get('id').value);
            if (resp.ok) {
                this.router.navigate(['/sitio/consumos']);
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

    onNewDetalle(): void {
        const form =  this.fb.group({
            id: null,
            cantidad: 1,
            productoId: this.productos[0]?.id,
            total: this.productos[0]?.precio,
        });
        this.detalles.push(form);
        this.windowService.open(ConsumoDetalleComponent, {
            context: {formGroup: form, productos: this.productos},
            title: 'Agregar detalle'
        });
    }

    onEditDetalle(form: FormGroup): void {
        this.windowService.open(ConsumoDetalleComponent, {
            context: {formGroup: form, productos: this.productos},
            title: 'Editar detalle'
        });
    }

    onDeleteDetalle(control: FormGroup): void {
        const idx = this.detalles.controls.indexOf(control);
        if (idx > -1) {
            this.detalles.removeAt(idx);
        }
    }
}
