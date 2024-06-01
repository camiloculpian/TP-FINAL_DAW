import { HttpStatusCode } from "@angular/common/http";

export enum responseStatus{
    OK= 'OK',
    ERROR= 'ERROR',
    WARN= 'WARN',
    INFO= 'INFO',
    UNAUTH= 'UNAUTH',
}

export interface ResponseOptions {
    statusCode?:HttpStatusCode;
    status?: responseStatus;
    message?: string;
    data?: any;
}


export class Response{
    statusCode?:HttpStatusCode|undefined;
    status?:string|undefined;
    message?:string|undefined;
    data?:any|undefined;

    constructor(options: ResponseOptions){
        this.statusCode=options.statusCode;
        this.status=options.status;
        this.message=options.message;
        this.data=options.data;
    }

}