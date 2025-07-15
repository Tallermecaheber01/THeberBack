import { IsNotEmpty, IsString, MaxLength, IsEnum, IsDateString } from 'class-validator';

export enum PoliceEstado {
  Activo = 'Activo',
  Inactivo = 'Inactivo',
}

export class UpdatePoliceDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(10000)
  descripcion: string;

  @IsNotEmpty()
  @IsDateString()
  fecha: Date;

  @IsNotEmpty()
  @IsEnum(PoliceEstado)
  estado: PoliceEstado;
}
