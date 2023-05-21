import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServerResponse } from '../../shared/interfaces';
import { ClienteModel } from '../../models/cliente';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ClienteService {
    private url = `${environment.host}/clientes`;
    private body = {};
    private headers = {};

    constructor(
        private http: HttpClient,
    ) { }

    async get(id?: number): Promise<ServerResponse> {
        if (id) {
            console.log(`GET Cliente ${id}`);
            return this.http.get<ServerResponse>(`${this.url}/${id}`).toPromise();
        } else {
            console.log('GET Clientes');
            return this.http.get<ServerResponse>(`${this.url}`).toPromise();
        }
    }

    async post(object: ClienteModel): Promise<ServerResponse> {
        this.body = object.serialize();
        this.headers = {};
        console.log(`POST Cliente ${ JSON.stringify(this.body) }`);
        return this.http.post<ServerResponse>(this.url, this.body, {headers: this.headers}).toPromise();
    }

    async put(object: ClienteModel): Promise<ServerResponse> {
        this.body = object.serialize();
        this.headers = {};
        console.log(`PUT Cliente ${ JSON.stringify(this.body) }`);
        return this.http.put<ServerResponse>(this.url, this.body, {headers: this.headers}).toPromise();
    }

    async delete(id: number): Promise<ServerResponse> {
        console.log(`DELETE Cliente ${ id }`);
        return this.http.delete<ServerResponse>(`${this.url}/${id}`, {headers: this.headers}).toPromise();
    }
}
