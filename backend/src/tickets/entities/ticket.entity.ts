import { User } from "src/users/entities/user.entity";
import { ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export class Ticket {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.id)
    user: User;

}
