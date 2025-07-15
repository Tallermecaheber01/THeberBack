// src/pago/pago.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago } from '../entity/pago.entity';
import { CreatePagoDto } from '../dto/create-pago.dto';
import { StateRepairEntity } from './pagado.entity';
import { EstadoReparacion } from './update-estado.dto';

@Injectable()
export class PagoService {
  constructor(
    @InjectRepository(Pago)
    private readonly pagoRepository: Repository<Pago>,

    @InjectRepository(StateRepairEntity)
    private readonly stateRepairRepository: Repository<StateRepairEntity>,
  ) { }

  async registrarPago(data: CreatePagoDto): Promise<Pago> {
    const pago = this.pagoRepository.create(data);


    return await this.pagoRepository.save(pago);
  }

  async marcarReparacionComoPagada(idReparacion: number): Promise<void> {
    console.log(`🔍 Buscando reparación con ID: ${idReparacion}`);

    const reparacion = await this.stateRepairRepository.findOneBy({ id: idReparacion });

    if (!reparacion) {
      console.error('❌ Reparación no encontrada');
      throw new NotFoundException('Reparación no encontrada');
    }

    console.log('✅ Reparación encontrada:', reparacion);

    reparacion.estado = EstadoReparacion.PAGADO;
    console.log(`📝 Cambiando estado a: ${reparacion.estado}`);

    await this.stateRepairRepository.save(reparacion);

    console.log('💾 Reparación actualizada correctamente');
  }
}

