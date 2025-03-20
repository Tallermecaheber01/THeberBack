import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { RegisterService } from './register/register.service';
import { LoginService } from './login/login.service';
import { RecoverPasswordService } from './recover-password/recover-password.service';
import { ConfigModule } from '@nestjs/config';
import { ClientEntity } from './recover-password/entity/client-entity';
import { AuthorizedPersonnelEntity } from './recover-password/entity/authorized-personnel-entity';
import { UserViewEntity } from './register/view/vw-users-entity';
import { JwtModule } from '@nestjs/jwt';
import { LogEntity } from 'src/log/entity/log.entity';
import { InformationService } from './information/information.service';
import { QuestionSecretEntity } from './register/entity/question-secret.entity';
import { UnlockService } from './unlock/unlock.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports:[
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forFeature([ClientEntity,UserViewEntity,LogEntity,AuthorizedPersonnelEntity,QuestionSecretEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' }, // Token expira en 1 minuto
    })
  ],
  controllers: [PublicController],
  providers: [RegisterService, LoginService, RecoverPasswordService, InformationService, UnlockService]
})
export class PublicModule {}
