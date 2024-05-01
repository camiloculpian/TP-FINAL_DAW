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
    status: HttpStatus;
    statusCode: HttpStatus;
    responseType: responseType;
    message: string;
    data?: Entitt;
}

export class Response{
    public status:HttpStatus;
    public statusCode:HttpStatus;
    public responseType:string;
    public message:string;
    public data:JSON;

    constructor(options: ResponseOptions){
        this.status=options.status;
        this.statusCode=options.statusCode;
        this.responseType=options.responseType;
        this.message=options.message;
        this.data=options.data;
    }

}