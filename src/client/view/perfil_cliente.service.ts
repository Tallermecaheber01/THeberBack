import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PerfilClientesEntity } from './perfil_clientes.entity';

@Injectable()
export class VwPerfilClienteService {
  constructor(
    @InjectRepository(PerfilClientesEntity)
    private readonly repo: Repository<PerfilClientesEntity>,
  ) {}

  async findOneById(idCliente: number): Promise<PerfilClientesEntity> {
    const cliente = await this.repo.findOne({ where: { idCliente } });
    if (!cliente) {
      throw new Error(`Cliente con ID ${idCliente} no encontrado`);
    }
    return cliente;
  }

  async findAll(): Promise<PerfilClientesEntity[]> {
    return this.repo.find();
  }
}