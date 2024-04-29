import { User } from '../../users/entities/user.entity';
import {
    Column,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

export enum TicketPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
}

export enum TicketStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    RESOLVED = 'RESOLVED',
}

export enum TicketsService {
    HARDWARE_REPAIR = 'HARDWARE_REPAIR',
    REMOTE_SERVICE = 'REMOTE_SERVICE',
    TECHNICAL_SERVICE = 'TECHNICAL_SERVICE',
    CUSTOMER_SERVICE = 'CUSTOMER_SERVICE',
    CUSTOMER_SUPPORT = 'CUSTOMER_SUPPORT',
    SOFTWARE_SUPORT = 'SOFTWARE_SUPORT',
    PREVENTIVE_MAINTENANCE = 'PREVENTIVE_MAINTENANCE',
    PC_ASSEMBLY = 'PC_ASSEMBLY ',
    DATA_RECORVERY = 'DATA_RECORVERY',
    VIRUS_REMOVAL = 'VIRUS_REMOVAL',
    HARDWARE_UPGRADES = 'HARDWARE_UPGRADES',
    EMERGENCY_REPAIR = 'EMERGENCY_REPAIR',
    IT_ACCESSORY_SALES = 'IT_ACCESSORY_SALES',
}

@Entity()
export class Ticket {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @ManyToOne((type) => User, (user) => user.id) // Usuario que crea el ticket. Se toma del ID del usuario autenticado y autorizado para crear el ticket
    createdByUser: User;

    @ManyToOne((type) => User, (user) => user.id) // Usuario que asigna el ticket a otro usuario (al principio será el administrador, pero luego otro usuario puede reasignar). Se toma del ID del usuario autenticado y autorizado para reasignar el ticket
    asignedByUser: User;

    @ManyToOne((type) => User, (user) => user.id) // Usuario propietario del ticket. Chequear que exista y sea válido
    asignedToUser: User;

    @Column()
    description: string;

    @Column({
        type: 'enum',
        enum: TicketPriority,
        default: TicketPriority.LOW,
    })
    priority: TicketPriority;

    @Column({
        type: 'enum',
        enum: TicketStatus,
        default: TicketStatus.OPEN,
    })
    status: TicketStatus;

    @Column({
        type: 'enum',
        enum: TicketsService,
        default: TicketsService.CUSTOMER_SERVICE,
    })
    service: TicketsService;

    @Column({ nullable: true })
    lastModified: Date;

    @ManyToOne((type) => User, (user) => user.id, { nullable: true }) // Usuario que modificó el ticket por última vez. Chequear que exista y sea válido
    lastModifiedByUser: User;

    @Column({
        type: 'timestamp',
        default: () => 'now()',
    })
    createdAt: Date;

    @DeleteDateColumn({ select: false })
    deletedAt: Date;

    @Column({ nullable: true })
    archive: string;
}
