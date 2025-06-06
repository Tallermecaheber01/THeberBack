import { IsNotEmpty, IsString, IsInt, Min, Max, Length, Matches } from "class-validator";
import { Is } from "sequelize-typescript";

export class CreateVehicleDto {
    @IsString()
    @IsNotEmpty()
    marca: string;

    @IsString()
    @IsNotEmpty()
    modelo: string;

    @IsInt()
    @IsNotEmpty()
    año: number;

    @IsString()
    @IsNotEmpty()
    @Matches(/^[A-Z0-9-]+$/, { message: 'La placa contiene caracteres inválidos' })
    placa: string;

    @IsString()
    @IsNotEmpty()
    @Length(17, 17, { message: 'El VIN debe tener exactamente 17 caracteres' })
    VIN: string;

    @IsString()
    @IsNotEmpty()
    numeroSerie: string;

    @IsInt()
    @IsNotEmpty()
    idPropietario: {id: number}; // Cambiado a { id: number } para reflejar la relación con ClientEntity
}
