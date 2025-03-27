import { IsNotEmpty, IsString, MaxLength, IsEnum, IsDateString } from 'class-validator';

export enum PoliceEstado {
  Activo = 'Activo',
  Inactivo = 'Inactivo',
}

export class CreatePoliceDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(1500)
  descripcion: string;

  @IsNotEmpty()
  @IsDateString()
  fecha: Date;

  @IsNotEmpty()
  @IsEnum(PoliceEstado)
  estado: PoliceEstado;
}
