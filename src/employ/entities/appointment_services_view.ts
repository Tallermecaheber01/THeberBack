import { Column, ViewEntity } from 'typeorm';

@ViewEntity('appointment_services_view')
export class AppointmentServicesViewEntity {
    @Column()
    appointment_id: number;

    @Column()
    nombreCliente: string;

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
}
