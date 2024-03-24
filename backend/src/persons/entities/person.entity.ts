import { Column, DeleteDateColumn, Entity } from 'typeorm';

@Entity()
export class Person {
    @Column({unique:true})
    id: number;
    @Column()
    name: string;
    @Column()
    lastName: string;
    @Column({unique:true})
    dni: string;
    @Column()
    address: number;
    @Column()
    birthDate: Date;
    @Column({unique:true})
    email: string;
    @Column({unique:true})
    phone: string;
    @DeleteDateColumn()
    deletedAt: Date;
}
