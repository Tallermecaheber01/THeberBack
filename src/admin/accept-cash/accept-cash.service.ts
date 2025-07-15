import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RepairPaymentEntity } from 'src/client/repair-payment/entity/repair.entity';
import { RepairClientViewEntity } from './view/repair-client-view.entity';
import { Pago } from 'src/mercado-pago/entity/pago.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AcceptCashService {
    constructor(
        @InjectRepository(RepairPaymentEntity)
        private readonly repairRepository: Repository<RepairPaymentEntity>,

        @InjectRepository(RepairClientViewEntity)
        private readonly viewRepo: Repository<RepairClientViewEntity>,

        @InjectRepository(Pago)
        private readonly pagoRepository: Repository<Pago>, // Inyectamos repo de pagos
    ) { }

    async getRepairsInProcess(): Promise<RepairClientViewEntity[]> {
        return this.viewRepo.find({
            where: { estado: 'en proceso' },
        });
    }

    // Nuevo método para confirmar pago y registrar en pagos
    async confirmCashPayment(idRepair: number): Promise<RepairPaymentEntity> {
        const repair = await this.repairRepository.findOneBy({ id: idRepair });
        if (!repair) {
            throw new NotFoundException('Reparación no encontrada');
        }

        // Actualizamos estado a 'pagado'
        repair.estado = 'pagado';
        await this.repairRepository.save(repair);

        // Fecha y hora actual
        const now = new Date();

        // Creamos nuevo registro en pagos
        const nuevoPago = this.pagoRepository.create({
            servicio: repair.servicio.join(', '),
            total: repair.totalFinal,
            idCliente: repair.idCliente,
            fecha: now.toISOString().split('T')[0],   // 'YYYY-MM-DD'
            hora: now.toTimeString().split(' ')[0],   // 'HH:MM:SS'
            formaPago: 'Efectivo',
        });

        await this.pagoRepository.save(nuevoPago);

        return repair;
    }

}
