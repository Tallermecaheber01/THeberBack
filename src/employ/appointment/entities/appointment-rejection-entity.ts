import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { AppointmentEntity } from "./appointment.entity";
import { AuthorizedPersonnelEntity } from "src/public/recover-password/entity/authorized-personnel-entity";

@Entity('appointment_rejection')
export class AppointmentRejectionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => AppointmentEntity, (appointment) => appointment.rejections, { onDelete: "CASCADE" })
    @JoinColumn({ name: "IdCita" }) // Relación con la cita rechazada
    appointment: AppointmentEntity;

    @Column({ type: "text" })
    motivo: string;

    @ManyToOne(() => AuthorizedPersonnelEntity, { eager: true })
    @JoinColumn({ name: "IdPersonal" }) // Relación con el empleado que rechazó la cita
    empleado: AuthorizedPersonnelEntity;
}
