import { Entity } from 'typeorm';

@Entity()
export class User {
    id: number;
    username: string;
    password: string;
    email: string;
}
