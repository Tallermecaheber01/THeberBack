import { IsNotEmpty, IsString } from 'class-validator';

export class LinkSmartwatchDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  fcmToken: string;
}
