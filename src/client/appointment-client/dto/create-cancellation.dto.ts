// create-cancellation.dto.ts
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCancellationDto {
  @IsNumber()
  @IsNotEmpty()
  idCita: number;

  @IsEnum(['Cliente', 'Empleado', 'Administrador'])
  canceladoPor: 'Cliente' | 'Empleado' | 'Administrador';

  @IsString()
  @IsNotEmpty()
  motivo: string;
}
