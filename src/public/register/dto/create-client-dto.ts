import { IsString, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, Length } from 'class-validator';

export class CreateClientDto {
    @IsOptional()
    id?: number;

    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    nombre: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    apellido_paterno: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    apellido_materno: string;

    @IsEmail()
    @IsNotEmpty()
    @Length(1, 100)
    correo: string;

    @IsPhoneNumber(null)  // Puedes especificar un país si es necesario, por ejemplo, 'MX' para México
    @IsNotEmpty()
    @Length(10, 20)
    telefono: string;

    @IsString()
    @IsNotEmpty()
    @Length(8, 20)  // La contraseña debe tener entre 8 y 20 caracteres
    contrasena: string;
}
