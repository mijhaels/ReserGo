import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ServerResponse } from '../shared/interfaces';
import { MesaService } from '../services/abm/mesa.service';

const fb = new FormBuilder();
export class MesaModel {
    id: number;
    nombre: string;
    restauranteId: number;
    posicionx: number;
    posiciony: number;
    planta: number;
    capacidad: number;

    constructor(private service: MesaService) { }

    serialize(): object {
        const obj: any = {};
        if (this.id !== null && this.id !== undefined) {
            obj.id = this.id;
        }
        if (this.nombre !== null && this.nombre !== undefined) {
            obj.nombre = this.nombre;
        }
        if (this.restauranteId !== null && this.restauranteId !== undefined) {
            obj.restauranteId = this.restauranteId;
        }
        if (this.posicionx !== null && this.posicionx !== undefined) {
            obj.posicionx = this.posicionx;
        }
        if (this.posiciony !== null && this.posiciony !== undefined) {
            obj.posiciony = this.posiciony;
        }
        if (this.planta !== null && this.planta !== undefined) {
            obj.planta = this.planta;
        }
        if (this.capacidad !== null && this.capacidad !== undefined) {
            obj.capacidad = this.capacidad;
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
            restauranteId: [this.restauranteId, Validators.required],
            posicionx: [this.posicionx],
            posiciony: [this.posiciony],
            planta: [this.planta, Validators.required],
            capacidad: [this.capacidad, Validators.required],
        });
    }
}
