import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { RegisterService } from './register/register.service';

@Module({
  controllers: [PublicController],
  providers: [RegisterService]
})
export class PublicModule {}
