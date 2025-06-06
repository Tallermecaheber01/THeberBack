import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('vw_appointment_details')
/** */
export class VwAppointmentDetails {
    @Column()
    idCita: number;

    @Column()
    fecha: Date;

    @Column()
    hora: string;

    @Column({ nullable: true })
    costoExtra: number;

    @Column()
    total: number;

    @Column()
    marca: string;

    @Column()
    modelo: string;

    @Column()
    estado: string;

    @Column()
    idCliente: number;

    @Column()
    nombreCompletoCliente: string;

    @Column()
    correoCliente: string;

    @Column()
    telefonoCliente: string;

    @Column()
    idPersonal: number;

    @Column()
    nombreCompletoPersonal: string;

    @Column()
    correoPersonal: string;

    @Column()
    telefonoPersonal: string;

    @PrimaryColumn()
    idServicio: number;

    @Column()
    nombreServicio: string;

    @Column()
    costoServicio: number;
}
