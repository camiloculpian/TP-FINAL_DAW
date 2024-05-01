// Clase para estandarizar y normalizar respuestas del controlador...

import { HttpStatus } from "@nestjs/common";

export enum responseType{
    OK= 'OK',
    ERROR= 'ERROR',
    WARN= 'WARN',
    INFO= 'INFO',
    UNAUTH= 'UNAUTH',
}

export class Response{
    public statusCode:HttpStatus;
    public type:string;
    public message:string;
    public data:JSON;

    constructor(statusCode:HttpStatus,type:responseType,message:string,data?:JSON){
        statusCode=statusCode;
        type=type;
        message=message;
        data=data;
    }

}