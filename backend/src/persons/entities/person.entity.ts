import { User } from 'src/users/entities/user.entity';
import { Column, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Person {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:false})
    name: string;

    @Column({nullable:false})
    lastName: string;

    @Column({unique:true, nullable:false})
    dni: number;

    @Column({nullable:false})
    address: string;

    @Column({nullable:false})
    birthDate: Date;

    @Column() /**TRUE: MALE FALSE: FEMALE*/
    gender: boolean;

    @Column({unique:true})
    email: string;

    @Column()
    phone: string;
    
    @DeleteDateColumn()
    deletedAt: Date;

    @OneToOne(() => User, (user) => user.person) // specify inverse side as a second parameter
    user: User

}
