import { Role } from '../../auth/enums/role.enum';
import { Person } from '../../persons/entities/person.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { Column, DeleteDateColumn, Entity, OneToOne, JoinColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false })
    username: string;

    @Column({ nullable: false, select: false })
    password: string;

    @Column({
        type: "enum",
        enum: Role,
        default: Role.USER,
    })
    roles: Role;

    @OneToOne(() => Person, (person) => person.id, { nullable: false })
    @JoinColumn()
    person: Person;

    @DeleteDateColumn({ select: false })
    deletedAt: Date;

    @OneToMany(type => Ticket, ticket => ticket.createdByUser) // Todos los tickets creados por este usuario
    createdTickets: Ticket[];

    @OneToMany(type => Ticket, ticket => ticket.createdByUser) // Todos los tickets asignados por este usuario a otros usuarios
    asignedToTickets: Ticket[];

    @OneToMany(type => Ticket, ticket => ticket.createdByUser) // Todos los tickets asignados a este usuario
    asignedTickets: Ticket[];

    @Column({ nullable: true, default:null })
    profilePicture: string;
}
