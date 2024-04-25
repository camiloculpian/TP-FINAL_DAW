import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { Ticket } from "../../tickets/entities/ticket.entity";
import { User } from "../../users/entities/user.entity";

export enum TicketPriority{  // No se si ira asi #duda
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH"
}

export enum TicketStatus{
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    RESOLVED = "RESOLVED"
}

// FALTA HACER MODULE Y SERVICE

@Entity()
export class TicketAudit {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Ticket, ticket => ticket.id)
    @JoinColumn({ name: "id" }) // TICKET_ID
    ticket: Ticket;

    @Column()
    description: string;
    
    @Column({ name: "currentUserId" })
    currentUserId: number;
    
    @Column({
        type: "enum",
        enum: TicketPriority,
        default: TicketPriority.LOW,
    })
    priority: TicketPriority;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: "modifiedBy" })
    modifiedBy: User;

    @Column({ type: "date", nullable: true })
    modifiedDate: Date;

    @Column({
        type: "enum",
        enum: TicketStatus,
        default: TicketStatus.OPEN,
    })
    status: TicketStatus;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: "createdBy" })
    createdBy: User

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;
}

/*

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

*/
