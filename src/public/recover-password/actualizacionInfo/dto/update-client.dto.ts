import { IsString, IsEmail, Length, IsOptional, Matches, IsInt  } from 'class-validator';

export class UpdateClientDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  nombre?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  apellido_paterno?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  apellido_materno?: string;

  @IsOptional()
  @IsEmail()
  correo?: string;

  @IsOptional()
  @IsString()
  @Length(7, 20)
  telefono?: string;

  /**
   * Para cambiar contraseña. Se recomienda una longitud mínima de 8
   * y al menos una mayúscula, una minúscula y un número.
   */
  @IsOptional()
  @IsString()
  @Length(8, 100)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+/, {
    message:
      'La contraseña debe tener al menos una mayúscula, una minúscula y un número',
  })
  contrasena?: string;

    @IsOptional()
  @IsInt()
  idPreguntaSecreta?: number;

  @IsOptional()
  @IsString()
  @Length(3, 255)
  respuestaSecreta?: string;
}

