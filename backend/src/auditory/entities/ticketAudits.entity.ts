import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TicketAudit {
    @PrimaryGeneratedColumn()
    id: number;
}