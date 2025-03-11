import { IsDateString, IsEnum, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { AppointmentStatus } from "../entities/appointment.entity"; // Asegúrate de importar el enum de estados si lo necesitas

export class UpdateAppointmentDto {
    @IsOptional()
    @IsString()
    nombreCliente?: string;

    @IsOptional()
    @IsString()
    nombreEmpleado?: string;

    @IsOptional()
    @IsDateString()  // Cambié IsDate() a IsDateString() para validar que sea un string de fecha en formato ISO
    fecha?: string;

    @IsOptional()
    @IsString()
    hora?: string;

    @IsOptional()
    @IsString()
    nombreServicio?: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    costoServicio?: number;

    @IsOptional()
    @IsNumber()
    costoExtra?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    total?: number;

    @IsOptional()  // Asegúrate de marcar estos campos como opcionales si quieres permitir que no se actualicen
    @IsString()
    marca?: string;

    @IsOptional()
    @IsString()
    modelo?: string;

    @IsOptional()
    @IsEnum(AppointmentStatus)  // Si el estado se puede actualizar también, asegúrate de que sea un enum válido
    estado?: AppointmentStatus; 
}
