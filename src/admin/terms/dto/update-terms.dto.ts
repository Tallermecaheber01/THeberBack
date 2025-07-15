import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateTermsDto {
  @IsOptional()
  @IsString({ message: 'La información debe ser un texto válido' })
  @IsNotEmpty({ message: 'La información no puede estar vacía' })
  info?: string;
}