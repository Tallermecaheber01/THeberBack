import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { In } from 'typeorm';

import { VwAppointmentDetails } from './view/vw-appointment-details.entity';
import { AppointmentClient } from './entity/appointment-client.entity';
import { AppointmentServiceClient } from './entity/appointment-client-service.entity';
import { AppointmentCancellation } from './entity/appointment-cancellation.entity';

import { CreateAppointmentDto } from './dto/create-appointment-client.dto';
import { UpdateAppointmentDto } from './dto/update-appointment-client.dto';
import { CreateCancellationDto } from './dto/create-cancellation.dto';

@Injectable()
export class AppointmentClientService {
    constructor(
        @InjectRepository(VwAppointmentDetails)
        private readonly appointmentViewRepo: Repository<VwAppointmentDetails>,

        @InjectRepository(AppointmentClient)
        private readonly appointmentRepo: Repository<AppointmentClient>,

        @InjectRepository(AppointmentServiceClient)
        private readonly appointmentServiceRepo: Repository<AppointmentServiceClient>,

        @InjectRepository(AppointmentCancellation)
        private readonly appointmentCancelRepo: Repository<AppointmentCancellation>,
    ) { }

    async getAppointmentsByClientId(idCliente: number): Promise<any[]> {
        const rawAppointments = await this.appointmentViewRepo.find({
            where: {
                idCliente,
                estado: In(['Confirmada', 'Asignada', 'Reprogramada']), // <-- nuevo filtro múltiple
            },
        });

        const grouped = new Map<number, any>();

        for (const item of rawAppointments) {
            if (!grouped.has(item.idCita)) {
                grouped.set(item.idCita, {
                    idCita: item.idCita,
                    fecha: item.fecha,
                    hora: item.hora,
                    costoExtra: item.costoExtra,
                    total: item.total,
                    marca: item.marca,
                    modelo: item.modelo,
                    estado: item.estado,
                    idCliente: item.idCliente,
                    nombreCompletoCliente: item.nombreCompletoCliente,
                    correoCliente: item.correoCliente,
                    telefonoCliente: item.telefonoCliente,
                    idPersonal: item.idPersonal,
                    nombreCompletoPersonal: item.nombreCompletoPersonal,
                    correoPersonal: item.correoPersonal,
                    telefonoPersonal: item.telefonoPersonal,
                    servicios: [],
                });
            }

            grouped.get(item.idCita).servicios.push({
                idServicio: item.idServicio,
                nombreServicio: item.nombreServicio,
                costoServicio: item.costoServicio,
            });
        }

        return Array.from(grouped.values());
    }


    async createAppointment(dto: CreateAppointmentDto, idCliente: number): Promise<AppointmentClient> {
        // 1. Guardar la cita
        const nuevaCita = this.appointmentRepo.create({
            fecha: dto.fecha,
            hora: dto.hora,
            marca: dto.marca,
            modelo: dto.modelo,
            estado: 'En espera',
            costoExtra: 0,
            total: 0,
            IdCliente: idCliente,
        });

        const savedCita = await this.appointmentRepo.save(nuevaCita);

        // 2. Guardar servicios si vienen en el DTO
        if (dto.servicios && dto.servicios.length > 0) {
            const servicios = dto.servicios.map(nombreServicio =>
                this.appointmentServiceRepo.create({
                    idCita: savedCita.id,
                    servicio: nombreServicio,
                    costo: 0, // Por defecto
                }),
            );

            await this.appointmentServiceRepo.save(servicios);
        }

        return savedCita;
    }

    async getAppointmentById(idCita: number): Promise<any> {
        const rawAppointments = await this.appointmentViewRepo.find({
            where: { idCita },
        });

        if (rawAppointments.length === 0) {
            return null; // O lanzar excepción según convenga
        }

        // Agrupar la cita y sus servicios como haces en getAppointmentsByClientId
        const cita = {
            idCita: rawAppointments[0].idCita,
            fecha: rawAppointments[0].fecha,
            hora: rawAppointments[0].hora,
            costoExtra: rawAppointments[0].costoExtra,
            total: rawAppointments[0].total,
            marca: rawAppointments[0].marca,
            modelo: rawAppointments[0].modelo,
            estado: rawAppointments[0].estado,
            idCliente: rawAppointments[0].idCliente,
            nombreCompletoCliente: rawAppointments[0].nombreCompletoCliente,
            correoCliente: rawAppointments[0].correoCliente,
            telefonoCliente: rawAppointments[0].telefonoCliente,
            idPersonal: rawAppointments[0].idPersonal,
            nombreCompletoPersonal: rawAppointments[0].nombreCompletoPersonal,
            correoPersonal: rawAppointments[0].correoPersonal,
            telefonoPersonal: rawAppointments[0].telefonoPersonal,
            servicios: rawAppointments.map(item => ({
                idServicio: item.idServicio,
                nombreServicio: item.nombreServicio,
                costoServicio: item.costoServicio,
            })),
        };

        return cita;
    }

    async updateAppointmentDateTime(idCita: number, dto: UpdateAppointmentDto): Promise<any> {
        const cita = await this.appointmentRepo.findOne({ where: { id: idCita } });
        if (!cita) {
            throw new NotFoundException('Cita no encontrada');
        }

        // Actualizar fecha y hora si vienen en el DTO
        if (dto.fecha) cita.fecha = dto.fecha;
        if (dto.hora) cita.hora = dto.hora;

        // Cambiar estado a "Pendiente de cambio"
        cita.estado = 'Pendiente de cambio';

        await this.appointmentRepo.save(cita);

        // Si se incluyen servicios, reemplazarlos
        if (dto.servicios && dto.servicios.length > 0) {
            // 1. Eliminar los servicios anteriores
            await this.appointmentServiceRepo.delete({ idCita });

            // 2. Insertar los nuevos
            const nuevosServicios = dto.servicios.map(nombre => {
                return this.appointmentServiceRepo.create({
                    idCita,
                    servicio: nombre,
                    costo: 0, // Ajusta si tienes costo real
                });
            });

            await this.appointmentServiceRepo.save(nuevosServicios);
        }

        return { message: 'Cita actualizada correctamente' };
    }


    async cancelAppointment(
        idCita: number,
        dto: CreateCancellationDto,
    ): Promise<{ message: string }> {
        const cita = await this.appointmentRepo.findOne({ where: { id: idCita } });

        if (!cita) {
            throw new NotFoundException('La cita no existe');
        }

        // Guardar cancelación en tabla correspondiente
        const cancelacion = this.appointmentCancelRepo.create({
            idCita,
            canceladoPor: dto.canceladoPor,
            motivo: dto.motivo,
        });

        await this.appointmentCancelRepo.save(cancelacion);

        // (Opcional) actualizar estado de la cita a "Cancelada"
        cita.estado = 'Cancelada';
        await this.appointmentRepo.save(cita);

        return { message: 'Cita cancelada correctamente' };
    }



}
