import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RegistroController } from './public/registro/registro/registro.controller';
import { RegistroModule } from './public/registro/registro/registro.module';
import { LoginModule } from './public/login/login/login.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { usuarios } from './public/registro/registro/entities/registro-entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', // o 'postgres'
      host: 'localhost', // o tu host
      port: 3306, // o el puerto correspondiente
      username: 'root', // tu usuario
      password: '', // tu contraseña
      database: 'servicio_automotriz', // nombre de la base de datos
      entities: [usuarios], // incluye las entidades que quieres usar
      synchronize: true, // sincróniza las tablas (solo para desarrollo)
    }),
    RegistroModule, LoginModule],
  controllers: [AppController, RegistroController],
  providers: [AppService],
})
export class AppModule {}
