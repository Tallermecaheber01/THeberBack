import { AppointmentRejectionEntity } from './../employ/appointment/entities/appointment-rejection-entity';
import { AppointmentServiceEntity } from '../employ/appointment/entities/appointment-services-entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, OnModuleInit } from '@nestjs/common';
import { PublicController } from './public.controller';
import { RegisterService } from './register/register.service';
import { LoginService } from './login/login.service';
import { RecoverPasswordService } from './recover-password/recover-password.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientEntity } from './recover-password/entity/client-entity';
import { AppointmentEntity } from 'src/employ/appointment/entities/appointment.entity';
import { AuthorizedPersonnelEntity } from './recover-password/entity/authorized-personnel-entity';
import { UserViewEntity } from './register/view/vw-users-entity';
import { JwtModule } from '@nestjs/jwt';
import { InformationService } from './information/information.service';
import { QuestionSecretEntity } from './register/entity/question-secret.entity';
import { UnlockService } from './unlock/unlock.service';
import { ScheduleModule } from '@nestjs/schedule';
import { AppointmentCancellationEntity } from 'src/employ/appointment/entities/appointment-cancellation-entity';
import { VehicleEntity } from 'src/client/vehicles/entities/vehicle.entity';
import { Contact } from 'src/admin/contact/entities/contacts.entity';
import { ServiceEntity } from 'src/admin/service/entities/service.entity';
import { LoggerService } from 'src/services/logger/logger.service';
import {SmartwatchLinkEntity} from 'src/client/smartwatch/smartwatch-link.entity';
import { AppointmentReminderEntity } from 'src/employ/appointment/entities/appointment-reminder.entity'
import { PerfilClientesEntity } from 'src/client/view/perfil_clientes.entity';

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
        username: configService.get<string>('DB_USERNAME_PUBLIC'),
        password: configService.get<string>('DB_PASSWORD_PUBLIC'),
        database: configService.get<string>('DB_NAME'),
        entities: [ClientEntity, UserViewEntity, AuthorizedPersonnelEntity, QuestionSecretEntity, AppointmentEntity,
          AppointmentServiceEntity, AppointmentCancellationEntity, AppointmentRejectionEntity, VehicleEntity, Contact, ServiceEntity,SmartwatchLinkEntity,
          AppointmentReminderEntity,PerfilClientesEntity
        ],
        synchronize: false,
      }),
      inject: [ConfigService]
    }),
    TypeOrmModule.forFeature([ClientEntity, UserViewEntity, AuthorizedPersonnelEntity, QuestionSecretEntity, AppointmentEntity,
      AppointmentServiceEntity, AppointmentCancellationEntity, AppointmentRejectionEntity, VehicleEntity, Contact, ServiceEntity,SmartwatchLinkEntity,
      AppointmentReminderEntity,PerfilClientesEntity
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { /*expiresIn: '1h'*/ }, 
    })
  ],
  controllers: [PublicController],
  providers: [RegisterService, LoginService, RecoverPasswordService, InformationService, UnlockService, LoggerService]
})
export class PublicModule implements OnModuleInit{
  onModuleInit() {
    console.log('Modulo public en uso')
  }
}
