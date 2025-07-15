import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateDemarcationDto {
  @IsOptional()
  @IsString({ message: 'La información debe ser texto' })
  @IsNotEmpty({ message: 'La información no puede estar vacía' })
  info?: string;
}