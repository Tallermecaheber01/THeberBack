// update-appointment.dto.ts
import { IsOptional, IsDateString, IsString, IsArray } from 'class-validator';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsDateString()
  fecha?: string;

  @IsOptional()
  @IsString()
  hora?: string;

  @IsOptional()
  @IsArray()
  servicios?: string[]; // Nuevos servicios si se van a reemplazar los actuales
}
