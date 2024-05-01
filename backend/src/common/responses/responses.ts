// Clase para estandarizar y normalizar respuestas del controlador...

import { HttpStatus } from "@nestjs/common";
import { json } from "node:stream/consumers";

export enum responseType{
    OK= 'OK',
    ERROR= 'ERROR',
    WARN= 'WARN',
    INFO= 'INFO',
    UNAUTH= 'UNAUTH',
}

export interface ResponseOptions<Entitt = any> {
    responseType: responseType;
    message: string;
    data?: Entitt;
}

export class Response{
    public responseType:string;
    public message:string;
    public data:JSON;

    constructor(options: ResponseOptions){
        this.responseType=options.responseType;
        this.message=options.message;
        this.data=options.data;
    }

}