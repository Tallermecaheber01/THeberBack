import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { ServiceService } from './service/service.service';

import { ServiceEntity } from './service/entities/service.entity';
import { BrandEntity } from './service/entities/brand.entity';
import { VehicleTypeEntity } from './service/entities/vehicle.entity';
import { ContactService } from './contact/contact.service';
import { CorporateimageService } from './corporateimage/corporateimage.service';
import { CorporateImage } from './corporateimage/entities/corporateimage.entity';
import { Contact } from './contact/entities/contacts.entity';
import { LogEntity } from 'src/log/entity/log.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppointmentEntity } from 'src/employ/appointment/entities/appointment.entity';
import { AppointmentCancellationEntity } from 'src/employ/appointment/entities/appointment-cancellation-entity';
import { AppointmentRejectionEntity } from 'src/employ/appointment/entities/appointment-rejection-entity';
import { AppointmentWaitingViewEntity } from 'src/employ/entities-view/appointment_waiting_view';
import { AppointmentService } from 'src/employ/appointment/appointment.service';
import { AppointmentServiceEntity } from 'src/employ/appointment/entities/appointment-services';
import { AppointmentServicesViewEntity } from 'src/employ/entities-view/appointment_services_view';
import { AuthorizedPersonnelEntity } from 'src/public/recover-password/entity/authorized-personnel-entity';
import { ClientEntity } from 'src/public/recover-password/entity/client-entity';
import { QuestionSecretEntity } from 'src/public/register/entity/question-secret.entity';
import { VehicleEntity } from 'src/client/vehicles/entities/vehicle.entity';
import { UserViewEntity } from 'src/public/register/view/vw-users-entity';
import { UserVehicleViewEntity } from 'src/employ/entities-view/user-vehicle.view.entity';
import { RepairEntity } from 'src/employ/repair/entities/repair.entity';
import { CancelledAppointmentsViewEntity } from 'src/employ/entities-view/appointments_cancelled_view';
import { Police } from './policies/entities/policies.entity';
import { PoliceService } from './policies/policies.service';
import { JwtModule } from '@nestjs/jwt';
import { LoggerService } from 'src/services/logger/logger.service';


@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ envFilePath: `.env`, isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME_ADMIN'),
        password: configService.get<string>('DB_PASSWORD_ADMIN'),
        database: configService.get<string>('DB_NAME'),
        entities: [ServiceEntity, BrandEntity, VehicleTypeEntity, CorporateImage, Contact, LogEntity,
          AppointmentWaitingViewEntity, AppointmentEntity, AppointmentCancellationEntity, AppointmentRejectionEntity,
          AppointmentService, AppointmentServiceEntity, AppointmentServicesViewEntity, AuthorizedPersonnelEntity,
          QuestionSecretEntity, ClientEntity, VehicleEntity, UserViewEntity, UserVehicleViewEntity, RepairEntity,
          CancelledAppointmentsViewEntity, Police
        ],
        synchronize: false,
      }),
      inject: [ConfigService]
    }),
    TypeOrmModule.forFeature([ServiceEntity, BrandEntity, VehicleTypeEntity, CorporateImage, Contact, LogEntity,
      AppointmentWaitingViewEntity, AppointmentEntity, AppointmentCancellationEntity, AppointmentRejectionEntity,
      AppointmentService, AppointmentServiceEntity, AppointmentServicesViewEntity, AuthorizedPersonnelEntity,
      QuestionSecretEntity, ClientEntity, VehicleEntity, UserViewEntity, UserVehicleViewEntity, RepairEntity,
      CancelledAppointmentsViewEntity, Police
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { /*expiresIn: '1h'*/ },
    })
  ],
  controllers: [AdminController],
  providers: [ServiceService, ContactService, CorporateimageService, PoliceService,LoggerService],
  exports: [ServiceService, CorporateimageService], // Exporta si se necesita en otros módulos
})
export class AdminModule implements OnModuleInit {
  onModuleInit() {
    console.log('Modulo admin en uso')
  }
}
