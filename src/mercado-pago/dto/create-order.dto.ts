import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  id: number;

  @IsArray()
  @IsString({ each: true })
  servicio: string[];

  @IsString()
  totalFinal: string;
}
