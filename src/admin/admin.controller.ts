import { Body, Controller, Post } from '@nestjs/common';
import { ServiceService } from './service/service.service';
import { CreateServiceDto } from './service/create-service.dto';
import { ServiceEntity } from './service/service.entity';

@Controller('admin')
export class AdminController {
    constructor(private readonly serviceService: ServiceService) {}

    @Post('new-service')
    async createService(@Body() serviceData: CreateServiceDto): Promise<ServiceEntity> {
        return this.serviceService.createService(serviceData);
    }
}
