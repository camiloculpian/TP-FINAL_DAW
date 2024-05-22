// Enums
export enum TicketPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH'
}

export enum TicketStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    RESOLVED = 'RESOLVED'
}

// Interfaces

export interface Ticket {
    id: number;
    title: string;
    description: string;
    priority: string;
    service: string;
    status: string;
    asignedToUserId: number;
}