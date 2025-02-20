import { IsString, IsNotEmpty, IsUrl, IsArray, ArrayNotEmpty, IsOptional } from 'class-validator';

export class CreateServiceDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @IsArray() // Aseguramos que sea un array
    @ArrayNotEmpty() // Asegura que el array no esté vacío
    @IsString({ each: true }) // Asegura que cada elemento del array sea una cadena
    tipoVehiculo: string[];

    @IsArray() // Aseguramos que sea un array
    @ArrayNotEmpty() // Asegura que el array no esté vacío
    @IsString({ each: true }) // Asegura que cada elemento del array sea una cadena
    marcas: string[];

    @IsUrl()
    imagen: string;
}
