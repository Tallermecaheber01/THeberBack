import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployController } from './employ.controller';

//Servicios
import { AppointmentService } from './appointment/appointment.service';
import { RepairService } from './repair/repair.service';

//Entidades que son las tablas en la base de datos
import { AppointmentEntity } from './appointment/entities/appointment.entity';
import { AppointmentServiceEntity } from './appointment/entities/appointment-services';
import { AppointmentServicesViewEntity } from './entities-view/appointment_services_view';
import { User } from 'src/users/entity/user.entity';
import { UserVehicleViewEntity } from './entities-view/user-vehicle.view.entity';
import { ServiceEntity } from 'src/admin/service/entities/service.entity';
import { RepairEntity } from './repair/entities/repair.entity';
import { AppointmentCancellationEntity } from './appointment/entities/appointment-cancellation-entity';
import { CancelledAppointmentsViewEntity } from './entities-view/appointments_cancelled_view';
import { AuthorizedPersonnelEntity } from 'src/public/recover-password/entity/authorized-personnel-entity';
import { ClientEntity } from 'src/public/register/entity/client-entity';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentEntity,User,UserVehicleViewEntity,ServiceEntity,
    AppointmentServiceEntity,AppointmentServicesViewEntity,RepairEntity, AppointmentCancellationEntity,
    CancelledAppointmentsViewEntity,AuthorizedPersonnelEntity,ClientEntity
  ])],
  controllers: [EmployController],
  providers: [AppointmentService, RepairService],
  exports:[AppointmentService]
})
export class EmployModule {}
