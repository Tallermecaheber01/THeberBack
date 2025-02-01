import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' })
  nombre: string;

  @IsNotEmpty({ message: 'El apellido paterno es obligatorio' })
  @Length(2, 100, { message: 'El apellido paterno debe tener entre 2 y 100 caracteres' })
  apellido_paterno: string;

  @IsNotEmpty({ message: 'El apellido materno es obligatorio' })
  @Length(2, 100, { message: 'El apellido materno debe tener entre 2 y 100 caracteres' })
  apellido_materno: string;

  @IsNotEmpty({ message: 'El correo es obligatorio' })
  @IsEmail({}, { message: 'El correo no es válido' })
  correo: string;

  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  @Matches(/^[0-9]{10}$/, { message: 'El teléfono debe tener 10 dígitos numéricos' })
  telefono: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @Length(8, 255, { message: 'La contraseña debe tener al menos 8 caracteres' })
  contrasena: string;
}
