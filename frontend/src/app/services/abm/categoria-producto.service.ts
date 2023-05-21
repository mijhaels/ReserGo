import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServerResponse } from '../../shared/interfaces';
import { CategoriaProductoModel } from '../../models/categoria-producto';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CategoriaProductoService {
    private url = `${environment.host}/categoriaProductos`;
    private body = {};
    private headers = {};

    constructor(
        private http: HttpClient,
    ) { }

    async get(id?: number): Promise<ServerResponse> {
        if (id) {
            console.log(`GET CategoriaProducto ${id}`);
            return this.http.get<ServerResponse>(`${this.url}/${id}`).toPromise();
        } else {
            console.log('GET CategoriaProductos');
            return this.http.get<ServerResponse>(`${this.url}`).toPromise();
        }
    }

    async post(object: CategoriaProductoModel): Promise<ServerResponse> {
        this.body = object.serialize();
        this.headers = {};
        console.log(`POST CategoriaProducto ${ JSON.stringify(this.body) }`);
        return this.http.post<ServerResponse>(this.url, this.body, {headers: this.headers}).toPromise();
    }

    async put(object: CategoriaProductoModel): Promise<ServerResponse> {
        this.body = object.serialize();
        this.headers = {};
        console.log(`PUT CategoriaProducto ${ JSON.stringify(this.body) }`);
        return this.http.put<ServerResponse>(this.url, this.body, {headers: this.headers}).toPromise();
    }

    async delete(id: number): Promise<ServerResponse> {
        console.log(`DELETE CategoriaProducto ${ id }`);
        return this.http.delete<ServerResponse>(`${this.url}/${id}`, {headers: this.headers}).toPromise();
    }
}
