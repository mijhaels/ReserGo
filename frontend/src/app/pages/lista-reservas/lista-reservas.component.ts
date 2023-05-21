import { Component, OnInit } from '@angular/core';
import { RestauranteService } from '../../services/abm/restaurante.service';
import { ClienteService } from '../../services/abm/cliente.service';
import { MesaService } from '../../services/abm/mesa.service';
import { ReservaService } from '../../services/abm/reserva.service';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { FormBuilder, Validators } from '@angular/forms';
import { HORARIOS_RESERVA } from '../../shared/global';

@Component({
    selector: 'app-lista-reservas',
    templateUrl: './lista-reservas.component.html',
    styleUrls: ['./lista-reservas.component.scss']
})
export class ListaReservasComponent implements OnInit {
    runned: boolean;
    reservas: any[] = [];
    restaurantes: any[] = [];
    clientes: any[] = [];
    mesas: any[] = [];
    source: any[] = [];
    loading: boolean;
    formGroup = this.fb.group({
        restaurantes: [[], Validators.required],
        clientes: [[]],
        fecha: [new Date(), Validators.required]
    });
    columns = [
        { field: 'id', header: 'ID', type: 'numeric' },
        { field: 'fecha', header: 'Fecha', type: 'date' },
        { field: 'cliente', header: 'Cliente', type: 'text' },
        { field: 'restaurante', header: 'Restaurante', type: 'text' },
        { field: 'planta', header: 'Planta', type: 'numeric' },
        { field: 'mesa', header: 'Mesa', type: 'text' },
        { field: 'cantidad', header: 'Cantidad', type: 'numeric' },
        { field: 'horariosStr', header: 'Horarios', type: 'text' },
    ];

    constructor(
        private restauranteService: RestauranteService,
        private clienteService: ClienteService,
        private mesaService: MesaService,
        private reservaService: ReservaService,
        private toastrService: NbToastrService,
        private fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.getClientes();
        this.getMesas();
        this.getReservas();
        this.getRestaurantes();
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
        try {
            const resp = await this.mesaService.get();
            console.log(resp);
            if (resp.ok) {
                this.mesas = resp.resp;
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
        try {
            const resp = await this.clienteService.get();
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

    async getReservas(): Promise<void> {
        try {
            const resp = await this.reservaService.get();
            console.log(resp);
            if (resp.ok) {
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

    formatReserva(reserva: any): any {
        const restaurante = this.restaurantes.find(r => r.id === reserva.restauranteId);
        reserva.restaurante = `${restaurante.id} - ${restaurante.nombre}`;
        const cliente = this.clientes.find(c => c.id === reserva.clienteId);
        reserva.cliente = `${cliente.id} - ${cliente.nombre}`;
        const mesa = this.mesas.find(m => m.id === reserva.mesaId);
        reserva.mesa = `${mesa.id} - ${mesa.nombre}`;
        let horarios = '';
        let sep = '';
        for (const horarioStr of reserva.horarios.split(',')) {
            const horario = Number(horarioStr);
            const horarioObject =  HORARIOS_RESERVA.find(h => h.id === horario);
            horarios += `${sep}${horarioObject.text}`;
            sep = ', ';
        }
        reserva.horariosStr = horarios;
        return reserva;
    }

    run(): void {
        if (this.formGroup.valid) {
            this.loading = true;
            const source = [];
            for (const reserva of this.reservas) {
                const fecha: Date = this.formGroup.get('fecha').value;
                const fechaStr = `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}`;
                const fechaReserva = new Date(reserva.fecha);
                const fechaReservaStr = `${fechaReserva.getFullYear()}-${fechaReserva.getMonth()}-${fechaReserva.getDate()}`;
                if (fechaStr === fechaReservaStr) {
                    if (this.formGroup.get('restaurantes').value.find(r => r === reserva.restauranteId)) {
                        if (this.formGroup.get('clientes').value.length) {
                            if (this.formGroup.get('clientes').value.find(c => c === reserva.clienteId)) {
                                source.push(this.formatReserva(reserva));
                            }
                        } else {
                            source.push(this.formatReserva(reserva));
                        }
                    }
                }
            }
            source.sort((a, b) => {
                const afecha = new Date(a.fecha);
                const bfecha = new Date(b.fecha);
                if (afecha < bfecha) {
                    return -1;
                } else if (afecha > bfecha){
                    return 1;
                } else {
                    const astart = a.horarios[0];
                    const aend = a.horarios[a.horarios.length - 1];
                    const bstart = b.horarios[0];
                    const bend = b.horarios[a.horarios.length - 1];
                    if (astart < bstart) {
                        return -1;
                    } else if (astart > bstart) {
                        return 1;
                    } else {
                        if (aend < bend) {
                            return -1;
                        } else if (aend > bend) {
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                    return 0;
                }
            });
            this.source = source;
            this.runned = true;
            this.loading = false;
        }
    }
}
