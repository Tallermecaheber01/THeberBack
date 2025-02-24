import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { ServiceService } from './service/service.service';

import { ServiceEntity } from './service/entities/service.entity';
import { BrandEntity } from './service/entities/brand.entity';
import { VehicleEntity } from './service/entities/vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceEntity, BrandEntity, VehicleEntity])],
  controllers: [AdminController],
  providers: [ServiceService,],
  exports: [ServiceService], // Exporta si se necesita en otros módulos
})
export class AdminModule { }
