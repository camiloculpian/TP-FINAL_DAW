import { Role } from '../../auth/enums/role.enum';
import { Person } from '../../persons/entities/person.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { Column, DeleteDateColumn, Entity, OneToOne, JoinColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true, nullable:false})
    username: string;

    @Column({nullable:false})
    password: string;

    // TO-DO: esto deberia ser una lista de Roles o sacamos a la miercoles el rol dispatcher
    @Column({
        type: "enum",
        enum: Role,
        default: Role.USER,
    })
    roles: Role;

    @OneToOne(() => Person, (person) => person.id, {nullable:false})
    @JoinColumn()
    person: Person;
    
    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany(type => Ticket, ticket => ticket.createdByUser) // All tickets created by this user
    createdTickets: Ticket[];

    @OneToMany(type => Ticket, ticket => ticket.createdByUser) //All tickets asigned by this user to other users
    asignedToTickets: Ticket[];

    @OneToMany(type => Ticket, ticket => ticket.createdByUser) //All tickets asigned to this user
    asignedTickets: Ticket[];
}
