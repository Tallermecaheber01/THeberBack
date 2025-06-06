import { Injectable } from '@nestjs/common';
import { VwAppointmentDetails } from './view/vw-appointment-details.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AppointmentClientService {
    constructor(
        @InjectRepository(VwAppointmentDetails)
        private readonly appointmentViewRepo: Repository<VwAppointmentDetails>,
    ) { }

    async getAppointmentsByClientId(idCliente: number): Promise<any[]> {
        const rawAppointments = await this.appointmentViewRepo.find({
            where: { idCliente },
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

}
