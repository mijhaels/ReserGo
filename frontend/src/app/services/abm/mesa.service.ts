import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServerResponse } from '../../shared/interfaces';
import { MesaModel } from '../../models/mesa';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MesaService {
    private url = `${environment.host}/mesas`;
    private body = {};
    private headers = {};

    constructor(
        private http: HttpClient,
    ) { }

    async get(id?: number): Promise<ServerResponse> {
        if (id) {
            console.log(`GET Mesa ${id}`);
            return this.http.get<ServerResponse>(`${this.url}/${id}`).toPromise();
        } else {
            console.log('GET Mesas');
            return this.http.get<ServerResponse>(`${this.url}`).toPromise();
        }
    }

    async post(object: MesaModel): Promise<ServerResponse> {
        this.body = object.serialize();
        this.headers = {};
        console.log(`POST Mesa ${ JSON.stringify(this.body) }`);
        return this.http.post<ServerResponse>(this.url, this.body, {headers: this.headers}).toPromise();
    }

    async put(object: MesaModel): Promise<ServerResponse> {
        this.body = object.serialize();
        this.headers = {};
        console.log(`PUT Mesa ${ JSON.stringify(this.body) }`);
        return this.http.put<ServerResponse>(this.url, this.body, {headers: this.headers}).toPromise();
    }

    async delete(id: number): Promise<ServerResponse> {
        console.log(`DELETE Mesa ${ id }`);
        return this.http.delete<ServerResponse>(`${this.url}/${id}`, {headers: this.headers}).toPromise();
    }
}
