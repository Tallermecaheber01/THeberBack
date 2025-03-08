import { Body, Controller, Get, Param, Post, ValidationPipe } from '@nestjs/common';

import { AppointmentService } from './appointment/appointment.service';

import { CreateAppointmentDto } from './appointment/dto/create-appointment.dto';
import { CreateAppointmentServiceDto } from './appointment/dto/create-appointment-service.dto';


@Controller('employ')
export class EmployController {
    constructor(private readonly appointmentService: AppointmentService) { }

    @Post('new-appointment')
    async createAppointment(
        @Body() data: { appointment: CreateAppointmentDto, services: CreateAppointmentServiceDto[] }
    ): Promise<any> {
        console.log('hola:', data)
        const { appointment, services } = data;

        // Llamamos al servicio para crear la cita y los servicios
        const result = await this.appointmentService.createNewAppointmentWithServices(appointment, services);

        // Devolvemos la cita y los servicios guardados
        return result;
    }


    @Get('with-vehicles')
    async getAllUsersWithVehicles() {
        return this.appointmentService.getAllUsersWithVehicles();
    }

    // Endpoint para obtener citas con servicios
    @Get('with-services')
    async getAppointmentsWithServices() {
        const appointments = await this.appointmentService.getAppointmentsWithServices();
        return appointments;
    }

    @Get('employees')
    async getAllEmployees() {
        return this.appointmentService.getAllEmployees()
    }

    @Get('services')
    async getAllServices() {
        return this.appointmentService.getAllServices();
    }

    // Nuevo endpoint para obtener un vehículo específico basándose en el usuario, marca y modelo
    @Get('vehicle/:userId/:marca/:modelo')
    async getVehicleByUserAndModel(
        @Param('userId') userId: number,
        @Param('marca') marca: string,
        @Param('modelo') modelo: string
    ) {
        return this.appointmentService.getVehicleByUserAndModel(userId, marca, modelo);
    }
}
