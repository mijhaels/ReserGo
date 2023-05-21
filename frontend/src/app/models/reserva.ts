import { HorarioReserva, ServerResponse } from '../shared/interfaces';
import { ReservaService } from '../services/abm/reserva.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const fb = new FormBuilder();
export class ReservaModel {
    id: number;
    restauranteId: number;
    mesaId: number;
    fecha = new Date();
    horarios = '1';
    clienteId: number;
    cantidad: number;
    planta: number;
    cedulaCliente: string;
    nombreCliente: string;
    apellidoCliente: string;

    constructor(private service: ReservaService) { }

    serialize(): object {
        const obj: any = {};
        if (this.id !== null && this.id !== undefined) {
            obj.id = this.id;
        }
        if (this.restauranteId !== null && this.restauranteId !== undefined) {
            obj.restauranteId = this.restauranteId;
        }
        if (this.mesaId !== null && this.mesaId !== undefined) {
            obj.mesaId = this.mesaId;
        }
        if (this.fecha !== null && this.fecha !== undefined) {
            obj.fecha = this.fecha;
        }
        if (this.horarios !== null && this.horarios !== undefined) {
            obj.horarios = this.horarios;
        }
        if (this.clienteId !== null && this.clienteId !== undefined) {
            obj.clienteId = this.clienteId;
        }
        if (this.cantidad !== null && this.cantidad !== undefined) {
            obj.cantidad = this.cantidad;
        }
        if (this.planta !== null && this.planta !== undefined) {
            obj.planta = this.planta;
        }
        return obj;
    }

    deserialize(input: any): this {
        if (input.horarios.length) {
            let str = '';
            let sep = '';
            for (const horario of input.horarios) {
               str += `${sep}${horario}`;
               sep = ',';
            }
            input.horarios = str;
        } else {
            input.horarios = null;
        }
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

    getFormGroup(): FormGroup {
        const horariosStr = this.horarios.split(',');
        const horariosNro = [];
        for (const char of horariosStr) {
            const nro = Number(char);
            horariosNro.push(nro);
        }
        return fb.group({
            id: this.id,
            restauranteId: [this.restauranteId, Validators.required],
            planta: [this.planta, Validators.required],
            mesaId: [this.mesaId, Validators.required],
            fecha: [this.fecha, Validators.required],
            horarios: [horariosNro, Validators.required],
            clienteId: [this.clienteId],
            cantidad: [this.cantidad, Validators.required],
            cedulaCliente: [this.cedulaCliente, Validators.required],
            nombreCliente: [this.nombreCliente, Validators.required],
            apellidoCliente: [this.apellidoCliente, Validators.required],
        });
    }
}
