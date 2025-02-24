import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('brands') //nombre de la tabla marca
export class BrandEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre:string;
}