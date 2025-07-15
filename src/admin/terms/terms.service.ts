import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TermsEntity } from './entities/terms.entity';
import { UpdateTermsDto } from './dto/update-terms.dto';

@Injectable()
export class TermsService {
  constructor(
    @InjectRepository(TermsEntity)
    private readonly termsRepository: Repository<TermsEntity>,
  ) {}

  //todos los terminos
  async findAll(): Promise<TermsEntity[]> {
    return this.termsRepository.find();
  }

  /** Actualiza únicamente la columna 'info' de un término existente
   * @throws NotFoundException si no existe el registro*/
  async update(id: number, dto: UpdateTermsDto): Promise<TermsEntity> {
    const term = await this.termsRepository.findOne({ where: { id } });
    if (!term) {
      throw new NotFoundException(`Terms con id ${id} no fue encontrado`);
    }
    if (dto.info !== undefined) {
      term.info = dto.info;
    }
    return this.termsRepository.save(term);
  }
}
