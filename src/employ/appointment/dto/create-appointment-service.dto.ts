import { IsNumber, IsPositive, IsString } from "class-validator";

export class CreateAppointmentServiceDto {
    @IsNumber()
    @IsPositive()
    idCita: number;

    @IsString()
    servicio: string;

    @IsNumber()
    @IsPositive()
    costo:number;
}