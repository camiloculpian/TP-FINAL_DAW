export interface UsernameOptions {
    id: number;
    nombre?:string|undefined;
    username?:string|undefined;
    roles?:string|undefined;
    token?:string|undefined;
    
}

export class CurrentUser{
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

export class User {
    id: number | any;
    token?: string | undefined;
    person?: {
      address?: string | undefined;
      birthDate?: string | undefined;
      dni?: string | undefined;
      email?: string | undefined;
      gender?: string | undefined;
      lastName?: string | undefined;
      name?: string | undefined;
      phone?: string | undefined;
      profilePicture?: string | null;
    };
    profilePicture?: string | null;
    roles?: string | undefined;
    username?: string | undefined;
  }