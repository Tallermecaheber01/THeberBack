// update-appointment-service.dto.ts
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateAppointmentServiceDto {
  @IsNumber()
  id: number; // ID del servicio en la tabla `appointmentservices`

  @IsOptional()
  @IsString()
  servicio?: string;

  @IsOptional()
  @IsNumber()
  costo?: number;
}
