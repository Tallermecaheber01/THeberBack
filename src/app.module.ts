import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Importar ConfigModule y ConfigService

// Módulos
import { ClientModule } from './client/client.module';
import { AdminModule } from './admin/admin.module';
import { EmployModule } from './employ/employ.module';
import { PublicModule } from './public/public.module';

// Entities
import { ServiceEntity } from './admin/service/entities/service.entity';
import { BrandEntity } from './admin/service/entities/brand.entity';
import { VehicleTypeEntity } from './admin/service/entities/vehicle.entity';
import { AppointmentEntity } from './employ/appointment/entities/appointment.entity';
import { AppointmentServiceEntity } from './employ/appointment/entities/appointment-services-entity';
import { AppointmentServicesViewEntity } from './employ/entities-view/appointment_services_view';
import { UserVehicleViewEntity } from './employ/entities-view/user-vehicle.view.entity';
import { VehicleEntity } from './client/vehicles/entities/vehicle.entity';
import { RepairEntity } from './employ/repair/entities/repair.entity';
import { AppointmentCancellationEntity } from './employ/appointment/entities/appointment-cancellation-entity';
import { CancelledAppointmentsViewEntity } from './employ/entities-view/appointments_cancelled_view';
import { ClientEntity } from './public/recover-password/entity/client-entity';
import { UserViewEntity } from './public/register/view/vw-users-entity';
import { AuthorizedPersonnelEntity } from './public/recover-password/entity/authorized-personnel-entity';
import { AppointmentWaitingViewEntity } from './employ/entities-view/appointment_waiting_view';
import { AppointmentRejectionEntity } from './employ/appointment/entities/appointment-rejection-entity';
import { QuestionSecretEntity } from './public/register/entity/question-secret.entity';
import { CorporateImage } from './admin/corporateimage/entities/corporateimage.entity';
import { Contact } from './admin/contact/entities/contacts.entity';

import { MercadoPagoModule } from './mercado-pago/mercado-pago.module';

import { SmartwatchLinkEntity } from './client/smartwatch/smartwatch-link.entity';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // Hacer las variables de entorno disponibles globalmente
    }),
    /*TypeOrmModule.forRootAsync({
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
          AppointmentEntity, UserVehicleViewEntity, VehicleEntity, AppointmentServiceEntity,
          AppointmentServicesViewEntity, RepairEntity, AppointmentCancellationEntity,
          CancelledAppointmentsViewEntity, LogEntity, ClientEntity, UserViewEntity,
          AuthorizedPersonnelEntity, AppointmentWaitingViewEntity, AppointmentRejectionEntity, QuestionSecretEntity,
          CorporateImage, Contact, SmartwatchLinkEntity, 
        ],
        synchronize: false,  // No sincronizar automáticamente las tablas en producción
      }),
    }),*/
    AdminModule,
    ClientModule,
    EmployModule,
    PublicModule,
    MercadoPagoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    console.log('Modulo app en uso')
  }
}
