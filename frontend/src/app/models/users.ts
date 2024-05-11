export interface UsernameOptions {
    nombre?:string|undefined;
    username?:string|undefined;
    roles?:string|undefined;
    token?:string|undefined;
}

export class User{
    nombre?:string|undefined;
    username?:string|undefined;
    roles?:string|undefined;
    token?:string|undefined;
    constructor(options: UsernameOptions){
        this.nombre=options.nombre;
        this.username=options.username;
        this.roles=options.roles;
        this.token=options.token;
    }
}