import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateEmployersDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  apellido_paterno: string;

  @IsNotEmpty()
  @IsString()
  apellido_materno: string;

  @IsNotEmpty()
  @IsEmail()
  correo: string;

  @IsNotEmpty()
  @IsString()
  telefono: string;

  @IsNotEmpty()
  preguntaSecretaId: number;

  @IsNotEmpty()
  @IsString()
  respuestaSecreta: string;

  @IsNotEmpty()
  @Length(6)
  contrasena: string;

  @IsNotEmpty()
  @Length(6)
  confirmarContrasena: string; 
}
