import { Body, Controller, Get, NotFoundException, Param, Patch, Post, ValidationPipe, ParseIntPipe, UseGuards, Request } from '@nestjs/common';

import { AppointmentService } from './appointment/appointment.service';
import { RepairService } from './repair/repair.service'; //se importa el servicio de reparacion para que pueda ser usado en el controlador

import { UpdateAppointmentDto } from './appointment/dto/update-appointment.dto';
import { CreateAppointmentDto } from './appointment/dto/create-appointment.dto';
import { CreateAppointmentServiceDto } from './appointment/dto/create-appointment-service.dto';
import { CreateRepairDto } from './repair/dto/create-repair.dto';  //Al igual que se vuelve a importar el dto
import { UpdateRepairDto } from './repair/dto/update-repair.dto';
import { RepairEntity } from './repair/entities/repair.entity';
import { AppointmentEntity } from './appointment/entities/appointment.entity';
import { CreateAppointmentRejectionDto } from './appointment/dto/create-appointment-rejection.dto';
import { AppointmentStatus } from './appointment/entities/appointment.entity';
import { Roles } from 'src/role/role.decorator';
import { AuthGuard } from 'src/role/guards/authguard/authguard.guard';
import { RoleGuard } from 'src/role/guards/role/role.guard';
import { LoggerService } from 'src/services/logger/logger.service';
import { LogEntity } from 'src/log/entity/log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';



@Controller('employ')
export class EmployController {
    constructor(
        private readonly appointmentService: AppointmentService,
        private readonly repairService: RepairService, //se crea el objeto del servicio
        private readonly logger: LoggerService,

        @InjectRepository(LogEntity)
        private readonly logRepository: Repository<LogEntity>,
    ) { }


    @Post('new-appointment')
    @Roles('administrador', 'empleado')
    @UseGuards(AuthGuard, RoleGuard)
    async createAppointment(
        @Body() data: { appointment: CreateAppointmentDto, services: CreateAppointmentServiceDto[] },
        @Request() req: any
    ): Promise<any> {
        const { appointment, services } = data;
        const userEmail = req.user.email;
        const userIp = req.ip;

        // Llamamos al servicio para crear la cita y los servicios
        const result = await this.appointmentService.createNewAppointmentWithServices(appointment, services);
        // Registrar Log en la base de datos
        const log = this.logRepository.create({
            usuario: userEmail,
            accion: 'INSERT',  // Acción que describe la creación
            tabla_afectada: 'appointments',
            descripcion: `Creación de una nueva cita con ID ${result.id}`,
            ip_usuario: userIp,
        });

        await this.logRepository.save(log);  // Guardar log en la base de datos

        // Devolvemos la cita y los servicios guardados
        return result;
    }


    @Get('with-vehicles')
    async getAllUsersWithVehicles() {
        return this.appointmentService.getAllUsersWithVehicles();
    }

    // Endpoint para obtener citas con servicios
    @Get('appointments/full/:id')
    async getAppointmentsWithServices(@Param('id') idData: number) {
        const appointments = await this.appointmentService.getAppointmentsWithServices(idData);
        return appointments;
    }


    @Get('employees')
    async getAllEmployees() {
        return this.appointmentService.getAllEmployees()
    }

