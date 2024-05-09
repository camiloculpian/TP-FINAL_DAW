import { HttpStatusCode } from "@angular/common/http";

export enum responseStatus{
    OK= 'OK',
    ERROR= 'ERROR',
    WARN= 'WARN',
    INFO= 'INFO',
    UNAUTH= 'UNAUTH',
}

export interface ResponseOptions {
    statusCode?:number;
    status?: responseStatus;
    message?: string;
    data?: JSON;
}


export class Response{
    statusCode?:number|undefined;
    status?:string|undefined;
    message?:string|undefined;
    data?:JSON|undefined;

    constructor(options: ResponseOptions){
        console.log(options);
        this.statusCode=options.statusCode;
        this.status=options.status;
        this.message=options.message;
        this.data=options.data;
    }

}