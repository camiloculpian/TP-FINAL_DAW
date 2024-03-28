import { Person } from 'src/persons/entities/person.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { Column, DeleteDateColumn, Entity, OneToOne, JoinColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

export enum UserRole {
    ADMIN = "admin",
    USER = "user",
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true, nullable:false})
    username: string;

    @Column({nullable:false})
    password: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.USER,
    })
    rol: UserRole;

    @OneToOne(() => Person)
    @JoinColumn()
    person: Person;
    
    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany(type => Ticket, ticket => ticket.createdByUser) //All tickets created by this user
    createdTickets: Ticket[];

    @OneToMany(type => Ticket, ticket => ticket.createdByUser) //All tickets created by this user
    asignedTickets: Ticket[];
}
