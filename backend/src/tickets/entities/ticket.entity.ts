import { User } from "src/users/entities/user.entity";
import { PrimaryGeneratedColumn } from "typeorm";

export class Ticket {
    @PrimaryGeneratedColumn()
    id: number;

    
}
