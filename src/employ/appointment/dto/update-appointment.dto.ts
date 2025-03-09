import { IsDate, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class UpdateAppointmentDto {
    @IsOptional()
    @IsString()
    nombreCliente?: string;

    @IsOptional()
    @IsString()
    nombreEmpleado?: string;

    @IsOptional()
    @IsDate()
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

    @IsString()
    marca?: string;

    @IsString()
    modelo?: string;
}