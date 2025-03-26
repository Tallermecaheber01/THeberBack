import { Module, OnModuleInit } from '@nestjs/common';
import { ClientController } from './client.controller';
import { InformationService } from './information/information.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesService } from './vehicles/vehicles.service';
import { VehicleEntity } from './vehicles/entities/vehicle.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientEntity } from 'src/public/recover-password/entity/client-entity';
import { AppointmentEntity } from 'src/employ/appointment/entities/appointment.entity';
import { AuthorizedPersonnelEntity } from 'src/public/recover-password/entity/authorized-personnel-entity';
import { QuestionSecretEntity } from 'src/public/register/entity/question-secret.entity';
import { AppointmentServiceEntity } from 'src/employ/appointment/entities/appointment-services';
import { AppointmentCancellationEntity } from 'src/employ/appointment/entities/appointment-cancellation-entity';
import { AppointmentRejectionEntity } from 'src/employ/appointment/entities/appointment-rejection-entity';
import { Contact } from 'src/admin/contact/entities/contacts.entity';
import { ServiceEntity } from 'src/admin/service/entities/service.entity';
import { UserViewEntity } from 'src/public/register/view/vw-users-entity';
import { LogEntity } from 'src/log/entity/log.entity';
import { VehicleTypeEntity } from 'src/admin/service/entities/vehicle.entity';
import { BrandEntity } from 'src/admin/service/entities/brand.entity';

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
        entities: [
          VehicleEntity, ClientEntity, AppointmentEntity, AuthorizedPersonnelEntity, QuestionSecretEntity, AppointmentServiceEntity,
          AppointmentCancellationEntity, AppointmentRejectionEntity, Contact, UserViewEntity,
          LogEntity, VehicleTypeEntity, BrandEntity,ServiceEntity
        ],
        synchronize: false,
      }),
      inject: [ConfigService]
    }),
    TypeOrmModule.forFeature([VehicleEntity, ClientEntity, AppointmentEntity, AuthorizedPersonnelEntity, QuestionSecretEntity, AppointmentServiceEntity,
      AppointmentCancellationEntity, AppointmentRejectionEntity, Contact, UserViewEntity, LogEntity, VehicleTypeEntity,
      BrandEntity
    ])],
  controllers: [ClientController],
  providers: [InformationService, VehiclesService],
  exports: [InformationService]
})
export class ClientModule implements OnModuleInit {
  onModuleInit() {
    console.log('Modulo client en uso')
  }
}
