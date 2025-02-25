import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployController } from './employ.controller';
import { AppointmentService } from './appointment/appointment.service';

import { AppointmentEntity } from './appointment/entities/appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentEntity])],
  controllers: [EmployController],
  providers: [AppointmentService],
  exports:[AppointmentService]
})
export class EmployModule {}
