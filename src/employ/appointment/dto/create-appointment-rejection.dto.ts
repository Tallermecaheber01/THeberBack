import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateAppointmentRejectionDto {
    @IsNumber()
    @IsNotEmpty()
    idCita: number;  // ID de la cita que se rechaza

    @IsString()
    @IsNotEmpty()
    motivo: string;  // Motivo del rechazo

    @IsNumber()
    @IsNotEmpty()
    idPersonal: number;  // ID del personal que rechaza la cita
}
