import { IsOptional, IsString, IsInt, Min, Max, Length, Matches } from "class-validator";

export class UpdateVehicleDto {
    @IsString()
    @IsOptional()
    marca?: string;

    @IsString()
    @IsOptional()
    modelo?: string;

    @IsInt()
    @IsOptional()
    @Min(1900)
    @Max(new Date().getFullYear() + 1)
    año?: number;

    @IsString()
    @IsOptional()
    @Matches(/^[A-Z0-9-]+$/)
    numeroPlaca?: string;

    @IsString()
    @IsOptional()
    @Length(17, 17)
    VIN?: string;

    @IsString()
    @IsOptional()
    numeroSerie?: string;
}
