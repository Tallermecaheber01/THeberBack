import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';

//Modulos
import { ClientModule } from './client/client.module';
import { AdminModule } from './admin/admin.module';

//Entities
import { ServiceEntity } from './admin/service/entities/service.entity';
import { BrandEntity } from './admin/service/entities/brand.entity';
import { VehicleEntity } from './admin/service/entities/vehicle.entity';
import { Feedback } from './users/entity/feedback.entity';
import { User } from './users/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', // o 'postgres'
      host: 'localhost', // o tu host
      port: 3306, // o el puerto correspondiente
      username: 'root', // tu usuario
      password: '', // tu contraseña
      database: 'servicio_automotriz', // nombre de la base de datos
      entities: [User,Feedback,ServiceEntity,BrandEntity,VehicleEntity], // Asegúrate de incluir la entidad aquí
      synchronize: false, // sincróniza las tablas (solo para desarrollo)
    }),
    UsersModule,
    ClientModule,
    AdminModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
