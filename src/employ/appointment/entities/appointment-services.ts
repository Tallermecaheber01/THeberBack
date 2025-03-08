import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { AppointmentEntity } from "./appointment.entity";
import { IsNumber, IsPositive, IsString } from "class-validator";

@Entity('appointmentservices')
export class AppointmentServiceEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => AppointmentEntity, (appointment) => appointment.services, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idCita' })  // Aquí especificamos el nombre exacto de la columna
    idCita: AppointmentEntity;

    @Column({ type: 'varchar', length: 255 })
    @IsString()
    servicio: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    @IsNumber()
    @IsPositive()
    costo: number;
}
