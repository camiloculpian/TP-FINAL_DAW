import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { Ticket, TicketPriority, TicketStatus } from "../../tickets/entities/ticket.entity";
import { User } from "../../users/entities/user.entity";

export enum Operation {
    CREATE= "CREATE",
    UPDATE= "UPDATE",
    DELETE= "DELETE"
}
@Entity()
export class TicketAudit {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Ticket, (ticket) => ticket.id)
    @JoinColumn() // TICKET_ID
    ticket: Ticket;

    @Column()
    description : string;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn()
    asignedToUser: User;

    @Column({
        type: "enum",
        enum: TicketPriority
    })
    priority: TicketPriority;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn()
    modifiedByUser: User;

    @Column()
    modifiedAt: Date;

    @Column({
        type: "enum",
        enum: TicketStatus
    })
    status: TicketStatus

    @Column({
        type: "enum",
        enum: Operation
    })
    operation: Operation
}
