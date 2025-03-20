import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Repository, LessThanOrEqual } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity } from '../recover-password/entity/client-entity';
import { AuthorizedPersonnelEntity } from '../recover-password/entity/authorized-personnel-entity';

@Injectable()
export class UnlockService implements OnModuleInit {
    constructor(
        @InjectRepository(ClientEntity)
        private clientRepository: Repository<ClientEntity>,

        @InjectRepository(AuthorizedPersonnelEntity)
        private personnelRepository: Repository<AuthorizedPersonnelEntity>,
    ) { }

    onModuleInit() {
        console.log("✅ UnlockService iniciado - Cron Job activado");
    }

    // 🔥 CRON JOB: Se ejecuta automáticamente cada minuto
    @Cron('*/1 * * * *') // Corre cada 1 minuto
    async unlockAccounts() {
        console.log("🔍 Revisando cuentas bloqueadas...");

        const now = new Date();

        // 🔹 Buscar clientes bloqueados que ya pueden desbloquearse
        const clients = await this.clientRepository.find({
            where: { estado: 'bloqueado', fechaDesbloqueo: LessThanOrEqual(now) }
        });

        // 🔹 Buscar empleados bloqueados que ya pueden desbloquearse
        const employees = await this.personnelRepository.find({
            where: { estado: 'bloqueado', fechaDesbloqueo: LessThanOrEqual(now) }
        });

        // 🔓 Desbloquear clientes
        for (const client of clients) {
            client.estado = 'activo';
            client.intentosFallidos = 0;
            client.fechaDesbloqueo = null;
            await this.clientRepository.save(client);
            console.log(`✅ Cliente desbloqueado: ${client.correo}`);
        }

        // 🔓 Desbloquear empleados
        for (const employee of employees) {
            employee.estado = 'activo';
            employee.intentosFallidos = 0;
            employee.fechaDesbloqueo = null;
            await this.personnelRepository.save(employee);
            console.log(`✅ Empleado desbloqueado: ${employee.correo}`);
        }
    }
}
