import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AppointmentEntity } from './entities/appointment.entity';
import { AppointmentServiceEntity } from './entities/appointment-services';
import { AppointmentServicesViewEntity } from '../entities-view/appointment_services_view';
import { CancelledAppointmentsViewEntity } from '../entities-view/appointments_cancelled_view';
import { UserVehicleViewEntity } from '../entities-view/user-vehicle.view.entity';
import { User } from 'src/users/entity/user.entity';
import { ServiceEntity } from 'src/admin/service/entities/service.entity';
import { AuthorizedPersonnelEntity } from 'src/public/recover-password/entity/authorized-personnel-entity';
import { ClientEntity } from 'src/public/register/entity/client-entity';

import { CreateAppointmentServiceDto } from './dto/create-appointment-service.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentService {
    constructor(
        @InjectRepository(AppointmentEntity)
        private readonly appointmentRepository: Repository<AppointmentEntity>,

        @InjectRepository(AppointmentServiceEntity)
        private readonly appointmentServiceReporitory: Repository<AppointmentServiceEntity>,

        @InjectRepository(AppointmentServicesViewEntity)
        private readonly appointmentServicesViewRepository: Repository<AppointmentServicesViewEntity>,

        /*@InjectRepository(User)
        private readonly userRepository: Repository<User>,*/
        @InjectRepository(ClientEntity)
        private readonly clientRepository: Repository<ClientEntity>,


        @InjectRepository(AuthorizedPersonnelEntity)
        private readonly employRepository: Repository<AuthorizedPersonnelEntity>,

        @InjectRepository(UserVehicleViewEntity)
        private readonly userVehicleRepository: Repository<UserVehicleViewEntity>,

        @InjectRepository(ServiceEntity)
        private readonly serviceRepository: Repository<ServiceEntity>,

        @InjectRepository(CancelledAppointmentsViewEntity)
        private readonly cancelledAppointmentsRepository: Repository<CancelledAppointmentsViewEntity>
    ) { }

    //Metodo para asignar una nueva cita
    async createNewAppointmentWithServices(appointmentData: CreateAppointmentDto, servicesData: CreateAppointmentServiceDto[]): Promise<any> {
        console.log('📩 Datos recibidos para la cita:', appointmentData);
        // Definir explícitamente las columnas en una constante
        const appointmentValues = {
            nombreCliente: appointmentData.nombreCliente,
            nombreEmpleado: appointmentData.nombreEmpleado,
            fecha: appointmentData.fecha,
            hora: appointmentData.hora,
            costoExtra: appointmentData.costoExtra ?? null,  // Si no viene, asigna null
            total: appointmentData.total,
            marca: appointmentData.marca,
            modelo: appointmentData.modelo,
            estado: 'Asignada'  // Estado inicial cuando el negocio asigna una cita
        };

        const newAppointment = this.appointmentRepository.create(appointmentValues);
        console.log('📌 Entidad antes de guardar:', newAppointment);

        const savedAppointment = await this.appointmentRepository.save(newAppointment);
        console.log('✅ Cita guardada:', savedAppointment);

        if (!savedAppointment.id) {
            throw new Error("❌ No se pudo guardar la cita correctamente");
        }
        // Crear los servicios y asociarlos a la cita
        const servicesToCreate = (servicesData || []).map((service) => ({
            ...service,
            idCita: savedAppointment,  // Aquí asignamos la entidad completa de la cita, no solo el ID
        }));


        // Guardar los servicios asociados
        const savedServices = await this.appointmentServiceReporitory.save(servicesToCreate);
        console.log(savedAppointment);
        return {

            appointment: savedAppointment,
            services: savedServices
        };
    }

    async getAppointmentsWithServices(idData: number): Promise<any> {
        // Buscar el empleado por ID y asegurarse de que tiene el rol 'empleado'
        const employ = await this.employRepository.findOne({
            where: { id: idData}
        });

        // Si no encontramos el empleado, lanzar un error
        if (!employ) {
            throw new Error("Empleado no encontrado");
        }

        // Obtener las citas filtradas por el ID del empleado
        const appointments = await this.appointmentServicesViewRepository.find({
            where: { empleado_id: employ.id } // Filtramos por el ID en vez del nombre completo
        });

        // Agrupar las citas por appointment_id
        const groupedAppointments = appointments.reduce((acc, curr) => {
            if (!acc[curr.appointment_id]) {
                acc[curr.appointment_id] = {
                    appointment_id: curr.appointment_id,
                    cliente_id: curr.cliente_id, // Agregamos el ID del cliente
                    nombreCliente: curr.nombreCliente,
                    empleado_id: curr.empleado_id, // ID del empleado
                    nombreEmpleado: curr.nombreEmpleado,
                    fecha: curr.fecha,
                    hora: curr.hora,
                    total: curr.total,
                    costoExtra: curr.costoExtra,
                    marca: curr.marca,
                    modelo: curr.modelo,
                    estado: curr.estado,
                    services: [],
                };
            }

            // Añadir el servicio a la lista dentro de la cita
            acc[curr.appointment_id].services.push({
                servicio: curr.servicio,
                costo: curr.costo,
            });

            return acc;
        }, {});

        // Convertir el objeto a un array de citas y devolverlo
        return Object.values(groupedAppointments);
    }



    //Método para obtener los usuarios con el rol 'client'
    async getAllUsersWithVehicles(): Promise<
        {
            user_id: number;
            user_nombre: string;
            vehicles: {
                vehicle_marca: string;
                modelos: {
                    vehicle_id: number;
                    vehicle_modelo: string;
                    vehicle_año: number;
                    vehicle_placa: string;
                }[];
            }[];
        }[]
    > {
        // Obtener todos los usuarios con rol 'client'
        const users = await this.clientRepository.find({
            select: ['id', 'nombre']
        });

        // Obtener todos los vehículos de esos usuarios
        const usersWithVehicles = await Promise.all(users.map(async (user) => {
            const vehicles = await this.userVehicleRepository.find({
                where: { idCliente: user.id }
            });

            // Agrupar vehículos por marca
            const vehiclesGroupedByMarca: Record<string, {
                vehicle_marca: string;
                modelos: {
                    vehicle_id: number;
                    vehicle_modelo: string;
                    vehicle_año: number;
                    vehicle_placa: string;
                }[];
            }> = {};

            vehicles.forEach(vehicle => {
                if (!vehiclesGroupedByMarca[vehicle.marca]) {
                    vehiclesGroupedByMarca[vehicle.marca] = {
                        vehicle_marca: vehicle.marca,
                        modelos: []
                    };
                }
                vehiclesGroupedByMarca[vehicle.marca].modelos.push({
                    vehicle_id: vehicle.idVehiculo,
                    vehicle_modelo: vehicle.modelo,
                    vehicle_año: vehicle.año,
                    vehicle_placa: vehicle.placa
                });
            });

            return {
                user_id: user.id,
                user_nombre: user.nombre,
                vehicles: Object.values(vehiclesGroupedByMarca)
            };
        }));

        return usersWithVehicles;
    }

    //Método para obtener usuarios con el rol 'employ'
    async getAllEmployees() {
        // Obtener todos los usuarios con rol 'employ'
        const employees = await this.employRepository.find({
            where: { rol: 'empleado' },
            select: ['id', 'nombre']
        });
        return employees;
    }

    async getAllServices() {
        const services = await this.serviceRepository.find({
            select: ['id', 'nombre']
        });
        return services;
    }

    async getVehicleByUserAndModel(userId: number, selectedMarca: string, selectedModelo: string) {
        // Realizar la consulta para obtener el vehículo basado en el ID del usuario, marca y modelo
        const vehicle = await this.userVehicleRepository.findOne({
            where: {
                idCliente: userId,  // Filtrar por ID de usuario
                marca: selectedMarca,  // Filtrar por la marca del vehículo
                modelo: selectedModelo,  // Filtrar por el modelo del vehículo
            },
            select: ['idVehiculo', 'marca', 'modelo', 'año', 'placa'], // Seleccionar los campos que necesitas
        });

        // Verificar si no se encontró el vehículo
        if (!vehicle) {
            console.log("No se encontró un vehículo con los criterios proporcionados.");
            return null;
        }

        console.log("Vehículo encontrado:", vehicle);
        return vehicle;
    }

    // Método para buscar una cita por ID
    async getAppointmentById(appointmentId: number): Promise<any> {
        // Buscar la cita por el ID de la cita
        const appointment = await this.appointmentServicesViewRepository.findOne({
            where: { appointment_id: appointmentId }
        });

        if (!appointment) {
            throw new Error(`❌ Cita con ID ${appointmentId} no encontrada.`);
        }

        // Agrupar los servicios asociados a esa cita
        const groupedAppointment = {
            appointment_id: appointment.appointment_id,
            nombreCliente: appointment.nombreCliente,
            nombreEmpleado: appointment.nombreEmpleado,
            fecha: appointment.fecha,
            hora: appointment.hora,
            total: appointment.total,
            costoExtra: appointment.costoExtra,
            marca: appointment.marca,
            modelo: appointment.modelo,
            estado: appointment.estado,
            services: []
        };

        // Buscar los servicios asociados a la cita
        const services = await this.appointmentServicesViewRepository.find({
            where: { appointment_id: appointmentId },
            select: ['servicio', 'costo']
        });

        // Agregar los servicios a la cita
        services.forEach(service => {
            groupedAppointment.services.push({
                servicio: service.servicio,
                costo: service.costo
            });
        });

        return groupedAppointment;
    }

    async getAppointmentsInWaiting(): Promise<any[]> {
        // Buscar todas las citas con el estado "en espera"
        const appointments = await this.appointmentServicesViewRepository.find({
            where: { estado: 'en espera' } // Filtrar solo las citas en espera
        });

        // Si no se encuentran citas, lanzamos un error
        if (!appointments || appointments.length === 0) {
            throw new Error('❌ No se encontraron citas con estado "en espera".');
        }

        // Agrupar las citas por appointment_id
        const groupedAppointments = appointments.reduce((acc, curr) => {
            // Si la cita aún no existe en el acumulador, la inicializamos
            if (!acc[curr.appointment_id]) {
                acc[curr.appointment_id] = {
                    appointment_id: curr.appointment_id,
                    nombreCliente: curr.nombreCliente,
                    nombreEmpleado: curr.nombreEmpleado,
                    fecha: curr.fecha,
                    hora: curr.hora,
                    total: curr.total,
                    costoExtra: curr.costoExtra,
                    marca: curr.marca,
                    modelo: curr.modelo,
                    estado: curr.estado,
                    services: [],
                };
            }

            // Agregar los servicios asociados a la cita
            acc[curr.appointment_id].services.push({
                servicio: curr.servicio,
                costo: curr.costo,
            });

            return acc;
        }, {});

        // Convertir el objeto acumulado en un arreglo de citas y devolverlo
        return Object.values(groupedAppointments);
    }

    async updateAppointmentStatusAndDetails(
        appointmentId: number,
        updateData: UpdateAppointmentDto
    ): Promise<AppointmentEntity> {
        // Buscar la cita con el estado "en espera" usando el ID
        const appointment = await this.appointmentRepository.findOne({
            where: { id: appointmentId, estado: 'en espera' },
        });

        // Si no se encuentra la cita con el estado "en espera", lanzamos un error
        if (!appointment) {
            throw new Error('❌ No se encontró la cita con estado "en espera".');
        }

        // Actualizamos solo los campos que vienen en el DTO (total, nombreEmpleado, estado)
        if (updateData.total !== undefined) {
            appointment.total = updateData.total;
        }

        if (updateData.nombreEmpleado !== undefined) {
            appointment.nombreEmpleado = updateData.nombreEmpleado;
        }

        if (updateData.estado) {
            appointment.estado = updateData.estado; // Asegúrate de validar que el estado sea "Aceptada" o "Rechazada"
        }

        // Guardar los cambios en la base de datos
        await this.appointmentRepository.save(appointment);

        // Devolver la cita actualizada
        return appointment;
    }

    async getCancelledAppointments(): Promise<any[]> {
        // Obtener todas las citas canceladas sin filtrar por estado
        const cancelledAppointments = await this.cancelledAppointmentsRepository.find();

        // Si no se encuentran citas, lanzamos un error
        if (!cancelledAppointments || cancelledAppointments.length === 0) {
            throw new Error('❌ No se encontraron citas con estado "Cancelada".');
        }

        // Agrupar las citas canceladas por cita_id
        const groupedAppointments = cancelledAppointments.reduce((acc, curr) => {
            // Si la cita aún no existe en el acumulador, la inicializamos
            if (!acc[curr.cita_id]) {
                acc[curr.cita_id] = {
                    cita_id: curr.cita_id,
                    nombreCliente: curr.nombreCliente,
                    nombreEmpleado: curr.nombreEmpleado,
                    fecha: curr.fecha,
                    hora: curr.hora,
                    marca: curr.marca,
                    modelo: curr.modelo,
                    total: curr.total,
                    estadoCita: curr.estadoCita,
                    cancelaciones: [],  // Se inicia vacío
                    services: [],
                };
            }

            // Si aún no se ha agregado una cancelación, agregamos solo la primera
            if (acc[curr.cita_id].cancelaciones.length === 0) {
                // Determinar quién canceló y agregar el nombre correspondiente
                const canceladoPor = curr.canceladoPor === 'Cliente'
                    ? `Cliente: ${curr.nombreCliente}`
                    : `Empleado: ${curr.nombreEmpleado}`;

                acc[curr.cita_id].cancelaciones.push({
                    canceladoPor,
                    motivo: curr.motivo,
                    canceladoEn: curr.canceladoEn,
                });
            }

            // Agregar los servicios asociados a la cita
            acc[curr.cita_id].services.push({
                servicio_id: curr.servicio_id,
                servicio: curr.servicio,
                costoServicio: curr.costoServicio,
            });

            return acc;
        }, {});

        // Convertir el objeto acumulado en un arreglo de citas y devolverlo
        return Object.values(groupedAppointments);
    }

}
