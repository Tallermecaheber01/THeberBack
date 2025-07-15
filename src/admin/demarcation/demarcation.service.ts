import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DemarcationEntity } from './entities/demarcation.entity';
import { UpdateDemarcationDto } from './dto/update-demarcation.dto';

@Injectable()
export class DemarcationService {
  constructor(
    @InjectRepository(DemarcationEntity)
    private readonly demarcationRepository: Repository<DemarcationEntity>,
  ) {}

  /**Obtiene todos */
  async findAll(): Promise<DemarcationEntity[]> {
    return this.demarcationRepository.find();
  }

  /** Actualiza 
   * @throws NotFoundException si no existe el registro */
  async update(id: number, dto: UpdateDemarcationDto): Promise<DemarcationEntity> {
    const demarcation = await this.demarcationRepository.findOne({ where: { id } });
    if (!demarcation) {
      throw new NotFoundException(`Demarcation con id ${id} no fue encontrada`);
    }
    // Solo actualizamos la columna 'info'
    if (dto.info !== undefined) {
      demarcation.info = dto.info;
    }
    return this.demarcationRepository.save(demarcation);
  }
}
