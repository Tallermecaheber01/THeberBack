import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { usuarios } from './login.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'dff3c7ef5be6b1dfa77350c0eeb786c529ecc1312f4660b794cbcc1562ef924a', // Cambia esto por una clave segura
      signOptions: { expiresIn: '1h' }, // Expiración del token
    }),
    TypeOrmModule.forFeature([usuarios])], // Aquí registras la entidad
  controllers: [LoginController],
  providers: [LoginService]
})
export class LoginModule {}
