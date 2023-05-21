import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ServerResponse } from '../shared/interfaces';
import { ConsumoService } from '../services/abm/consumo.service';
import { ClienteService } from '../services/abm/cliente.service';

const fb = new FormBuilder();
export class ConsumoModel {
    id: number;
    estado: 'abierto' | 'cerrado' = 'abierto';
    total: number;
    // tslint:disable-next-line: variable-name
    fecha_hora_creacion: Date = new Date();
    // tslint:disable-next-line: variable-name
    fecha_hora_cierre: Date;
    mesaId: number;
    clienteId: number;
    detalles: any[] = [];

    constructor(private service: ConsumoService, private clienteService: ClienteService) { }

    serialize(): object {
        const obj: any = {};
        if (this.id !== null && this.id !== undefined) {
            obj.id = this.id;
        }
        if (this.estado !== null && this.estado !== undefined) {
            obj.estado = this.estado;
        }
        if (this.total !== null && this.total !== undefined) {
            obj.total = this.total;
        }
        if (this.fecha_hora_creacion !== null && this.fecha_hora_creacion !== undefined) {
            obj.fecha_hora_creacion = this.fecha_hora_creacion;
        }
        if (this.fecha_hora_cierre !== null && this.fecha_hora_cierre !== undefined) {
            obj.fecha_hora_cierre = this.fecha_hora_cierre;
        }
        if (this.mesaId !== null && this.mesaId !== undefined) {
            obj.mesaId = this.mesaId;
        }
        if (this.clienteId !== null && this.clienteId !== undefined) {
            obj.clienteId = this.clienteId;
        }
        if (this.detalles !== null && this.detalles !== undefined) {
            obj.detalles = this.detalles;
        }
        return obj;
    }

    deserialize(input: object): this {
        Object.assign(this, input);
        return this;
    }

    async save(): Promise<ServerResponse> {
        if (!this.id) {
            return this.service.post(this);
        } else {
            return this.service.put(this);
        }
    }

    async getFormGroup(): Promise<FormGroup> {
        let cliente;
        try {
            cliente = (await this.clienteService.get(this.clienteId)).resp;
        } catch {}
        const form = fb.group({
            id: this.id,
            estado: [this.estado, Validators.required],
            total: [this.total],
            fecha_hora_creacion: [this.fecha_hora_creacion, Validators.required],
            fecha_hora_cierre: [this.fecha_hora_cierre],
            mesaId: [this.mesaId, Validators.required],
            clienteId: [this.clienteId],
            cedulaCliente: [cliente?.cedula, Validators.required],
            nombreCliente: [cliente?.nombre, Validators.required],
            apellidoCliente: [cliente?.apellido, Validators.required],
            detalles: fb.array([])
        });
        for (const obj of this.detalles) {
            const detForm = fb.group({
                id: obj.id,
                cantidad: [obj.cantidad, Validators.required],
                productoId: [obj.productoId, Validators.required],
                total: [obj.total, Validators.required],
            });
            (form.get('detalles') as FormArray).push(detForm);
        }
        return form;
    }

    getRawFormGroup(): FormGroup {
        const form = fb.group({
            id: this.id,
            estado: [this.estado, Validators.required],
            total: [this.total],
            fecha_hora_creacion: [this.fecha_hora_creacion, Validators.required],
            fecha_hora_cierre: [this.fecha_hora_cierre],
            mesaId: [this.mesaId, Validators.required],
            clienteId: [this.clienteId],
            cedulaCliente: [undefined, Validators.required],
            nombreCliente: [undefined, Validators.required],
            apellidoCliente: [undefined, Validators.required],
            detalles: fb.array([])
        });
        for (const obj of this.detalles) {
            const detForm = fb.group({
                id: obj.id,
                cantidad: [obj.cantidad, Validators.required],
                productoId: [obj.productoId, Validators.required],
                total: [obj.total, Validators.required],
            });
            (form.get('detalles') as FormArray).push(detForm);
        }
        return form;
    }
}
