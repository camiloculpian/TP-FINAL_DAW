// Clase para estandarizar y normalizar respuestas del controlador...

export enum responseStatus{
    OK= 'OK',
    ERROR= 'ERROR',
    WARN= 'WARN',
    INFO= 'INFO',
    UNAUTH= 'UNAUTH',
}

export interface ResponseOptions<Entitt = any> {
    status: responseStatus;
    message: string;
    data?: Entitt;
}

export class Response{
    public status:string;
    public message:string;
    public data:JSON;

    constructor(options: ResponseOptions){
        this.status=options.status;
        this.message=options.message;
        this.data=options.data;
    }

}