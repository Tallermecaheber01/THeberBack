import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { RegisterService } from './register/register.service';
import { LoginService } from './login/login.service';
import { RecoverPasswordService } from './recover-password/recover-password.service';
import { ConfigModule } from '@nestjs/config';
import { ClientEntity } from './register/entity/client-entity';
import { AuthorizedPersonnelEntity } from './recover-password/entity/authorized-personnel-entity';
import { UserViewEntity } from './register/view/vw-users-entity';
import { JwtModule } from '@nestjs/jwt';
import { LogEntity } from 'src/log/entity/log.entity';
import { InformationService } from './information/information.service';
@Module({
  imports:[
    ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forFeature([ClientEntity,UserViewEntity,LogEntity,AuthorizedPersonnelEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions:{expiresIn:'1h'},
    })
  ],
  controllers: [PublicController],
  providers: [RegisterService, LoginService, RecoverPasswordService, InformationService]
})
export class PublicModule {}
