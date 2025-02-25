import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';

import { AppointmentService } from './appointment/appointment.service';

import { CreateAppointmentDto } from './appointment/dto/create-appointment.dto';

import { UpdateAppointmentDto } from './appointment/dto/update-appointment.dto';

import { AppointmentEntity } from './appointment/entities/appointment.entity';

@Controller('employ')
export class EmployController {
    constructor(private readonly appointmentService: AppointmentService) { }

    @Post('new-appointment')
    async createAppointment(
        @Body(new ValidationPipe()) appointmentData: CreateAppointmentDto): Promise<AppointmentEntity> {
        return this.appointmentService.createNewAppointment(appointmentData);
    }

    @Get('all-appointmens')
    async getAllAppointments(): Promise<AppointmentEntity[]>{
        return this.appointmentService.getAllAppointments();
    }
}
