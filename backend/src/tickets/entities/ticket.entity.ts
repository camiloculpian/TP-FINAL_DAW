import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum Priority {
    URGENT = "urgent",
    HIGH = "high",
    NORMAL = "normal",
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
        enum: Priority,
        default: Priority.NORMAL,
    })
    priority: Priority;

    @Column()
    lastModified: Date;

}
