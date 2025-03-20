import { 
    IsString, 
    IsEmail, 
    IsNotEmpty, 
    IsOptional, 
    IsPhoneNumber, 
    Length, 
    IsEnum, 
    IsInt 
} from 'class-validator';

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

    @IsPhoneNumber(null)
    @IsNotEmpty()
    @Length(10, 20)
    telefono: string;

    @IsString()
    @IsNotEmpty()
    @Length(8, 20)
    contrasena: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    respuestaSecreta: string;  // ✅ Agregado

    @IsInt()
    @IsNotEmpty()
    idPreguntaSecreta: number;  // ✅ Agregado

    @IsEnum(['activo', 'bloqueado'])
    @IsOptional()
    estado?: 'activo' | 'bloqueado';  // ✅ Agregado

    @IsOptional()
    fechaDesbloqueo?: Date | null;  // ✅ Agregado

    @IsInt()
    @IsOptional()
    intentosFallidos?: number = 0;  // ✅ Agregado
}
