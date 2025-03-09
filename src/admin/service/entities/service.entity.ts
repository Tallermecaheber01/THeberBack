import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('services') // Nombre de la tabla en la BD
export class ServiceEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @Column("json")
    tipoVehiculo: string[]; // Aquí se guardará el array de números

    @Column("json") // Usamos simple-array para guardar arrays
    marcas: string[];

    @Column("json") // Usamos simple-array para guardar arrays
    modelos: string[];

    @Column()
    imagen: string;
}
