import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { ClienteModel } from '../../../models/cliente';
import { ClienteService } from '../../../services/abm/cliente.service';

@Component({
    selector: 'app-cliente-window',
    templateUrl: './cliente-window.component.html',
    styleUrls: ['./cliente-window.component.scss']
})
export class ClienteWindowComponent implements OnInit {
    title: string;
    nuevo: boolean;
    formGroup = new ClienteModel(this.clienteService).getFormGroup();
    constructor(
        private clienteService: ClienteService,
        private route: ActivatedRoute,
        private router: Router,
        private toastrService: NbToastrService
    ) { }

    ngOnInit(): void {
        // tslint:disable-next-line: deprecation
        this.route.params.subscribe({
            next: (params) => {
                if (params.id !== 'nuevo') {
                    this.title = 'Editar cliente';
                    this.nuevo = false;
                    this.getFormGroup(params.id);
                } else {
                    this.title = 'Nuevo cliente';
                    this.nuevo = true;
                }
            }
        });
    }

    async getFormGroup(id: number): Promise<void> {
        try {
            const resp = await this.clienteService.get(id);
            console.log(resp);
            if (resp.ok) {
                const model = new ClienteModel(this.clienteService);
                model.deserialize(resp.resp);
                this.formGroup = model.getFormGroup();
            } else {
                this.toastrService.show(`${resp.resp}`,
                    `${resp.msg}`, { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'danger' });
            }
        } catch (error) {
            this.toastrService.show(`${error}`, 'Error', { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'danger' });
        }
    }

    async onSave(): Promise<void> {
        Object.keys(this.formGroup.controls).forEach(key => {
            this.formGroup.get(key)?.markAsTouched();
        });
        try {
            if (this.formGroup.valid) {
                const model = new ClienteModel(this.clienteService).deserialize(this.formGroup.getRawValue());
                const resp = await model.save();
                console.log(resp);
                if (resp.ok) {
                    this.router.navigate(['/sitio/clientes']);
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
            const resp = await this.clienteService.delete(this.formGroup.get('id').value);
            if (resp.ok) {
                this.router.navigate(['/sitio/clientes']);
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
