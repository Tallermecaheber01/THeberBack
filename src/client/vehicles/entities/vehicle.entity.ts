import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ClientEntity } from "src/public/recover-password/entity/client-entity";

@Entity('vehicle')
export class VehicleEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    marca: string;

    @Column()
    modelo: string;

    @Column({ type: 'int' }) // Cambiado de Date a int para representar el año
    año: number;

    @Column({ unique: true }) // La placa también suele ser única
    placa: string;

    @Column({ type: 'varchar', length: 17, unique: true }) // El VIN es un identificador único
    VIN: string;

    @Column({ unique: true }) // El número de serie suele ser único
    numeroSerie: string;

    @ManyToOne(() => ClientEntity, client => client.vehiculos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idPropietario' })
    idPropietario: ClientEntity;
}
