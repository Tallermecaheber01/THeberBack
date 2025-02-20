import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('services') // Nombre de la tabla en la BD
export class ServiceEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @Column("simple-array") // Usamos simple-array para guardar arrays
    tipoVehiculo: string[];

    @Column("simple-array") // Usamos simple-array para guardar arrays
    marcas: string[];

    @Column()
    imagen: string;
}
