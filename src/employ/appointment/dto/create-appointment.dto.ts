import { IsDateString, IsEnum, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { AppointmentStatus } from "../entities/appointment.entity";  // Importar el enum de estados

export class CreateAppointmentDto {
    @IsNumber()
    @IsPositive()
    IdCliente: number;  // Ahora se usa el ID del cliente en lugar del nombre

    @IsNumber()
    @IsPositive()
    IdPersonal: number;  // Ahora se usa el ID del empleado en lugar del nombre

    @IsDateString()  // Validación para fechas en formato string ISO
    fecha: string;

    @IsString()
    hora: string;

    @IsString()
    nombreServicio: string;

    @IsNumber()
    @IsPositive()
    costoServicio: number;

    @IsOptional()
    @IsNumber()
    costoExtra?: number;

    @IsNumber()
    @IsPositive()
    total: number;

    @IsString()
    marca: string;

    @IsString()
    modelo: string;

    @IsEnum(AppointmentStatus)
    @IsOptional()  // Opcional, pero por defecto será "Asignada"
    estado?: AppointmentStatus = AppointmentStatus.ASSIGNED;
}
