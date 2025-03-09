import { IsDate, IsEnum, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AppointmentServiceEntity } from "./appointment-services";

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

    @Column({ type: 'varchar', length: 255 })
    @IsString()
    nombreCliente: string;

    @Column({ type: 'varchar', length: 255 })
    @IsString()
    nombreEmpleado: string;

    @Column({ type: 'date' })
    @IsDate()
    fecha: string;

    @Column({ type: 'time' })
    @IsString()
    hora: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    @IsOptional()
    @IsNumber()
    costoExtra: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    @IsNumber()
    @IsPositive()
    total: number;

    @Column({ type: 'varchar', length: 100 })
    @IsString()
    marca: string;

    @Column({ type: 'varchar', length: 100 })
    @IsString()
    modelo: string;

    @Column({ type: 'varchar', length: 50 })
    @IsString()
    estado: string;


    @OneToMany(() => AppointmentServiceEntity, (service) => service.idCita, { cascade: true })
    services: AppointmentServiceEntity[];
}
