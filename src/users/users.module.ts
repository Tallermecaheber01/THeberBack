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

@Module({
  imports: [
    TypeOrmModule.forFeature([User,Feedback]),  // Para usar TypeORM
    JwtModule.register({
      secret: 'dff3c7ef5be6b1dfa77350c0eeb786c529ecc1312f4660b794cbcc1562ef924a',  // Cambia esta clave secreta por una más segura
      signOptions: { expiresIn: '1h' },  // Tiempo de expiración del token
    }),
  ],
  controllers: [UsersController],
  providers: [RegistroService, LoginService, RecoverPasswordService, FeedbackService],
  exports : [TypeOrmModule],
})
export class UsersModule {}
