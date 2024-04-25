import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TicketAuditory {
    @PrimaryGeneratedColumn()
    id: number;
}