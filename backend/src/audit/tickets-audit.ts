import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Ticket } from "src/tickets/entities/ticket.entity";
import { User } from "../users/entities/user.entity";
// FALTA HACER MODULE Y SERVICE

@Entity()
export class TicketAudit {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Ticket, ticket => ticket.audits)
    @JoinColumn({ name: "id" }) // TICKET_ID
    ticket: Ticket;

    @Column()
    ticketId: number;


    @ManyToOne(() => User, user => user.ticketAudits)
    @JoinColumn({ name: "modified_by" })
    modifiedBy: User;

    @Column()
    modifiedById: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
