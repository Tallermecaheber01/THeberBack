import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { ServiceService } from './service/service.service';

import { ServiceEntity } from './service/entities/service.entity';
import { BrandEntity } from './service/entities/brand.entity';
import { VehicleTypeEntity } from './service/entities/vehicle.entity';
import { ContactService } from './contact/contact.service';
import { CorporateimageService } from './corporateimage/corporateimage.service';
import { CorporateImage } from './corporateimage/entities/corporateimage.entity';
import { Contact } from './contact/entities/contacts.entity';


@Module({
  imports: [TypeOrmModule.forFeature([ServiceEntity, BrandEntity, VehicleTypeEntity, CorporateImage, Contact])],
  controllers: [AdminController],
  providers: [ServiceService,  ContactService, CorporateimageService,],
  exports: [ServiceService, CorporateimageService], // Exporta si se necesita en otros módulos
})
export class AdminModule { }
