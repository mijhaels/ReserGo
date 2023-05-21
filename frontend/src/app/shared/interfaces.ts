export interface ServerResponse {
    ok: boolean;
    msg: string;
    resp: any;
}

export interface HorarioReserva {
    id: number;
    text: string;
}

export interface GetFilters {
    equals: {[key: string]: any}[];
    in: {[key: string]: any[]}[];
    between: {[key: string]: {desde: any, hasta: any}}[];
    notequal: {[key: string]: any}[];
}

export interface Punto {
    x: number;
    y: number;
}
