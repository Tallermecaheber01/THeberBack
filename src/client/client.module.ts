import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientController } from './client.controller';

//Services
import { VehiclesService } from './vehicles/vehicles.service';
import { FeedbackService } from './feedback/feedback.service';

//Entities
import { VehicleEntity } from './vehicles/entities/vehicle.entity';
import { ClientEntity } from 'src/public/recover-password/entity/client-entity';
import { AppointmentEntity } from 'src/employ/appointment/entities/appointment.entity';
import { AuthorizedPersonnelEntity } from 'src/public/recover-password/entity/authorized-personnel-entity';
import { QuestionSecretEntity } from 'src/public/register/entity/question-secret.entity';
import { AppointmentServiceEntity } from 'src/employ/appointment/entities/appointment-services-entity';
import { AppointmentCancellationEntity } from 'src/employ/appointment/entities/appointment-cancellation-entity';
import { AppointmentRejectionEntity } from 'src/employ/appointment/entities/appointment-rejection-entity';
import { Contact } from 'src/admin/contact/entities/contacts.entity';
import { ServiceEntity } from 'src/admin/service/entities/service.entity';
import { UserViewEntity } from 'src/public/register/view/vw-users-entity';
import { VehicleTypeEntity } from 'src/admin/service/entities/vehicle.entity';
import { BrandEntity } from 'src/admin/service/entities/brand.entity';
import { JwtModule } from '@nestjs/jwt';
import { LoggerService } from 'src/services/logger/logger.service';
import { AppointmentClientService } from './appointment-client/appointment-client.service';
import { RepairPaymentEntity } from './repair-payment/entity/repair.entity';
import { AppointmentClient } from './appointment-client/entity/appointment-client.entity';
import { AppointmentServiceClient } from './appointment-client/entity/appointment-client-service.entity';
import { AppointmentCancellation } from './appointment-client/entity/appointment-cancellation.entity';
//Views
import { VwAppointmentDetails } from './appointment-client/view/vw-appointment-details.entity';
import { RepairPaymentService } from './repair-payment/repair-payment.service';
import { HistoryRepairsService } from './history-repairs/history-repairs.service';
import { VistaRepairsEmpleados } from './history-repairs/view/vista_repairs_empleados';
import { SmartwatchLinkEntity } from './smartwatch/smartwatch-link.entity';
import {NotificationService} from './smartwatch/notification.service';
import { AppointmentReminderEntity } from 'src/employ/appointment/entities/appointment-reminder.entity'
import { FeedbackEntity } from './feedback/entities/feedback.entity';

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
        username: configService.get<string>('DB_USERNAME_CLIENT'),
        password: configService.get<string>('DB_PASSWORD_CLIENT'),
        database: configService.get<string>('DB_NAME'),
        entities: [VehicleEntity, ClientEntity, AppointmentEntity, AuthorizedPersonnelEntity, QuestionSecretEntity, AppointmentServiceEntity,
          AppointmentCancellationEntity, AppointmentRejectionEntity, Contact, UserViewEntity,
          VehicleTypeEntity, BrandEntity,ServiceEntity, VwAppointmentDetails,RepairPaymentEntity,VistaRepairsEmpleados,AppointmentClient,AppointmentServiceClient,AppointmentCancellation,
          SmartwatchLinkEntity, AppointmentReminderEntity, FeedbackEntity
        ],
        synchronize: false,
      }),
      inject: [ConfigService]
    }),
    TypeOrmModule.forFeature([VehicleEntity, ClientEntity, AppointmentEntity, AuthorizedPersonnelEntity, QuestionSecretEntity, AppointmentServiceEntity,
      AppointmentCancellationEntity, AppointmentRejectionEntity, Contact, UserViewEntity, VehicleTypeEntity,RepairPaymentEntity,
      BrandEntity,VwAppointmentDetails,VistaRepairsEmpleados,AppointmentClient,AppointmentServiceClient,AppointmentCancellation,
       SmartwatchLinkEntity, BrandEntity, AppointmentReminderEntity,FeedbackEntity,
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    })
  ],
  controllers: [ClientController],
  providers: [ VehiclesService,LoggerService, AppointmentClientService, RepairPaymentService, HistoryRepairsService,
    NotificationService, FeedbackService,
  ],
  exports: [FeedbackService]
})
export class ClientModule implements OnModuleInit {
  onModuleInit() {
    console.log('Modulo client en uso')
  }
}