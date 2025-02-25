import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentEntity } from './entities/appointment.entity';

@Injectable()
export class AppointmentService {
    constructor(
        @InjectRepository(AppointmentEntity)
        private readonly appointmentRepository: Repository<AppointmentEntity>,
    ){}

    //Metodo para asignar una nueva cita
    async createNewAppointment(appointmentData: CreateAppointmentDto):Promise<AppointmentEntity> {
        const newAppointment = this.appointmentRepository.create(appointmentData);
        return await this.appointmentRepository.save(newAppointment);
    }

    //Metodo para obtener todas las citas
    async getAllAppointments(): Promise<AppointmentEntity[]> {
        return this.appointmentRepository.find();
    }
}
