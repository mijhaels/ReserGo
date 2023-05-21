import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { MesaModel } from '../../../models/mesa';
import { MesaService } from '../../../services/abm/mesa.service';
import { RestauranteService } from '../../../services/abm/restaurante.service';
import { Punto } from '../../../shared/interfaces';

@Component({
    selector: 'app-mesa-window',
    templateUrl: './mesa-window.component.html',
    styleUrls: ['./mesa-window.component.scss']
})
export class MesaWindowComponent implements OnInit {
    title: string;
    formGroup = new MesaModel(this.mesaService).getFormGroup();
    nuevo: boolean;
    restaurantes: any[] = [];
    ubicacionesOcupadas: Punto[] = [];
    dimensionMapa = 10;

    get ubicacion(): Punto {
        return {
            x: this.formGroup.get('posicionx').value || 0,
            y: this.formGroup.get('posiciony').value || 0
        };
    }
    get ejex(): number[] {
        const values = [];
        for (let i = 1; i <= this.dimensionMapa; i++) {
            values.push(i);
        }
        return values;
    }
    get ejey(): number[] {
        const values = [];
        for (let i = 1; i <= this.dimensionMapa; i++) {
            values.push(i);
        }
        return values;
    }

    constructor(
        private mesaService: MesaService,
        private route: ActivatedRoute,
        private router: Router,
        private toastrService: NbToastrService,
        private restauranteService: RestauranteService,
    ) {
        // tslint:disable-next-line: deprecation
        this.formGroup.get('restauranteId').valueChanges.subscribe({
            next: () => {
                this.formGroup.get('planta').setValue(1);
            }
        });
        // tslint:disable-next-line: deprecation
        this.formGroup.get('planta').valueChanges.subscribe({
            next: async () => {
                await this.getUbicacionesOcupadas();
                this.getPrimeraUbicacion();
            }
        });
    }

    ngOnInit(): void {
        this.getRestaurantes();
        // tslint:disable-next-line: deprecation
        this.route.params.subscribe({
            next: (params) => {
                if (params.id !== 'nuevo') {
                    this.title = 'Editar mesa';
                    this.nuevo = false;
                    this.getFormGroup(params.id);
                } else {
                    this.title = 'Nueva mesa';
                    this.nuevo = true;
                    this.formGroup.get('capacidad').setValue(2);
                }
            }
        });
    }

    getPlantas(id: number): number[] {
        const restaurante = this.getRestaurante(id);
        if (!restaurante) {
            return [1];
        }
        const plantas = [1];
        for (let i = 2; i <= restaurante.plantas; i++) {
            plantas.push(i);
        }
        return plantas;
    }

    getRestaurante(id: number): any {
        return this.restaurantes?.find(restaurante => restaurante.id === id);
    }

    ubicacionOcupada(ubicacion: Punto): boolean {
        const ocupado = this.ubicacionesOcupadas.find(punto => {
            return punto.x === ubicacion.x && punto.y === ubicacion.y
            });
        if (ocupado) {
            return true;
        }
        return false;
    }

    ubicacionActiva(ubicacion: Punto): boolean {
        if (ubicacion.x === this.ubicacion.x && ubicacion.y === this.ubicacion.y) {
            return true;
        }
        return false;
    }

    seleccionarUbicacion(ubicacion: Punto): void {
        const ocupado = this.ubicacionOcupada(ubicacion);
        if (!this.formGroup.get('planta').value) {
            this.toastrService.show('No se mostrará el plano hasta que se seleccione la planta', 'Debe seleccionar una planta',
                { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'warning' });
            return;
        }
        if (!ocupado) {
            this.formGroup.get('posicionx').setValue(ubicacion.x);
            this.formGroup.get('posiciony').setValue(ubicacion.y);
        }
    }

    getPrimeraUbicacion(): void {
        for (let x = 1; x <= this.dimensionMapa; x++) {
            for (let y = 1; y <= this.dimensionMapa; y++) {
                if (!this.ubicacionOcupada({x, y})) {
                    this.formGroup.get('posicionx').setValue(x);
                    this.formGroup.get('posiciony').setValue(y);
                    return;
                }
            }
        }
    }

    async getUbicacionesOcupadas(): Promise<void> {
        try {
            const restaurante = this.formGroup.get('restauranteId')?.value;
            const planta = this.formGroup.get('planta').value;
            const id = this.formGroup.get('id').value;
            if (!restaurante && !planta) {
                this.ubicacionesOcupadas = [];
                return;
            }
            const mesas = await this.mesaService.get();
            if (mesas.ok) {
                const posiciones = [];
                for (const mesa of mesas.resp) {
                    console.log(mesa);
                    if (mesa.planta === planta && mesa.restauranteId === restaurante && mesa.id !== id) {
                        posiciones.push({
                            x: mesa.posicionx,
                            y: mesa.posiciony
                        });
                    }
                }
                this.ubicacionesOcupadas = posiciones;
                return;
            }
            this.ubicacionesOcupadas = [];
            return;
        } catch {
            this.ubicacionesOcupadas = [];
            return;
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
                if (this.nuevo && resp.resp.length) {
                    this.formGroup.get('restauranteId').setValue(resp.resp[0].id);
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

    async getFormGroup(id: number): Promise<void> {
        try {
            const resp = await this.mesaService.get(id);
            console.log(resp);
            if (resp.ok) {
                const model = new MesaModel(this.mesaService);
                model.deserialize(resp.resp);
                this.formGroup = model.getFormGroup();
                this.getUbicacionesOcupadas();
                // tslint:disable-next-line: deprecation
                this.formGroup.get('restauranteId').valueChanges.subscribe({
                    next: () => {
                        this.formGroup.get('planta').setValue(1);
                    }
                });
                // tslint:disable-next-line: deprecation
                this.formGroup.get('planta').valueChanges.subscribe({
                    next: async () => {
                        await this.getUbicacionesOcupadas();
                        this.getPrimeraUbicacion();
                    }
                });
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
                const model = new MesaModel(this.mesaService).deserialize(this.formGroup.getRawValue());
                const resp = await model.save();
                console.log(resp);
                if (resp.ok) {
                    this.router.navigate(['/sitio/mesas']);
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
            const resp = await this.mesaService.delete(this.formGroup.get('id').value);
            if (resp.ok) {
                this.router.navigate(['/sitio/mesas']);
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
