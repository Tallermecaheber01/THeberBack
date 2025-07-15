import { IsNumber, IsString } from 'class-validator';

export class CreateAppointmentServiceDto {
  @IsNumber()
  idCita: number;

  @IsString()
  servicio: string;

  @IsNumber()
  costo: number;
}
