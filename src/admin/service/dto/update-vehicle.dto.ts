import { IsOptional, IsString } from "class-validator";

export class UpdateVehicleDto {
    @IsString()
    @IsOptional()
    nombre?: string
}