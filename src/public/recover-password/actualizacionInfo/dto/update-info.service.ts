import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { ClientEntity } from '../../entity/client-entity';
import { AuthorizedPersonnelEntity } from '../../entity/authorized-personnel-entity';
import { UpdateClientDto } from './update-client.dto';
import { UpdateAuthorizedPersonnelDto } from './update-authorized-personnel.dto';

@Injectable()
export class UpdateInfoService {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepo: Repository<ClientEntity>,

    @InjectRepository(AuthorizedPersonnelEntity)
    private readonly authRepo: Repository<AuthorizedPersonnelEntity>,
  ) {}

  // Actualizar cliente
  async updateClient(id: number, dto: UpdateClientDto): Promise<ClientEntity> {
    const client = await this.clientRepo.findOne({ where: { id } });
    if (!client) throw new NotFoundException(`Cliente con id ${id} no encontrado`);

    if (dto.contrasena) {
      const salt = await bcrypt.genSalt(10);
      dto.contrasena = await bcrypt.hash(dto.contrasena, salt);
    }

    if (dto.respuestaSecreta) {
      const salt = await bcrypt.genSalt(10);
      dto.respuestaSecreta = await bcrypt.hash(dto.respuestaSecreta, salt);
    }

    if (dto.idPreguntaSecreta !== undefined) {
      (client as any).preguntaSecreta = { id: dto.idPreguntaSecreta }; // asignación por relación
    }

    Object.assign(client, dto);
    return this.clientRepo.save(client);
  }

  // Actualizar empleado
  async updateAuthorizedPersonnel(id: number, dto: UpdateAuthorizedPersonnelDto): Promise<AuthorizedPersonnelEntity> {
    const user = await this.authRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Personal autorizado con id ${id} no encontrado`);

    if (dto.contrasena) {
      const salt = await bcrypt.genSalt(10);
      dto.contrasena = await bcrypt.hash(dto.contrasena, salt);
    }

    if (dto.respuestaSecreta) {
      const salt = await bcrypt.genSalt(10);
      dto.respuestaSecreta = await bcrypt.hash(dto.respuestaSecreta, salt);
    }

    if (dto.idPreguntaSecreta !== undefined) {
      (user as any).preguntaSecreta = { id: dto.idPreguntaSecreta };
    }

    Object.assign(user, dto);
    return this.authRepo.save(user);
  }
}
