import { IsString, IsNotEmpty, IsUrl, IsArray, ArrayNotEmpty, IsOptional, IsInt } from 'class-validator';

export class UpdateServiceDto {
    @IsString()
    @IsOptional()
    nombre?: string;

    @IsString()
    @IsOptional()
    descripcion?: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true }) // Validamos que cada elemento sea un entero
    tipoVehiculo?: number[]; // El array de enteros que representará el tipo de vehículo

    @IsArray()
    @IsOptional()
    @IsInt({ each: true }) // Cada elemento debe ser un string
    marcas?: number[];

    @IsUrl()
    @IsOptional()
    imagen?: string;
}
