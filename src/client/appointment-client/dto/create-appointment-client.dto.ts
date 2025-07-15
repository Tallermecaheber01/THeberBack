// create-appointment.dto.ts
import { IsString, IsNotEmpty, IsArray, IsDateString } from 'class-validator';

export class CreateAppointmentDto {
    @IsDateString()
    @IsNotEmpty()
    fecha: string;

    @IsString()
    @IsNotEmpty()
    hora: string;

    @IsString()
    @IsNotEmpty()
    marca: string;

    @IsString()
    @IsNotEmpty()
    modelo: string;

    @IsArray()
    servicios: string[]; // Asegúrate de tenerlo así para que funcione el mapeo
}
