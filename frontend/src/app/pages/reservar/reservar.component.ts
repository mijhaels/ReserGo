import { Component, OnInit } from '@angular/core';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { ReservaModel } from '../../models/reserva';
import { ReservaService } from '../../services/abm/reserva.service';
import { Punto } from '../../shared/interfaces';
import { RestauranteService } from '../../services/abm/restaurante.service';
import { MesaService } from '../../services/abm/mesa.service';
import { HORARIOS_RESERVA } from '../../shared/global';
import { ClienteService } from '../../services/abm/cliente.service';
import { ClienteModel } from '../../models/cliente';

@Component({
    selector: 'app-reservar',
    templateUrl: './reservar.component.html',
    styleUrls: ['./reservar.component.scss']
})
export class ReservarComponent implements OnInit {
    formGroup = new ReservaModel(this.reservaService).getFormGroup();
    restaurantes: any[] = [];
    mesas: any[] = [];
    clientes: any[] = [];
    reservas: any[] = [];
    dimensionMapa = 10;
    horarios = HORARIOS_RESERVA;

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
        private reservaService: ReservaService,
        private restauranteService: RestauranteService,
        private clienteService: ClienteService,
        private toastrService: NbToastrService,
        private mesaService: MesaService
    ) {
        this.setListeners();
    }

    ngOnInit(): void {
        this.getRestaurantes();
        this.getClientes();
        this.getReservas();
    }

    setListeners(): void {
        // tslint:disable-next-line: deprecation
        this.formGroup.get('restauranteId').valueChanges.subscribe({
            next: () => {
                this.formGroup.get('planta').setValue(1);
                this.formGroup.get('cantidad').setValue(1);
            }
        });
        // tslint:disable-next-line: deprecation
        this.formGroup.get('planta').valueChanges.subscribe({
            next: async () => {
                await this.getMesas();
            }
        });
        // tslint:disable-next-line: deprecation
        this.formGroup.get('cantidad').valueChanges.subscribe({
            next: async () => {
                await this.getMesas();
            }
        });
        // tslint:disable-next-line: deprecation
        this.formGroup.get('fecha').valueChanges.subscribe({
            next: async () => {
                await this.getMesas();
            }
        });
        // tslint:disable-next-line: deprecation
        this.formGroup.get('horarios').valueChanges.subscribe({
            next: async () => {
                await this.getMesas();
            }
        });
        // tslint:disable-next-line: deprecation
        this.formGroup.get('cedulaCliente').valueChanges.subscribe({
            next: () => {
                this.getDatosCliente();
            }
        });
    }

    getDatosCliente(): void {
        const cliente = this.clientes.find(c => {
            const cedula = this.formGroup.get('cedulaCliente').value;
            if (c.cedula === cedula) {
                return true;
            }
        });
        if (cliente) {
            this.formGroup.get('nombreCliente').setValue(cliente.nombre);
            this.formGroup.get('apellidoCliente').setValue(cliente.apellido);
            this.formGroup.get('clienteId').setValue(cliente.id);
        } else {
            this.formGroup.get('nombreCliente').setValue(null);
            this.formGroup.get('apellidoCliente').setValue(null);
            this.formGroup.get('clienteId').setValue(null);
        }
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

    existeMesa(punto: Punto): boolean {
        const mesa = this.mesas.find(m => {
            const planta = this.formGroup.get('planta').value;
            if (m.posicionx === punto.x && m.posiciony === punto.y && m.planta === planta) {
                return true;
            }
        });
        if (mesa) {
            return true;
        }
        return false;
    }

    checkNoDisponible(punto: Punto): void {
        const mesa = this.mesas.find(m => {
            const planta = this.formGroup.get('planta').value;
            if (m.posicionx === punto.x && m.posiciony === punto.y && m.planta === planta) {
                return true;
            }
        });
        if (!mesa) {
            this.toastrService.show('', 'Ubicación no disponible', {position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'warning'});
        } else {
            if (this.mesaOcupada(punto)) {
                this.toastrService.show('', 'La mesa ya se encuentra reservada',
                    {position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'danger'});
            } else {
                this.toastrService.show('', `Mesa '${mesa.id}: ${mesa.nombre}' seleccionada`,
                    {position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'success'});
            }
        }
    }

    mesaOcupada(punto: Punto): boolean {
        const mesa = this.mesas.find(m => {
            const planta = this.formGroup.get('planta').value;
            if (m.posicionx === punto.x && m.posiciony === punto.y && m.planta === planta) {
                return true;
            }
        });
        if (mesa) {
            const reserva = this.reservas.find(r => {
                if (this.formGroup.get('fecha').valid) {
                    const fecha: Date = this.formGroup.get('fecha').value;
                    const fechaStr = `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}`;
                    const fechaReserva = new Date(r.fecha);
                    const fechaReservaStr = `${fechaReserva.getFullYear()}-${fechaReserva.getMonth()}-${fechaReserva.getDate()}`;
                    if (r.mesaId === mesa.id && fechaStr === fechaReservaStr) {
                        const horarios = this.formGroup.get('horarios').value;
                        for (const horario of horarios) {
                            const solapado = r.horarios.split(',').find(h => Number(h) === Number(horario));
                            if (solapado) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            });
            if (reserva) {
                return true;
            }
        }
        return false;
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
                if (resp.resp.length) {
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

    async getReservas(): Promise<void> {
        try {
            const resp = await this.reservaService.get();
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
                this.reservas = resp.resp;
            } else {
                this.toastrService.show(`${resp.resp}`,
                    `${resp.msg}`, { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'danger' });
            }
        } catch (error) {
            this.toastrService.show(`${error}`, 'Error',
                { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'danger' });
        }
    }

    async getMesas(): Promise<void> {
        this.mesas = [];
        const restaurante = this.formGroup.get('restauranteId').value;
        const planta = this.formGroup.get('planta').value;
        const cantidad = this.formGroup.get('cantidad').value;
        try {
            const resp = await this.mesaService.get();
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
                for (const mesa of resp.resp) {
                    if (mesa.restauranteId === restaurante && mesa.planta === planta && mesa.capacidad >= cantidad) {
                        this.mesas.push(mesa);
                    }
                }
                if (this.mesas.length) {
                    const mesaActual = this.mesas.find(mesa => mesa.id === this.formGroup.get('mesaId').value);
                    if (mesaActual) {
                        if (this.mesaOcupada({x: mesaActual.posicionx, y: mesaActual.posiciony})) {
                            for (const mesa of resp.resp) {
                                const punto = {x: mesa.posicionx, y: mesa.posiciony};
                                if (!this.mesaOcupada(punto)) {
                                    this.formGroup.get('mesaId').setValue(mesa.id);
                                    return;
                                }
                            }
                            this.formGroup.get('mesaId').setValue(null);
                        }
                    } else {
                        for (const mesa of resp.resp) {
                            const punto = {x: mesa.posicionx, y: mesa.posiciony};
                            if (!this.mesaOcupada(punto)) {
                                this.formGroup.get('mesaId').setValue(mesa.id);
                                return;
                            }
                        }
                        this.formGroup.get('mesaId').setValue(null);
                    }
                } else {
                    this.formGroup.get('mesaId').setValue(null);
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

    async getClientes(): Promise<void> {
        this.clientes = [];
        try {
            const resp = await this.clienteService.get();
            console.log(resp);
            if (resp.ok) {
                this.clientes = resp.resp;
            } else {
                this.toastrService.show(`${resp.resp}`,
                    `${resp.msg}`, { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'danger' });
            }
        } catch (error) {
            this.toastrService.show(`${error}`, 'Error',
                { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'danger' });
        }
    }

    mesaSeleccionada(punto: Punto): boolean {
        const mesa = this.mesas.find(m => {
            const mesaid = this.formGroup.get('mesaId').value;
            if (m.id === mesaid) {
                return true;
            }
        });
        if (mesa) {
            if (mesa.posicionx === punto.x && mesa.posiciony === punto.y) {
                return true;
            }
        }
        return false;
    }

    seleccionarMesa(punto: Punto): void {
        const mesa = this.mesas.find(m => {
            const planta = this.formGroup.get('planta').value;
            if (m.posicionx === punto.x && m.posiciony === punto.y && m.planta === planta) {
                return true;
            }
        });
        if (mesa) {
            if (!this.mesaOcupada(punto)) {
                this.formGroup.get('mesaId').setValue(mesa.id);
            }
        }
    }

    getCapacidad(punto: Punto): number {
        const mesa = this.mesas.find(m => {
            const planta = this.formGroup.get('planta').value;
            if (m.posicionx === punto.x && m.posiciony === punto.y && m.planta === planta) {
                return true;
            }
        });
        if (mesa) {
            return mesa.capacidad;
        }
        return 0;
    }

    getNombre(punto: Punto): string {
        const mesa = this.mesas.find(m => {
            const planta = this.formGroup.get('planta').value;
            if (m.posicionx === punto.x && m.posiciony === punto.y && m.planta === planta) {
                return true;
            }
        });
        if (mesa) {
            return mesa.nombre;
        }
        return '';
    }

    async onSave(): Promise<void> {
        Object.keys(this.formGroup.controls).forEach(key => {
            this.formGroup.get(key)?.markAsTouched();
        });
        try {
            if (this.formGroup.valid) {
                const objectCliente: any = {
                    cedula: this.formGroup.get('cedulaCliente').value,
                    nombre: this.formGroup.get('nombreCliente').value,
                    apellido: this.formGroup.get('apellidoCliente').value,
                };
                if (this.formGroup.get('clienteId').value) {
                    objectCliente.id = this.formGroup.get('clienteId').value;
                }
                const modelCliente = new ClienteModel(this.clienteService).deserialize(objectCliente);
                const respCliente = await modelCliente.save();
                if (!respCliente.ok) {
                    this.toastrService.show(`${respCliente.resp}`,
                        `${respCliente.msg}`, { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'danger' });
                    return;
                }
                const cliente = respCliente.resp;
                this.formGroup.get('clienteId').setValue(cliente.id);
                const model = new ReservaModel(this.reservaService).deserialize(this.formGroup.getRawValue());
                const resp = await model.save();
                console.log(resp);
                if (resp.ok) {
                    this.toastrService.show(
                        `id: ${resp.resp.id}`,
                        `${resp.msg}`,
                        { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'success'}
                    );
                    this.formGroup = new ReservaModel(this.reservaService).getFormGroup();
                    this.setListeners();
                    this.ngOnInit();
                } else {
                    this.toastrService.show(`${resp.resp}`,
                        `${resp.msg}`, { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'danger' });
                }
            }
        } catch (error) {
            this.toastrService.show(`${error}`, 'Error', { position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'danger' });
        }
    }
}
