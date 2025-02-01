import { IsString, Length } from 'class-validator';

export class CreateFeedbackDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  @Length(2, 50, { message: 'El nombre debe tener entre 2 y 50 caracteres' })
  nombre: string;

  @IsString({ message: 'El servicio debe ser un texto' })
  @Length(2, 100, { message: 'El servicio debe tener entre 2 y 100 caracteres' })
  servicio: string;

  @IsString({ message: 'El comentario debe ser un texto' })
  @Length(5, 500, { message: 'El comentario debe tener entre 5 y 500 caracteres' })
  comentario: string;
}
