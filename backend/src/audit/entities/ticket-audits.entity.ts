import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { Ticket } from "src/tickets/entities/ticket.entity";
import { User } from "../../users/entities/user.entity";
// FALTA HACER MODULE Y SERVICE

@Entity()
export class TicketAudit {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Ticket, ticket => ticket.id)
    @JoinColumn({ name: "id" }) // TICKET_ID
    ticket: Ticket;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: "createdBy" })
    createdBy: User;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: "modifiedBy" })
    modifiedBy: User;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;
}
