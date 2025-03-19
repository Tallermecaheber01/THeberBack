import { IsDate, IsNumber, IsOptional, IsPositive, IsString, IsArray } from "class-validator";

export class CreateRepairDto {
    @IsNumber()
    idEmpleado: number;

    @IsNumber()
    idCliente: number;

    @IsNumber()
    idCita: number;

    @IsDate()
    fechaHoraAtencion: Date;

    @IsArray()
    @IsString({ each: true })
    servicio: string[];

    @IsDate()
    fechaCita: Date;

    @IsString()
    horaCita: string;

    @IsNumber()
    @IsPositive()
    costoInicial: number;

    @IsOptional()
    @IsString()
    comentario?: string;

    @IsNumber()
    extra: number;

    @IsNumber()
    @IsPositive()
    totalFinal: number;
}
