import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('repairs') // Nombre de la tabla en la base de datos
export class RepairEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    idEmpleado: number;

    @Column()
    idCliente: number;

    @Column()
    idCita: number;

    @Column({ type: 'timestamp' })
    fechaHoraAtencion: Date;

    // Usamos simple-array para almacenar un arreglo de strings como una cadena separada por comas
    @Column("json")
    servicio: string[];

    @Column({ type: 'date' })
    fechaCita: Date;

    @Column()
    horaCita: string;

    @Column("decimal")
    costoInicial: number;

    @Column({ nullable: true })
    comentario?: string;

    @Column("decimal")
    extra: number;

    @Column("decimal")
    totalFinal: number;
}
