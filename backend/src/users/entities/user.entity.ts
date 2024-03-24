import { Column, DeleteDateColumn, Entity } from 'typeorm';

@Entity()
export class User {
    @Column({primary:true, generated:true})
    id: number;
    @Column({unique:true})
    username: string;
    @Column()
    password: string;
    @Column({unique:true})
    personId: number;
    @DeleteDateColumn()
    deletedAt: Date;
}
