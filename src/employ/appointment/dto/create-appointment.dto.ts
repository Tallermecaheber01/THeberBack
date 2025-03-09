import { IsDateString, IsEnum, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { AppointmentStatus } from "../entities/appointment.entity";  // Importar el enum de estados

export class CreateAppointmentDto {
    @IsString()
    nombreCliente: string;

    @IsString()
    nombreEmpleado: string;

    @IsDateString()  // Validación para fechas en formato string
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
