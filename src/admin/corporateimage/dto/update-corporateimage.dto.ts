import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCorporateImageDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  titulo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  descripcion?: string;
}

