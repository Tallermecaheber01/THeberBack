import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { AppointmentEntity } from "./appointment.entity";

@Entity("appointmentcancellations")
export class AppointmentCancellationEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => AppointmentEntity, (appointment) => appointment.cancellations, { onDelete: "CASCADE" })
    idCita: AppointmentEntity;

    @Column({ type: "enum", enum: ["Cliente", "Empleado", "Administrador"] })
    canceladoPor: "Cliente" | "Empleado" | "Administrador";  // Cambié "canceled_by" a "cancelado_por"

    @Column({ type: "text", nullable: true })
    motivo: string; 

    @CreateDateColumn({ type: "timestamp" })
    canceladoEn: Date;
}
