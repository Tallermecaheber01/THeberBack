import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/users/entity/user.entity";

@Entity('vehicle')
export class VehicleEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true }) // El número de serie suele ser único
    numeroSerie: string;

    @Column()
    marca: string;

    @Column()
    modelo: string;

    @Column({ type: 'int' }) // Cambiado de Date a int para representar el año
    año: number;

    @Column({ unique: true }) // La placa también suele ser única
    placa: string;

    @ManyToOne(() => User, user => user.vehiculos, {onDelete:'CASCADE'})
    
    idPropietario:User;
}
