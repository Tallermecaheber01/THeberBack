import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('repair') //Este es el nombre de la tabla de reparaciones
export class RepairEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column()
    // Aquí puedes agregar otros campos según sea necesario
    status: string;

    // Otros campos
}