import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { RepairPaymentEntity } from './entity/repair.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RepairPaymentService {
    @InjectRepository(RepairPaymentEntity)
    private readonly repairRepository: Repository<RepairPaymentEntity>;

    async getRepairsPayment(idCliente: number): Promise<RepairPaymentEntity[]> {
        return this.repairRepository.find({
            where: {
                idCliente,
                estado: 'pendiente',
            },
        });
    }

    async markRepairAsInProcess(idReparacion: number, idCliente: number): Promise<RepairPaymentEntity> {
        const repair = await this.repairRepository.findOneBy({ id: idReparacion, idCliente });
        if (!repair) throw new Error('Reparación no encontrada o no pertenece al cliente');

        repair.estado = 'en proceso';
        return this.repairRepository.save(repair);
    }


}
