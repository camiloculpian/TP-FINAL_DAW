import { User } from "../../users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

// export enum Priority {
//     URGENT = "urgent",
//     HIGH = "high",
//     NORMAL = "normal",
// }

// Pioridad
export enum TicketPriority{
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH"
}

//  Estado del ticket
export enum TicketStatus{
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    RESOLVED = "RESOLVED"
}

// A que servicio pertenece (se puede considerar ya que creando al usuario se podria asignar el rol o a que parte de departamento pertenece y que se filtren por ahi)
export enum TicketsService {
    TRANSPORTATION = "TRANSPORTATION",
    STORAGE = "STORAGE",
    DISTRIBUCION = "DISTRIBUTION",
    CUSTOMS = "CUSTOMS",
    CUSTOMER_SERVICE = "CUSTOMER_SERVICE"
}

@Entity()
export class Ticket {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.id) //User who creates the ticket
    createdByUser: User;

    @ManyToOne(type => User, user => user.id) //User who asigns the ticket to other user (on first will be the admin, but then other user can re-asign))
    asignedByUser: User;

    @ManyToOne(type => User, user => user.id) //User who owns the ticket
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

    @Column()
    lastModified: Date;

}
