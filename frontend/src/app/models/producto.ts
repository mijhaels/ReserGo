import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ServerResponse } from '../shared/interfaces';
import { ProductoService } from '../services/abm/producto.service';

const fb = new FormBuilder();
export class ProductoModel {
    id: number;
    nombre: string;
    categoriaProductoId: number;
    precio: number;

    constructor(private service: ProductoService) { }

    serialize(): object {
        const obj: any = {};
        if (this.id !== null && this.id !== undefined) {
            obj.id = this.id;
        }
        if (this.nombre !== null && this.nombre !== undefined) {
            obj.nombre = this.nombre;
        }
        if (this.categoriaProductoId !== null && this.categoriaProductoId !== undefined) {
            obj.categoriaProductoId = this.categoriaProductoId;
        }
        if (this.precio !== null && this.precio !== undefined) {
            obj.precio = this.precio;
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
            categoriaProductoId: [this.categoriaProductoId, Validators.required],
            precio: [this.precio, Validators.required],
        });
    }
}
