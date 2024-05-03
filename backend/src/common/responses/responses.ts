// Clase para estandarizar y normalizar respuestas del controlador...

import { HttpStatus } from "@nestjs/common";

export enum responseStatus{
    OK= 'OK',
    ERROR= 'ERROR',
    WARN= 'WARN',
    INFO= 'INFO',
    UNAUTH= 'UNAUTH',
}

export interface ResponseOptions<Entitt = any> {
    statusCode:HttpStatus;
    status: responseStatus;
    message: string;
    data?: Entitt;
}

export class Response{
    public statusCode:HttpStatus;
    public status:string;
    public message:string;
    public data:JSON;

    constructor(options: ResponseOptions){
        this.statusCode=options.statusCode;
        this.status=options.status;
        this.message=options.message;
        this.data=options.data;
    }

}