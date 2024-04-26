import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { Ticket, TicketPriority, TicketStatus } from "src/tickets/entities/ticket.entity";
import { User } from "../../users/entities/user.entity";
// FALTA HACER MODULE Y SERVICE

export enum Operation {
    CREATE= "CREATE",
    UPDATE= "UPDATE",
    DETETE= "DELETE"
}

// DROP TRIGGER trigger_ticket_update;

// DELIMITER //

// CREATE TRIGGER trigger_ticket_update
// AFTER UPDATE ON ticket
// FOR EACH ROW
// BEGIN
//     INSERT INTO ticket_audit (
//         ticketId,
//         description,
//         asignedToUserId,
//         modifiedByUserId,
//         priority,
//         status,
//         modifiedAt,
//         operation
//     )
//     VALUES (
//         NEW.id,
//         NEW.description,
//         NEW.asignedToUserId,
//         NEW.lastModifiedByUserId,
//         NEW.priority,
//         NEW.status,
//         CURRENT_DATE(),
//         'UPDATE'
//     );
// END;
// //

// DROP TRIGGER trigger_ticket_create;

// DELIMITER //

// CREATE TRIGGER trigger_ticket_create
// AFTER INSERT ON ticket
// FOR EACH ROW
// BEGIN
//     INSERT INTO ticket_audit (
//         ticketId,
//         description,
//         asignedToUserId,
//         modifiedByUserId,
//         priority,
//         status,
//         modifiedAt,
//         operation
//     )
//     VALUES (
//         NEW.id,
//         NEW.description,
//         NEW.asignedToUserId,
//         NEW.lastModifiedByUserId,
//         NEW.priority,
//         NEW.status,
//         CURRENT_DATE(),
//         'CREATE'
//     );
// END;
// //

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
