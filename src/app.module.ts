import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Importar ConfigModule y ConfigService
import { UsersModule } from './users/users.module';

// Módulos
import { ClientModule } from './client/client.module';
import { AdminModule } from './admin/admin.module';
import { EmployModule } from './employ/employ.module';

// Entities
import { ServiceEntity } from './admin/service/entities/service.entity';
import { BrandEntity } from './admin/service/entities/brand.entity';
import { VehicleTypeEntity } from './admin/service/entities/vehicle.entity';
import { AppointmentEntity } from './employ/appointment/entities/appointment.entity';
import { AppointmentServiceEntity } from './employ/appointment/entities/appointment-services';
import { AppointmentServicesViewEntity } from './employ/entities/appointment_services_view';
import { Feedback } from './users/entity/feedback.entity';
import { User } from './users/entity/user.entity';
import { UserVehicleViewEntity } from './employ/entities/user-vehicle.view.entity';
import { VehicleEntity } from './client/vehicles/entities/vehicle.entity';
import { PublicModule } from './public/public.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // Hacer las variables de entorno disponibles globalmente
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],  // Importamos ConfigModule
      inject: [ConfigService],  // Inyectamos ConfigService
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql', 
        host: configService.get<string>('DB_HOST'), 
        port: configService.get<number>('DB_PORT'),  
        username: configService.get<string>('DB_USERNAME'), 
        password: configService.get<string>('DB_PASSWORD'), 
        database: configService.get<string>('DB_NAME'), 
        entities: [
          User, Feedback, ServiceEntity, BrandEntity, VehicleTypeEntity,
          AppointmentEntity, UserVehicleViewEntity, VehicleEntity,AppointmentServiceEntity,
          AppointmentServicesViewEntity
        ],
        synchronize: false,  // No sincronizar automáticamente las tablas en producción
      }),
    }),
    UsersModule,
    ClientModule,
    AdminModule,
    EmployModule,
    PublicModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
