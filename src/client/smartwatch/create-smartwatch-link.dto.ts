import { IsNumber } from 'class-validator';

export class CreateSmartwatchLinkDto {
  @IsNumber()
  clientId: number;
}
