import { IsNotEmpty, IsString } from "class-validator";

export class CreateVehicleDto {
    @IsString()
    @IsNotEmpty()
    nombre:string;
}