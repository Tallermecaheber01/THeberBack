import { IsString, IsNotEmpty, MaxLength, Min, Max, IsInt } from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(100, { message: 'El nombre no puede superar los 100 caracteres' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'El servicio es obligatorio' })
  @MaxLength(100, { message: 'El servicio no puede superar los 100 caracteres' })
  servicio: string;

  @IsInt({ message: 'La calificación debe ser un número entero' })
  @Min(1, { message: 'La calificación mínima es 1 estrella' })
  @Max(5, { message: 'La calificación máxima es 5 estrellas' })
  calificacion: number;

  @IsString()
  @IsNotEmpty({ message: 'El comentario es obligatorio' })
  comentario: string;
}
