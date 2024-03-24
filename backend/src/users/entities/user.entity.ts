import { Column, DeleteDateColumn, Entity } from 'typeorm';

@Entity()
export class User {
    @Column({primary:true, generated:true})
    id: number;
    @Column({unique:true, nullable:false})
    username: string;
    @Column({nullable:false})
    password: string;
    @Column({default:'user',nullable:false})
    rol: string;
    @Column({unique:true,nullable:false})
    personId: number;
    @DeleteDateColumn()
    deletedAt: Date;
}
