import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { RegistroService } from './registro/registro.service';
import { User } from './entity/user.entity';
import { LoginService } from './login/login.service';
import { RecoverPasswordService } from './recover-password/recover-password.service'
import { FeedbackService } from './feedback/feedback.service';
import { Feedback } from './entity/feedback.entity';
import { LogEntity } from 'src/log/entity/log.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forFeature([User,Feedback,LogEntity]),  // Para usar TypeORM
    JwtModule.register({
      secret: process.env.JWT_SECRET,  // Cambia esta clave secreta por una más segura
      signOptions: { expiresIn: '1h' },  // Tiempo de expiración del token
    }),
  ],
  controllers: [UsersController],
  providers: [RegistroService, LoginService, RecoverPasswordService, FeedbackService],
  exports : [TypeOrmModule],
})
export class UsersModule {}
