import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServerResponse } from '../shared/interfaces';
import { CategoriaProductoService } from '../services/abm/categoria-producto.service';

const fb = new FormBuilder();
export class CategoriaProductoModel {
    id: number;
    nombre: string;

    constructor(private service: CategoriaProductoService) { }

    serialize(): object {
        const obj: any = {};
        if (this.id !== null && this.id !== undefined) {
            obj.id = this.id;
        }
        if (this.nombre !== null && this.nombre !== undefined) {
            obj.nombre = this.nombre;
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
        });
    }
}
