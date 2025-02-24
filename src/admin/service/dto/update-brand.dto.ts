import { IsOptional, IsString } from "class-validator";

export class UpdateBrandDto {
    @IsString()
    @IsOptional()
    nombre?:string;
}