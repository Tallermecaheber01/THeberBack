import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

import { AppointmentEntity } from './entities/appointment.entity';
import { AppointmentServiceEntity } from './entities/appointment-services';
import { AppointmentServicesViewEntity } from '../entities-view/appointment_services_view';
import { UserVehicleViewEntity } from '../entities-view/user-vehicle.view.entity';
import { User } from 'src/users/entity/user.entity';
import { ServiceEntity } from 'src/admin/service/entities/service.entity';
import { CreateAppointmentServiceDto } from './dto/create-appointment-service.dto';

@Injectable()
export class AppointmentService {
    constructor(
        @InjectRepository(AppointmentEntity)
        private readonly appointmentRepository: Repository<AppointmentEntity>,

        @InjectRepository(AppointmentServiceEntity)
        private readonly appointmentServiceReporitory: Repository<AppointmentServiceEntity>,

        @InjectRepository(AppointmentServicesViewEntity)
        private readonly appointmentServicesViewRepository: Repository<AppointmentServicesViewEntity>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(UserVehicleViewEntity)
        private readonly userVehicleRepository: Repository<UserVehicleViewEntity>,

        @InjectRepository(ServiceEntity)
        private readonly serviceRepository: Repository<ServiceEntity>
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

    // Función para obtener todas las citas con sus servicios
    async getAppointmentsWithServices(): Promise<any> {
        const appointments = await this.appointmentServicesViewRepository.find();

        // Agrupar por appointment_id
        const groupedAppointments = appointments.reduce((acc, curr) => {
            // Si la cita ya existe en el acumulador, agregamos el servicio
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

            // Añadimos el servicio a la cita
            acc[curr.appointment_id].services.push({
                servicio: curr.servicio,
                costo: curr.costo,
            });

            return acc;
        }, {});

        // Convertir el objeto a un array de citas
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
        const users = await this.userRepository.find({
            where: { rol: 'client' },
            select: ['id', 'nombre']
        });

        // Obtener todos los vehículos de esos usuarios
        const usersWithVehicles = await Promise.all(users.map(async (user) => {
            const vehicles = await this.userVehicleRepository.find({
                where: { user_id: user.id }
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
                if (!vehiclesGroupedByMarca[vehicle.vehicle_marca]) {
                    vehiclesGroupedByMarca[vehicle.vehicle_marca] = {
                        vehicle_marca: vehicle.vehicle_marca,
                        modelos: []
                    };
                }
                vehiclesGroupedByMarca[vehicle.vehicle_marca].modelos.push({
                    vehicle_id: vehicle.vehicle_id,
                    vehicle_modelo: vehicle.vehicle_modelo,
                    vehicle_año: vehicle.vehicle_año,
                    vehicle_placa: vehicle.vehicle_placa
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
        const employees = await this.userRepository.find({
            where: { rol: 'employ' },
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
                user_id: userId,  // Filtrar por ID de usuario
                vehicle_marca: selectedMarca,  // Filtrar por la marca del vehículo
                vehicle_modelo: selectedModelo,  // Filtrar por el modelo del vehículo
            },
            select: ['vehicle_id', 'vehicle_marca', 'vehicle_modelo', 'vehicle_año', 'vehicle_placa'], // Seleccionar los campos que necesitas
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

}
