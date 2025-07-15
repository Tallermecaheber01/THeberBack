import { IsOptional, IsString } from 'class-validator';

export class UpdateQuizContactDto {
  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  sitio_web?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  promocion?: string;
}
