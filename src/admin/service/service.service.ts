import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceEntity } from './service.entity';

import { CreateServiceDto } from './create-service.dto';

@Injectable()
export class ServiceService {
    constructor(
        @InjectRepository(ServiceEntity)
        private readonly serviceRepository: Repository<ServiceEntity>,
    ) {}

    async createService(serviceData: CreateServiceDto): Promise<ServiceEntity> {
        const newService = this.serviceRepository.create(serviceData);
        return this.serviceRepository.save(newService);
    }
}
