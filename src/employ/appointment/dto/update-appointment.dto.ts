import { IsDateString, IsEnum, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { AppointmentStatus } from "../entities/appointment.entity"; // Importamos el enum de estados

export class UpdateAppointmentDto {
    @IsOptional()
    @IsNumber()
    @IsPositive()
    IdCliente?: number; // Cambiado de nombreCliente a IdCliente

    @IsOptional()
    @IsNumber()
    @IsPositive()
    IdPersonal?: number; // Cambiado de nombreEmpleado a IdPersonal

    @IsOptional()
    @IsDateString()  
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

    @IsOptional()
    @IsString()
    marca?: string;

    @IsOptional()
    @IsString()
    modelo?: string;

    @IsOptional()
    @IsEnum(AppointmentStatus)  
    estado?: AppointmentStatus; 
}
