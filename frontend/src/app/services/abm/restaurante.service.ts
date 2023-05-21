import { Injectable } from '@angular/core';
import { ServerResponse, GetFilters } from '../../shared/interfaces';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RestauranteModel } from '../../models/restaurante';


@Injectable({
    providedIn: 'root'
})
export class RestauranteService {
    private url = `${environment.host}/restaurantes`;
    private body = {};
    private headers = {};

    constructor(
        private http: HttpClient,
    ) { }

    async get(id?: number): Promise<ServerResponse> {
        if (id) {
            console.log(`GET Restaurante ${id}`);
            return this.http.get<ServerResponse>(`${this.url}/${id}`).toPromise();
        } else {
            console.log('GET Restaurantes');
            return this.http.get<ServerResponse>(`${this.url}`).toPromise();
        }
    }

    async post(object: RestauranteModel): Promise<ServerResponse> {
        this.body = object.serialize();
        this.headers = {};
        console.log(`POST Restaurante ${ JSON.stringify(this.body) }`);
        return this.http.post<ServerResponse>(this.url, this.body, {headers: this.headers}).toPromise();
    }

    async put(object: RestauranteModel): Promise<ServerResponse> {
        this.body = object.serialize();
        this.headers = {};
        console.log(`PUT Restaurante ${ JSON.stringify(this.body) }`);
        return this.http.put<ServerResponse>(this.url, this.body, {headers: this.headers}).toPromise();
    }

    async delete(id: number): Promise<ServerResponse> {
        console.log(`DELETE Restaurante ${ id }`);
        return this.http.delete<ServerResponse>(`${this.url}/${id}`, {headers: this.headers}).toPromise();
    }
}