    @Get('clients/:id')
    async getClientById(@Param('id', ParseIntPipe) id: number) {
        return this.appointmentService.getClientById(id);
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

    // Nuevo endpoint para obtener una cita por ID
    @Get('appointment/:id')
    async getAppointmentById(@Param('id') appointmentId: number) {
        return this.appointmentService.getAppointmentById(appointmentId);
    }

    // Nuevo endpoint para obtener todas las citas con estado "en espera"
    @Get('appointments/waiting')
    async getAppointmentsInWaiting() {
        const appointmentsInWaiting = await this.appointmentService.getAppointmentsInWaiting();
        return appointmentsInWaiting;
    }

    // Actualizar cita (total, nombreEmpleado, estado) solo para citas con estado "en espera"
    @Patch('appointment/update/:id')
    @Roles('administrador', 'empleado')
    @UseGuards(AuthGuard, RoleGuard)
    async updateAppointmentStatusAndDetails(
        @Param('id') id: number, // Obtenemos el id de la cita desde la URL
        @Body() updateAppointmentDto: UpdateAppointmentDto, // Recibimos los datos de actualización
        @Request() req: any
    ): Promise<AppointmentEntity> {

        const userEmail = req.user.email;
        const userIp = req.ip;
        // Se asume que el servicio gestionará si no se encuentra la cita o si el estado no es "en espera"
        const updatedAppointment = await this.appointmentService.updateAppointmentStatusAndDetails(
            id,
            updateAppointmentDto
        );

        // Si no se encuentra la cita, NestJS lanzará automáticamente una excepción
        if (!updatedAppointment) {
            throw new NotFoundException(`Cita con id ${id} no encontrada o no está en estado "en espera"`);
        }

        // Registrar Log en la base de datos
        const log = this.logRepository.create({
            usuario: userEmail,
            accion: 'UPDATE',
            tabla_afectada: 'appointments',
            descripcion: `Actualización de cita con ID ${id}. Nuevo estado: ${updateAppointmentDto.estado}`,
            ip_usuario: userIp,
        });

        await this.logRepository.save(log);  // Guardar log en la base de datos

        return updatedAppointment;
    }

    @Patch('appointment/update-confirmed/:id')
    async updateConfirmedAppointment(
        @Param('id') id: number,
        @Body() updateData: UpdateAppointmentDto
    ) {
        return this.appointmentService.updateAppointmentIfConfirmed(id, updateData);
    }


    // Endpoint para obtener todas las citas con estado "Cancelada"
    @Get('appointments/canceled')
    getCancelledAppointments() {
        // Llamada al servicio para obtener citas canceladas
        return this.appointmentService.getCancelledAppointments();
    }

    @Post('appointment/reject')
    async rejectAppointment(
        @Body() rejectionData: CreateAppointmentRejectionDto
    ) {
        // Llamamos al servicio para procesar el rechazo
        const result = await this.appointmentService.rejectAppointment(rejectionData);

        return {
            message: '✅ Cita rechazada con éxito',
            rejection: result
        };
    }





    /**Aqui se utiliza la funcion del servicio de repair, de igual
     * forma de usa el dto, para especificar los datos que se enviaran
     */
    @Post('repairs')
    @Roles('administrador', 'empleado')
    @UseGuards(AuthGuard, RoleGuard)
    async createRepair(
        @Body() repairData: CreateRepairDto,
        @Request() req: any
    ): Promise<RepairEntity> {

        const userEmail = req.user.email;
        const userIp = req.ip;
        // 1. Crear la reparación
        const repair = await this.repairService.createNewRepair(repairData);
        const updateData: UpdateAppointmentDto = { estado: AppointmentStatus.COMPLETED };

        await this.appointmentService.updateAppointmentIfConfirmed(
            repairData.idCita,
            updateData
        );

        // Registrar Log en la base de datos
        const log = this.logRepository.create({
            usuario: userEmail,
            accion: 'INSERT',
            tabla_afectada: 'repairs',
            descripcion: `Creación de una nueva reparación para la cita con ID ${repairData.idCita}`,
            ip_usuario: userIp,
        });

        await this.logRepository.save(log);  // Guardar log en la base de datos


        return repair;
    }



    @Get('repairs')
    async getAllRepairs(): Promise<RepairEntity[]> {
        return this.repairService.getAllRepairs();
    }

    @Get('repairs/:id')
    async getRepairById(@Param('id') id: string): Promise<RepairEntity> {
        return this.repairService.getRepairById(id);
    }

    @Patch('repairs/:id')
    @Roles('administrador', 'empleado')
    @UseGuards(AuthGuard, RoleGuard)
    async updateRepair(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe()) updateRepairDto: UpdateRepairDto,
        @Request() req: any
    ): Promise<RepairEntity> {
        const userEmail = req.user.email;
        const userIp = req.ip;

        // Registrar Log en la base de datos
        const log = this.logRepository.create({
            usuario: userEmail,
            accion: 'UPDATE',
            tabla_afectada: 'repairs',
            descripcion: `Modificacion de una reparacion`,
            ip_usuario: userIp,
        });

        await this.logRepository.save(log);  // Guardar log en la base de datos
        return this.repairService.updateRepair(id, updateRepairDto);
    }

}
