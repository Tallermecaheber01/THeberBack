import { IsDate, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AppointmentServiceEntity } from "./appointment-services";

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
    @IsString()  // Puede ser un string, ya que la hora se guarda como texto
    hora: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    @IsOptional()  // Opcional
    @IsNumber()
    costoExtra: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    @IsNumber()
    @IsPositive()  // Validación para que el total sea positivo
    total: number;

    @Column({ type: 'varchar', length: 100 })
    @IsString()
    marca: string;

    @Column({ type: 'varchar', length: 100 })
    @IsString()
    modelo: string;

    @OneToMany(() => AppointmentServiceEntity, (service) => service.idCita, { cascade: true })
    services: AppointmentServiceEntity[];  // Aquí debe ser un arreglo de AppointmentServiceEntity
}
