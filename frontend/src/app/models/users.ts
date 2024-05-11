export interface UsernameOptions {
    id?:number|undefined;
    username?:string|undefined;
    password?:string|undefined;
    roles?:string|undefined;
    profile?:{}|undefined;
}

export class User{
    id?:number|undefined;
    username?:string|undefined;
    password?:string|undefined;
    roles?:string|undefined;
    profile?:{}|undefined;
    constructor(options: UsernameOptions){
        console.log(options);
        this.id=options.id;
        this.username=options.username;
        this.password=options.password;
        this.roles=options.roles;
        this.profile=options.profile;
    }

}