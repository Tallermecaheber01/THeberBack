import { IsDate, IsDateString, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateAppointmentDto {
    @IsString()
    nombreCliente: string;

    @IsString()
    nombreEmpleado: string;

    @IsDateString()  // Cambiar a @IsDateString para validar fechas en formato string
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
    costoExtra: number;

    @IsNumber()
    @IsPositive()
    total: number;
}