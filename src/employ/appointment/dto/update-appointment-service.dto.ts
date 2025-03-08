import { IsNumber, IsPositive, IsString,  } from "class-validator";

export class UpdateAppointmentServiceDto {
    @IsNumber()
    @IsPositive()
    idCita?: number;

    @IsString()
    servicio?: string;

    @IsNumber()
    @IsPositive()
    costo?: number;
}