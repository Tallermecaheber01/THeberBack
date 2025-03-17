import { Column, ViewEntity } from 'typeorm';

@ViewEntity('vw_appointments_services')
export class AppointmentServicesViewEntity {
    @Column()
    appointment_id: number;

    @Column()
    cliente_id: number;  // ID del cliente

    @Column()
    nombreCliente: string;

    @Column()
    empleado_id: number;  // ID del empleado

    @Column()
    nombreEmpleado: string;

    @Column()
    fecha: string;

    @Column()
    hora: string;

    @Column()
    total: number;

    @Column({ nullable: true })
    costoExtra: number;

    @Column()
    servicio: string;

    @Column()
    costo: number;

    @Column()
    marca: string;

    @Column()
    modelo: string;

    @Column()
    estado: string;
}
