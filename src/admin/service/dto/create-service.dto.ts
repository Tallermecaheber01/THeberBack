import { IsString, IsNotEmpty, IsUrl, IsArray, ArrayNotEmpty, IsOptional } from 'class-validator';

export class CreateServiceDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true }) // Validamos que cada elemento sea una cadena
    tipoVehiculo: string[]; // Ahora es un array de strings
    
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true }) // Validamos que cada elemento sea una cadena
    marcas: string[]; // Ahora es un array de strings

    @IsUrl()
    imagen: string;
}
