import { IsEnum, IsNotEmpty } from 'class-validator';

export enum EstadoReparacion {
  PENDIENTE = 'pendiente',
  PAGADO = 'pagado',
  EN_PROCESO = 'en proceso',
}

export class UpdateEstadoDto {
  @IsEnum(EstadoReparacion, { message: 'Estado inválido' })
  @IsNotEmpty()
  estado: EstadoReparacion;
}
