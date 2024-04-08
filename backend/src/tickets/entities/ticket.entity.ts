import { IsDate } from "class-validator";
import { User } from "../../users/entities/user.entity";
import { Column, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


export enum TicketPriority{
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH"
}

export enum TicketStatus{
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    RESOLVED = "RESOLVED"
}

// Esto podria estar en otra tabla y que sean creadas segun sea necesario?
export enum TicketsService {
    HARDWARE_REPAIR = "HARDWARE_REPAIR",
    REMOTE_SERVICE = "REMOTE_SERVICE",
    TECHNICAL_SERVICE = "TECHNICAL_SERVICE",
    CUSTOMER_SERVICE = "CUSTOMER_SERVICE",
    CUSTOMER_SUPPORT = "CUSTOMER_SUPPORT",
    CUSTOMS = "CUSTOMS",
    SOFTWARE_SUPORT = "SOFTWARE_SUPORT",
    PREVENTIVE_MAINTENANCE = "PREVENTIVE_MAINTENANCE",
    PC_ASSEMBLY = "PC_ASSEMBLY "
} 

@Entity()
export class Ticket {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.id) //User who creates the ticket
    createdByUser: User;

    @ManyToOne(type => User, user => user.id) //User who asigns the ticket to other user (on first will be the admin, but then other user can re-asign))
    asignedByUser: User;

    @ManyToOne(type => User, user => user.id, { nullable: true }) //User who owns the ticket
    asignedToUser: User;

    @Column()
    description: string;

    @Column({
        type: "enum",
        enum: TicketPriority,
        default: TicketPriority.LOW,
    })
    priority: TicketPriority;

    @Column({
        type: "enum",
        enum: TicketStatus,
        default: TicketStatus.OPEN,
    })
    status: TicketStatus;

    @Column({
        type: "enum",
        enum: TicketsService,
        default: TicketsService.CUSTOMER_SERVICE,
    })
    service: TicketsService;

    @Column({nullable:true})
    lastModified: Date;

    @Column({
        type: "timestamp",
        default: () => "now()"
    })
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

}
