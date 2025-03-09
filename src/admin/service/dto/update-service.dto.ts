import { IsString, IsOptional, IsUrl, IsArray, ArrayNotEmpty } from 'class-validator';

export class UpdateServiceDto {
    @IsString()
    @IsOptional()
    nombre?: string;

    @IsString()
    @IsOptional()
    descripcion?: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true }) // Validamos que cada elemento sea una cadena
    @IsOptional()
    tipoVehiculo?: string[]; // Ahora es un array de strings

    @IsArray()
    @IsOptional()
    @IsString({ each: true }) // Validamos que cada elemento sea una cadena
    marcas?: string[]; // Ahora es un array de strings

    @IsArray()
    @IsOptional()
    @IsString({ each: true }) // Validamos que cada elemento sea una cadena
    modelos?: string[]; // Ahora es un array de strings

    @IsUrl()
    @IsOptional()
    imagen?: string;
}
