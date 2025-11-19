import { IsNotEmpty, IsInt, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateExpenseDto {
  @IsNotEmpty()
  @IsInt()
  idCliente: number;

  @IsNotEmpty()
  @IsDateString()
  fecha: string;

  @IsNotEmpty()
  @IsString()
  hora: string;

  @IsNotEmpty()
  @IsString()
  marca: string;

  @IsNotEmpty()
  @IsString()
  modelo: string;

  @IsNotEmpty()
  @IsInt()
  idCategoria: number;

  @IsNotEmpty()
  @IsInt()
  total: number;

  @IsOptional()
  @IsString()
  descipcion?: string;
}
