import { User } from '../../users/entities/user.entity';
import {
    Column,
    DeleteDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}

@Entity()
export class Person {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    lastName: string;

    @Column({ unique: true, nullable: false })
    dni: string;

    @Column({ nullable: false })
    address: string;

    @Column({ nullable: false })
    birthDate: Date;

    @Column({
        type: 'enum',
        enum: Gender,
        default: Gender.MALE,
    })
    gender: Gender;

    @Column({ unique: true })
    email: string;

    @Column()
    phone: string;

    @DeleteDateColumn({ select: false })
    deletedAt: Date;

    @OneToOne(() => User, (user) => user.person) // specify inverse side as a second parameter
    user: User;

    @Column({nullable:true, default:null})
    profilePicture: string;
}
