import { IsNotEmpty, IsString } from 'class-validator';

export class UnlinkSmartwatchDto {
  @IsString()
  @IsNotEmpty()
  fcmToken: string;
}