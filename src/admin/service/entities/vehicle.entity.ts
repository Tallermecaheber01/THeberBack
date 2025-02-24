import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('vehicleType') //Tabla de tipo de vehiculos
export class VehicleEntity {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    nombre:string;
}