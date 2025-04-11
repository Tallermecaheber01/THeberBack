import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployController } from './employ.controller';

//Servicios
import { AppointmentService } from './appointment/appointment.service';
import { RepairService } from './repair/repair.service';
import { LoggerService } from 'src/services/logger/logger.service';

//Entidades que son las tablas en la base de datos
import { AppointmentEntity } from './appointment/entities/appointment.entity';
import { AppointmentServiceEntity } from './appointment/entities/appointment-services';
import { AppointmentServicesViewEntity } from './entities-view/appointment_services_view';
import { UserVehicleViewEntity } from './entities-view/user-vehicle.view.entity';
import { ServiceEntity } from 'src/admin/service/entities/service.entity';
import { RepairEntity } from './repair/entities/repair.entity';
import { AppointmentCancellationEntity } from './appointment/entities/appointment-cancellation-entity';
import { CancelledAppointmentsViewEntity } from './entities-view/appointments_cancelled_view';
import { AuthorizedPersonnelEntity } from 'src/public/recover-password/entity/authorized-personnel-entity';
import { ClientEntity } from 'src/public/recover-password/entity/client-entity';
import { AppointmentWaitingViewEntity } from './entities-view/appointment_waiting_view';
import { AppointmentRejectionEntity } from './appointment/entities/appointment-rejection-entity';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VehicleEntity } from 'src/client/vehicles/entities/vehicle.entity';
import { QuestionSecretEntity } from 'src/public/register/entity/question-secret.entity';
import { Contact } from 'src/admin/contact/entities/contacts.entity';
import { JwtModule } from '@nestjs/jwt';
import { LogEntity } from 'src/log/entity/log.entity';

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
        username: configService.get<string>('DB_USERNAME_EMPLOY'),
        password: configService.get<string>('DB_PASSWORD_EMPLOY'),
        database: configService.get<string>('DB_NAME'),
        entities: [AppointmentEntity, UserVehicleViewEntity, ServiceEntity,
          AppointmentServiceEntity, AppointmentServicesViewEntity, RepairEntity, AppointmentCancellationEntity,
          CancelledAppointmentsViewEntity, AuthorizedPersonnelEntity, ClientEntity, AppointmentWaitingViewEntity,
          AppointmentRejectionEntity, VehicleEntity, QuestionSecretEntity, Contact,LogEntity
        ],
        synchronize: false,
      }),
      inject: [ConfigService]
    }),
    TypeOrmModule.forFeature([
      AppointmentEntity, UserVehicleViewEntity, ServiceEntity,
      AppointmentServiceEntity, AppointmentServicesViewEntity, RepairEntity, AppointmentCancellationEntity,
      CancelledAppointmentsViewEntity, AuthorizedPersonnelEntity, ClientEntity, AppointmentWaitingViewEntity,
      AppointmentRejectionEntity, VehicleEntity, QuestionSecretEntity, Contact,LogEntity
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { /*expiresIn: '1h'*/ },
    })
  ],
  controllers: [EmployController],
  providers: [AppointmentService, RepairService, LoggerService],
  exports: [AppointmentService]
})
export class EmployModule implements OnModuleInit {
  onModuleInit() {
    console.log('Modulo employ en uso')
  }
}
