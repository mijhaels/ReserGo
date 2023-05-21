import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServerResponse } from '../shared/interfaces';
import { RestauranteService } from '../services/abm/restaurante.service';

const fb = new FormBuilder();

export class RestauranteModel {
    id: number;
    nombre: string;
    direccion: string;
    plantas = 1;

    constructor(private service: RestauranteService) {}

    serialize(): object {
        const obj: any = {};
        if (this.id !== null && this.id !== undefined) {
            obj.id = this.id;
        }
        if (this.nombre !== null && this.nombre !== undefined) {
            obj.nombre = this.nombre;
        }
        if (this.direccion !== null && this.direccion !== undefined) {
            obj.direccion = this.direccion;
        }
        if (this.plantas !== null && this.plantas !== undefined) {
            obj.plantas = this.plantas;
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
            nombre: [this.nombre, Validators.required],
            direccion: [this.direccion, Validators.required],
            plantas: [this.plantas, Validators.required]
        });
    }
}
