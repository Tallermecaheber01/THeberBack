import { IsArray, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class UpdateRepairDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  servicio?: string[];

  @IsOptional()
  @IsNumber()
  @IsPositive()
  costoInicial?: number;

  @IsOptional()
  @IsString()
  comentario?: string;

  @IsOptional()
  @IsNumber()
  extra?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  totalFinal?: number;
}
