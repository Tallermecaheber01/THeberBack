import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployController } from './employ.controller';
import { AppointmentService } from './appointment/appointment.service';

import { AppointmentEntity } from './appointment/entities/appointment.entity';
import { AppointmentServiceEntity } from './appointment/entities/appointment-services';
import { AppointmentServicesViewEntity } from './entities-view/appointment_services_view';
import { User } from 'src/users/entity/user.entity';
import { UserVehicleViewEntity } from './entities-view/user-vehicle.view.entity';
import { ServiceEntity } from 'src/admin/service/entities/service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentEntity,User,UserVehicleViewEntity,ServiceEntity,
    AppointmentServiceEntity,AppointmentServicesViewEntity
  ])],
  controllers: [EmployController],
  providers: [AppointmentService],
  exports:[AppointmentService]
})
export class EmployModule {}
