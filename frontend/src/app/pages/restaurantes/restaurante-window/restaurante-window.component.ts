import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { RestauranteModel } from '../../../models/restaurante';
import { RestauranteService } from '../../../services/abm/restaurante.service';

@Component({
    selector: 'app-restaurante-window',
    templateUrl: './restaurante-window.component.html',
    styleUrls: ['./restaurante-window.component.scss']
})
export class RestauranteWindowComponent implements OnInit {
    title: string;
    formGroup = new RestauranteModel(this.restauranteService).getFormGroup();
    nuevo: boolean;
    constructor(
        private restauranteService: RestauranteService,
        private route: ActivatedRoute,
        private router: Router,
        private toastrService: NbToastrService
    ) { }

    ngOnInit(): void {
        // tslint:disable-next-line: deprecation
        this.route.params.subscribe({
            next: (params) => {
                if (params.id !== 'nuevo') {
                    this.title = 'Editar restaurante';
                    this.nuevo = false;
                    this.getFormGroup(params.id);
                } else {
                    this.title = 'Nuevo restaurante';
                    this.nuevo = true;
                }
            }
        });
    }

    async getFormGroup(id: number): Promise<void> {
        try {
            const resp = await this.restauranteService.get(id);
            console.log(resp);
            if (resp.ok) {
                const model = new RestauranteModel(this.restauranteService);
                model.deserialize(resp.resp);
                this.formGroup = model.getFormGroup();
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
                const model = new RestauranteModel(this.restauranteService).deserialize(this.formGroup.getRawValue());
                const resp = await model.save();
                console.log(resp);
                if (resp.ok) {
                    this.router.navigate(['/sitio/restaurantes']);
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
            const resp = await this.restauranteService.delete(this.formGroup.get('id').value);
            if (resp.ok) {
                this.router.navigate(['/sitio/restaurantes']);
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
}
