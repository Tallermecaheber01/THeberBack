import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entity/user.entity';
import { ClientService } from './client/client.service';
import { ClientModule } from './client/client.module';
import { Feedback } from './users/entity/feedback.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', // o 'postgres'
      host: 'localhost', // o tu host
      port: 3306, // o el puerto correspondiente
      username: 'root', // tu usuario
      password: '', // tu contraseña
      database: 'servicio_automotriz', // nombre de la base de datos
      entities: [User,Feedback], // Asegúrate de incluir la entidad aquí
      synchronize: true, // sincróniza las tablas (solo para desarrollo)
    }),
    UsersModule,
    ClientModule,],
  controllers: [AppController],
  providers: [AppService, ClientService],
})
export class AppModule {}
