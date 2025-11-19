import { IsOptional, IsString, IsInt, IsDateString, Min, Max, Length } from 'class-validator';

export class UpdateExpenseDto {
  @IsInt()
  @IsOptional()
  idCliente?: number;

  @IsDateString()
  @IsOptional()
  fecha?: string;

  @IsString()
  @IsOptional()
  hora?: string; 

  @IsString()
  @IsOptional()
  @Length(1, 25)
  marca?: string;

  @IsString()
  @IsOptional()
  @Length(1, 25)
  modelo?: string;

  @IsInt()
  @IsOptional()
  idCategoria?: number;

  @IsInt()
  @IsOptional()
  total?: number;

  @IsString()
  @IsOptional()
  descripcion?: string;
}
