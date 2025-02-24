import { IsString, IsNotEmpty, IsUrl, IsArray, ArrayNotEmpty, IsOptional, IsInt } from 'class-validator';

export class CreateServiceDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true }) // Validamos que cada elemento sea un entero
    tipoVehiculo: number[]; // El array de enteros que representará el tipo de vehículo
    
    @IsArray() // Aseguramos que sea un array
    @ArrayNotEmpty() // Asegura que el array no esté vacío
    @IsInt({ each: true }) // Asegura que cada elemento del array sea una cadena
    marcas: number[];

    @IsUrl()
    imagen: string;
}
