import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServerResponse } from '../shared/interfaces';
import { ClienteService } from '../services/abm/cliente.service';

const fb = new FormBuilder();
export class ClienteModel {
    id: number;
    cedula: string;
    nombre: string;
    apellido: string;

    constructor(private service: ClienteService) { }

    serialize(): object {
        const obj: any = {};
        if (this.id !== null && this.id !== undefined) {
            obj.id = this.id;
        }
        if (this.cedula !== null && this.cedula !== undefined) {
            obj.cedula = this.cedula;
        }
        if (this.nombre !== null && this.nombre !== undefined) {
            obj.nombre = this.nombre;
        }
        if (this.apellido !== null && this.apellido !== undefined) {
            obj.apellido = this.apellido;
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

    getFormGroup(): FormGroup {
        return fb.group({
            id: this.id,
            cedula: [this.cedula, Validators.required],
            nombre: [this.nombre, Validators.required],
            apellido: [this.apellido, Validators.required],
        });
    }
}
