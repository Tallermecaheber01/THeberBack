import { IsDate, IsEnum, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { AppointmentRejectionEntity } from "./appointment-rejection-entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AppointmentServiceEntity } from "./appointment-services-entity";
import { AppointmentCancellationEntity } from "./appointment-cancellation-entity";
import { ClientEntity } from "src/public/recover-password/entity/client-entity";
import { AuthorizedPersonnelEntity } from "src/public/recover-password/entity/authorized-personnel-entity";

// Definir los posibles estados de la cita
export enum AppointmentStatus {
    PENDING = "En espera",
    CONFIRMED = "Confirmada",
    CHANGE_PENDING = "Pendiente de cambio",
    RESCHEDULED = "Reprogramada",
    REJECTED = "Rechazada",
    CANCELED = "Cancelada",
    ASSIGNED = "Asignada",
    COMPLETED = "Finalizada"
}

@Entity('appointment')
export class AppointmentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ClientEntity, (cliente) => cliente.appointments, { eager: true })
    @JoinColumn({ name: "IdCliente" })
    cliente: ClientEntity;

    @ManyToOne(() => AuthorizedPersonnelEntity, (empleado) => empleado.appointments, { eager: true })
    @JoinColumn({ name: "IdPersonal" }) // Esta relación manejará automáticamente el ID
    empleado: AuthorizedPersonnelEntity;

    @Column({ type: 'date' })
    fecha: string;

    @Column({ type: 'time' })
    hora: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    costoExtra: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total: number;

    @Column({ type: 'varchar', length: 100 })
    marca: string;

    @Column({ type: 'varchar', length: 100 })
    modelo: string;

    @Column({ type: 'varchar', length: 50 })
    estado: string;

    @OneToMany(() => AppointmentServiceEntity, (service) => service.idCita, { cascade: true })
    services: AppointmentServiceEntity[];

    @OneToMany(() => AppointmentCancellationEntity, (cancellation) => cancellation.idCita)
    cancellations: AppointmentCancellationEntity[];

    @OneToMany(() => AppointmentRejectionEntity, (rejection) => rejection.appointment, { cascade: true })
    rejections: AppointmentRejectionEntity[];
}
