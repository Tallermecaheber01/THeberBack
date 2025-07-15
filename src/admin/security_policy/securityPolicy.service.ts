import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecurityPolicyEntity } from './entities/securityPolicy.entity';
import { UpdateSecurityPolicyDto } from './dto/update-securitypolicy.dto';

@Injectable()
export class SecurityPolicyService {
  constructor(
    @InjectRepository(SecurityPolicyEntity)
    private readonly securityPolicyRepository: Repository<SecurityPolicyEntity>,
  ) {}

 //para tarerlas
  async findAll(): Promise<SecurityPolicyEntity[]> {
    return this.securityPolicyRepository.find();
  }

  /** Actualiza 
   *  @throws NotFoundException si no existe el registro
   */
  async update(id: number, dto: UpdateSecurityPolicyDto): Promise<SecurityPolicyEntity> {
    const policy = await this.securityPolicyRepository.findOne({ where: { id } });
    if (!policy) {
      throw new NotFoundException(`SecurityPolicy con id ${id} no fue encontrada`);
    }
    if (dto.info !== undefined) {
      policy.info = dto.info;
    }
    return this.securityPolicyRepository.save(policy);
  }
}