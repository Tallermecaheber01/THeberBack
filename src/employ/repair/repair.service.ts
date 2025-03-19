import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { RepairEntity } from './entities/repair.entity';
import { CreateRepairDto } from './dto/create-repair.dto';
import { UpdateRepairDto } from './dto/update-repair.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RepairService {
  constructor(
    @InjectRepository(RepairEntity)
    private readonly repairRepository: Repository<RepairEntity>
  ) {}

  async createNewRepair(repairData: CreateRepairDto): Promise<RepairEntity> {
    const newRepair = this.repairRepository.create(repairData);
    return this.repairRepository.save(newRepair);
  }

  async getAllRepairs(): Promise<RepairEntity[]> {
    return this.repairRepository.find();
  }

  async getRepairById(id: string): Promise<RepairEntity> {
    const repairId = parseInt(id, 10);
    if (isNaN(repairId)) {
      throw new BadRequestException('El id debe ser un número válido');
    }
    
    const repair = await this.repairRepository.findOne({ where: { id: repairId } });
    
    if (!repair) {
      throw new NotFoundException(`No se encontró reparación con id: ${repairId}`);
    }
    return repair;
  }

  // Método para actualizar una reparación
  async updateRepair(id: number, updateRepairDto: UpdateRepairDto): Promise<RepairEntity> {
    // Obtenemos la reparación existente
    const repair = await this.getRepairById(id.toString());
    // Fusionamos los cambios del DTO en la reparación existente
    const updatedRepair = this.repairRepository.merge(repair, updateRepairDto);
    return this.repairRepository.save(updatedRepair);
  }
}

