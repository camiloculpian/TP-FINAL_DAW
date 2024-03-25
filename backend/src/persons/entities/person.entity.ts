import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Person {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:false})
    name: string;

    @Column({nullable:false})
    lastName: string;

    @Column({unique:true, nullable:false})
    dni: string;

    @Column({nullable:false})
    address: string;

    @Column({nullable:false})
    birthDate: Date;

    @Column({unique:true})
    email: string;

    @Column()
    phone: string;
    
    @DeleteDateColumn()
    deletedAt: Date;
}
