import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServerResponse } from '../../shared/interfaces';
import { ReservaModel } from '../../models/reserva';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ReservaService {
    private url = `${environment.host}/reservas`;
    private body = {};
    private headers = {};

    constructor(
        private http: HttpClient,
    ) { }

    async get(id?: number): Promise<ServerResponse> {
        if (id) {
            console.log(`GET Reserva ${id}`);
            return this.http.get<ServerResponse>(`${this.url}/${id}`).toPromise();
        } else {
            console.log('GET Reservas');
            return this.http.get<ServerResponse>(`${this.url}`).toPromise();
        }
    }

    async post(object: ReservaModel): Promise<ServerResponse> {
        this.body = object.serialize();
        this.headers = {};
        console.log(`POST Reserva ${ JSON.stringify(this.body) }`);
        return this.http.post<ServerResponse>(this.url, this.body, {headers: this.headers}).toPromise();
    }

    async put(object: ReservaModel): Promise<ServerResponse> {
        this.body = object.serialize();
        this.headers = {};
        console.log(`PUT Reserva ${ JSON.stringify(this.body) }`);
        return this.http.put<ServerResponse>(this.url, this.body, {headers: this.headers}).toPromise();
    }

    async delete(id: number): Promise<ServerResponse> {
        console.log(`DELETE Reserva ${ id }`);
        return this.http.delete<ServerResponse>(`${this.url}/${id}`, {headers: this.headers}).toPromise();
    }
}
