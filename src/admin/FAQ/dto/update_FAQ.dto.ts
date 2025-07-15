import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateFaqDto {
  @IsInt()
  id_faq: number;

  @IsOptional()
  @IsString()
  pregunta?: string;

  @IsOptional()
  @IsString()
  respuesta?: string;
}
