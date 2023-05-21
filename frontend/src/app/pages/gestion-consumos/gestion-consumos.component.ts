import { Component, OnInit } from '@angular/core';
import { ConsumoDetalleComponent } from '../../shared/components/consumo-detalle/consumo-detalle.component';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { NbGlobalPhysicalPosition, NbToastrService, NbWindowService } from '@nebular/theme';
import { ConsumoModel } from '../../models/consumo';
import { ConsumoService } from '../../services/abm/consumo.service';
import { ClienteService } from '../../services/abm/cliente.service';
import { MesaService } from '../../services/abm/mesa.service';
import { ProductoService } from '../../services/abm/producto.service';
import { RestauranteService } from '../../services/abm/restaurante.service';
import { Subscription } from 'rxjs';
import { ClienteModel } from '../../models/cliente';
import jsPDF from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
    selector: 'app-gestion-consumos',
    templateUrl: './gestion-consumos.component.html',
    styleUrls: ['./gestion-consumos.component.scss']
})
export class GestionConsumosComponent implements OnInit {
    formGroup: FormGroup = new ConsumoModel(this.consumoService, this.clienteService).getRawFormGroup();
    consumos: any[] = []
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
        private fb: FormBuilder,
        private toastrService: NbToastrService,
        private clienteService: ClienteService,
        private mesaService: MesaService,
        private productoService: ProductoService,
        private currencyPipe: CurrencyPipe,
        private windowService: NbWindowService,
        private restauranteService: RestauranteService,
    ) { }

    get detalles(): FormArray {
        return this.formGroup.get('detalles') as FormArray;
    }

    async ngOnInit(): Promise<void> {
        this.formGroup = await (new ConsumoModel(this.consumoService, this.clienteService).getFormGroup());
        this.formGroup.get('cedulaCliente').valueChanges.subscribe({
            next: () => {
                this.getDatosCliente();
            }
        });
        this.subs.push(this.detalles.valueChanges.subscribe({
            next: () => {
                let total = 0;
                for (const detalle of this.detalles.controls) {
                    total += Number(detalle.get('total').value)
                }
                this.formGroup.get('total').setValue(total);
            }
        }))
        this.subs.push(this.formGroup.get('mesaId').valueChanges.subscribe({
            next: async () => {
                const consumo = this.consumos.find(c => c.mesaId === this.formGroup.get('mesaId')?.value);
                if (consumo) {
                    this.getFormGroup(consumo.id);
                } else {
                    const consumo = this.consumos.find(c => c.mesaId === this.formGroup.get('mesaId')?.value);
                    if (consumo) {
                        this.getFormGroup(consumo.id);
                    } else {
                        this.clearForm()
                    }
                }
            }
        }));
        this.getClientes();
        this.getMesas();
        this.getProductos();
        this.getRestaurantes();
        this.getConsumos();
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => {
            sub.unsubscribe();
        })
    }

    getProducto(id: number): any {
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

    async getConsumos(): Promise<void> {
        try {
            const resp = await this.consumoService.get();
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
                this.consumos = resp.resp.filter(c => c.estado === 'abierto');
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
                this.formGroup.get('cedulaCliente').valueChanges.subscribe({
                    next: () => {
                        this.getDatosCliente();
                    }
                });
                this.subs.push(this.detalles.valueChanges.subscribe({
                    next: () => {
                        let total = 0;
                        for (const detalle of this.detalles.controls) {
                            total += Number(detalle.get('total').value)
                        }
                        this.formGroup.get('total').setValue(total);
                    }
                }))
                this.subs.push(this.formGroup.get('mesaId').valueChanges.subscribe({
                    next: async () => {
                        const consumo = this.consumos.find(c => c.mesaId === this.formGroup.get('mesaId')?.value);
                        if (consumo) {
                            this.getFormGroup(consumo.id);
                        } else {
                            this.formGroup.get('id').setValue(undefined);
                            this.formGroup.get('total').setValue(undefined);
                            this.formGroup.get('fecha_hora_cierre').setValue(undefined);
                            this.formGroup.get('fecha_hora_creacion').setValue(new Date());
                            this.formGroup.get('estado').setValue('abierto');
                            this.detalles.clear();
                        }
                    }
                }));
            } else {
                this.toastrService.show(`${resp.resp}`,
                    `${resp.msg}`, { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'danger' });
            }
        } catch (error) {
            this.toastrService.show(`${error}`, 'Error',
                { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'danger' });
        }
    }

    getDatosCliente(): void {
        const cliente = this.clientes.find(c => {
            const cedula = this.formGroup.get('cedulaCliente').value;
            if (c.cedula === cedula) {
                return true;
            }
        });
        if (cliente) {
            this.formGroup.get('nombreCliente').setValue(cliente.nombre);
            this.formGroup.get('apellidoCliente').setValue(cliente.apellido);
            this.formGroup.get('clienteId').setValue(cliente.id);
        } else {
            this.formGroup.get('nombreCliente').setValue(null);
            this.formGroup.get('apellidoCliente').setValue(null);
            this.formGroup.get('clienteId').setValue(null);
        }
    }

    async cerrarConsumo(): Promise<void> {
        this.formGroup.get('estado').setValue('cerrado');
        this.formGroup.get('fecha_hora_cierre').setValue(new Date());
        await this.onSave();
        this.imprimirTicket(this.formGroup.value);
        this.clearForm();
    }

    imprimirTicket(value: any): void {
        const datePipe = new DatePipe('es-PY');
        let doc = new jsPDF(
            'p',
            'px',
            'a4'
        );
        doc.setFontSize(14);
        doc.setTextColor(0, 60, 150);
        doc.text(`Sistema Restaurantes`, 30, 37);
        doc.setTextColor(0, 0, 0);
        const body: RowInput[] = [
            [{content: 'Fecha/Hora creacion', styles: {fontStyle: 'bold'}},
            {content: datePipe.transform(value.fecha_hora_creacion, 'dd/MM/yyyy hh:mm:ss')},
            {content: 'Fecha/Hora cierre', styles: {fontStyle: 'bold'}},
            {content: datePipe.transform(value.fecha_hora_cierre, 'dd/MM/yyyy hh:mm:ss')}],
        ];
        body.push(
            [{content: 'Cliente', styles: {fontStyle: 'bold'}},
            {content: `${value.cedulaCliente} - ${value.nombreCliente} ${value.apellidoCliente}`},
            {content: 'Restaurante', styles: {fontStyle: 'bold'}},
            {content: `${this.getRestaurante(this.getMesa(this.formGroup.get('mesaId').value).restauranteId).nombre}`}],
        )
        body.push(
            [{content: 'Mesa', styles: {fontStyle: 'bold'}},
            {content: `${this.getMesa(this.formGroup.get('mesaId').value).nombre}`},
            {content: 'Total', styles: {fontStyle: 'bold'}},
            {content: `${this.currencyPipe.transform(value.total, 'PYG', '', '', 'es-AR')}`}],
        )
        autoTable(doc, {
            head: [[{content: `Cabecera`,
                colSpan: 4, styles: {halign: 'center', fillColor: [221, 255, 222], textColor: [0, 0, 0], fontSize: 12}}]],
            body,
            showHead: 'firstPage',
            theme: 'grid',
            startY: 45,
            styles: {fontSize: 8}
        });
        const lista = this.getConvertedDataToPdf(value.detalles);
        const source = this.getExportSource(lista);
        const cols: any[] = this.detalleColumns.map(c => {
            return { content: c.header,
                styles: { halign: 'center', fillColor: [243, 255, 243], textColor: [0, 0, 0]}};
        });
        autoTable(doc, {
            head: [cols],
            body: source,
            showHead: 'everyPage',
            showFoot: 'lastPage',
            theme: 'grid',
            styles: {fontSize: 8}
        });
        window.open(URL.createObjectURL(doc.output('blob')));
    }

    getExportSource(lista: any[]): any[] {
        const exportSource = lista.map((source) =>
            this.detalleColumns.map((col) => {
                if (col.type === 'amount') {
                    return {content: source[col.field], styles: {halign: 'right'}};
                } else {
                    return {content: source[col.field]};
                }
            })
        );
        return exportSource;
    }

    getConvertedDataToPdf(source: any[]): any[] {
        const datePipe = new DatePipe('es-PY');
        const newSource = [];
        for (const rec of source) {
            const newRec = Object.assign({}, rec);
            for (const col of this.detalleColumns) {
                if (col.type === 'date') {
                    newRec[col.field] = datePipe.transform(newRec[col.field], 'dd/MM/yyyy');
                }
                if (col.type === 'amount') {
                    newRec[col.field] = this.currencyPipe.transform(newRec[col.field], 'PYG', '', '', 'es-AR');
                }
                if (col.type === 'producto') {
                    newRec[col.field] = `${this.getProducto(newRec[col.field]).id} - ${this.getProducto(newRec[col.field]).nombre}`
                }
            }
            newSource.push(newRec);
        }
        return newSource;
    }

    async aperturarConsumo(): Promise<void> {
        await this.onSave();
        const mesa = this.formGroup.get('mesaId').value;
        await this.ngOnInit()
        this.formGroup.get('mesaId').setValue(mesa);
    }

    clearForm(): void {
        this.formGroup.get('id').setValue(undefined);
        this.formGroup.get('total').setValue(undefined);
        this.formGroup.get('fecha_hora_cierre').setValue(undefined);
        this.formGroup.get('fecha_hora_creacion').setValue(new Date());
        this.formGroup.get('clienteId').setValue('abierto');
        this.formGroup.get('nombreCliente').setValue(undefined);
        this.formGroup.get('cedulaCliente').setValue(undefined);
        this.formGroup.get('apellidoCliente').setValue(undefined);
        this.formGroup.get('estado').setValue('abierto');
        this.detalles.clear();
    }

    getClientesFiltrados(): any[] {
        const clientes = this.clientes.filter(c => {
            if (this.formGroup.get('cedulaCliente').value) {
                const value = c.cedula.indexOf(this.formGroup.get('cedulaCliente').value) > -1;
                return value;
            } else {
                return true;
            }
        });
        return clientes;
    }

    async onSave(): Promise<void> {
        Object.keys(this.formGroup.controls).forEach(key => {
            this.formGroup.get(key)?.markAsTouched();
        });
        try {
            if (this.formGroup.valid) {
                const objectCliente: any = {
                    cedula: this.formGroup.get('cedulaCliente').value,
                    nombre: this.formGroup.get('nombreCliente').value,
                    apellido: this.formGroup.get('apellidoCliente').value,
                };
                if (this.formGroup.get('clienteId').value) {
                    objectCliente.id = this.formGroup.get('clienteId').value;
                }
                const modelCliente = new ClienteModel(this.clienteService).deserialize(objectCliente);
                const respCliente = await modelCliente.save();
                if (!respCliente.ok) {
                    this.toastrService.show(`${respCliente.resp}`,
                        `${respCliente.msg}`, { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'danger' });
                    return;
                }
                const cliente = respCliente.resp;
                this.formGroup.get('clienteId').setValue(cliente.id);
                const model = new ConsumoModel(this.consumoService, this.clienteService).deserialize(this.formGroup.getRawValue());
                const resp = await model.save();
                console.log(resp);
                if (resp.ok) {
                    this.getMesas();
                    this.getClientes();
                    this.getRestaurantes();
                    this.getProductos();
                    await this.getConsumos();
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
