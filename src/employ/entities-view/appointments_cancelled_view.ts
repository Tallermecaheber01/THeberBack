import { ViewEntity, ViewColumn } from "typeorm";

@ViewEntity("cancelled_appointments_view")
export class CancelledAppointmentsViewEntity {
    @ViewColumn()
    cita_id: number;

    @ViewColumn()
    nombreCliente: string;

    @ViewColumn()
    nombreEmpleado: string;

    @ViewColumn()
    fecha: string;

    @ViewColumn()
    hora: string;

    @ViewColumn()
    marca: string;

    @ViewColumn()
    modelo: string;

    @ViewColumn()
    total: number;

    @ViewColumn()
    estadoCita: string;

    @ViewColumn()
    servicio_id: number;

    @ViewColumn()
    servicio: string;

    @ViewColumn()
    costoServicio: number;

    @ViewColumn()
    cancelacion_id: number;

    @ViewColumn()
    canceladoPor: "Cliente" | "Empleado" | "Administrador";

    @ViewColumn()
    motivo: string;

    @ViewColumn()
    canceladoEn: Date;
}
