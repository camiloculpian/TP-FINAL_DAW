import { Person } from 'src/persons/entities/person.entity';
import { Column, DeleteDateColumn, Entity, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({unique:true, nullable:false})
    username: string;
    @Column({nullable:false})
    password: string;
    @Column({default:'user',nullable:false})
    rol: string;
    @OneToOne(() => Person)
    @JoinColumn()
    person: Person;
    @DeleteDateColumn()
    deletedAt: Date;
}
