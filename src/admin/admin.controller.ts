import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, ValidationPipe } from '@nestjs/common';

import { ServiceService } from './service/service.service';

import { CreateServiceDto } from './service/dto/create-service.dto';
import { CreateBrandDto } from './service/dto/create-brand.dto';
import { CreateVehicleDto } from './service/dto/create-vechicle.dto';
import { CreateContactDto } from './contact/dto/create-contacts.dto';


import { UpdateServiceDto } from './service/dto/update-service.dto';
import { UpdateBrandDto } from './service/dto/update-brand.dto';
import { UpdateVehicleDto } from './service/dto/update-vehicle.dto';
import { UpdateCorporateImageDto } from './corporateimage/dto/update-corporateimage.dto';
import { UpdateContactDto } from './contact/dto/update-contacts.dto';
import { CreatePoliceDto } from './policies/dto/create-policies.dto';
import { UpdatePoliceDto } from './policies/dto/update-policies.dto'; 



import { ServiceEntity } from './service/entities/service.entity';
import { BrandEntity } from './service/entities/brand.entity';
import { VehicleTypeEntity } from './service/entities/vehicle.entity';
import { CorporateImage } from './corporateimage/entities/corporateimage.entity';
import { Contact } from './contact/entities/contacts.entity';
import { Police } from './policies/entities/policies.entity';

import { CorporateimageService } from './corporateimage/corporateimage.service';
import { ContactService } from './contact/contact.service';
import { PoliceService } from './policies/policies.service';

@Controller('admin')
export class AdminController {
    constructor(
        private readonly serviceService: ServiceService, 
        private readonly corporateimageService: CorporateimageService,
        private readonly contactService: ContactService, 
        private readonly policeService: PoliceService,
    ) {}


    @Post('new-service')
    async createService(
        @Body(new ValidationPipe()) serviceData: CreateServiceDto): Promise<ServiceEntity> {
        return this.serviceService.createService(serviceData);
    }

    @Post('new-brand')
    async createBrand(
        @Body(new ValidationPipe) brandData: CreateBrandDto): Promise<BrandEntity> {
        return this.serviceService.createBrand(brandData);
    }

    @Post('new-vehicletype')
    async createVehicleType(
        @Body(new ValidationPipe) vehicleData: CreateVehicleDto): Promise<VehicleTypeEntity> {
        return this.serviceService.createVehicleType(vehicleData);
    }

    @Patch('update-service/:id')
    async updateService(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe()) updateData: UpdateServiceDto
    ): Promise<ServiceEntity> {
        return this.serviceService.updateService(id, updateData);
    }

    @Patch('update-brand/:id')
    async updateBrand(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe()) updateData: UpdateBrandDto
    ): Promise<BrandEntity> {
        return this.serviceService.updateBrand(id, updateData);
    }

    @Patch('update-vehicletype/:id')
    async updateVehicleType(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe()) updateData: UpdateVehicleDto
    ): Promise<VehicleTypeEntity> {
        return this.serviceService.updateVehicleType(id, updateData);
    }

    @Get('all-services')
    async getAllServices(): Promise<ServiceEntity[]> {
        return this.serviceService.getAllservices();
    }

    @Get('service/:id')
    async getServiceById(@Param('id', ParseIntPipe) id: number):Promise<ServiceEntity[]>{
        return this.serviceService.getServiceById(id);
    }

    @Get('all-brands')
    async getAllBrands(): Promise<BrandEntity[]> {
        return this.serviceService.getAllBrands();
    }

    @Get('all-vehicletypes')
    async getAllVehicleTypes(): Promise<VehicleTypeEntity[]> {
        return this.serviceService.getAllVehicleTypes();
    }

    @Delete('delete-service/:id')
    async deleteService(@Param('id') id: number): Promise<void> {
        await this.serviceService.deleteService(id);
    }

    @Delete('delete-brand/:id')
    async deleteBrand(@Param('id') id: number): Promise<void> {
        await this.serviceService.deleteBrand(id);
    }

    @Delete('delete-vehicletype/:id')
    async deleteVehicleType(@Param('id') id: number): Promise<void> {
        await this.serviceService.deleteVehicleType(id);
    }

    //mision, vision
    @Patch('updatecorporateimage/:id')
    async updateCorporateImage(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe()) updateData: UpdateCorporateImageDto
    ): Promise<CorporateImage> {
        return this.corporateimageService.update(id, updateData);
    }

    @Get('allcorporateimages')
    async getAllCorporateImages(): Promise<CorporateImage[]> {
        return this.corporateimageService.findAll();
    }

    @Get('corporateimage/:id')
    async getCorporateImageById(@Param('id', ParseIntPipe) id: number): Promise<CorporateImage> {
        return this.corporateimageService.findOneById(id);
    }

    @Post('newcontact')
    async createContact(
      @Body(new ValidationPipe()) createContactDto: CreateContactDto,
    ): Promise<Contact> {
      return this.contactService.create(createContactDto);
    }
  
    @Patch('updatecontact/:id')
    async updateContact(
      @Param('id', ParseIntPipe) id: number,
      @Body(new ValidationPipe()) updateContactDto: UpdateContactDto,
    ): Promise<Contact> {
      return this.contactService.update(id, updateContactDto);
    }
  
    @Get('all-contacts')
    async getAllContacts(): Promise<Contact[]> {
      return this.contactService.findAll();
    }
  
    @Get('contact/:id')
    async getContactById(@Param('id', ParseIntPipe) id: number): Promise<Contact> {
      return this.contactService.findOneById(id);
    }
  
    @Delete('deletecontact/:id')
    async deleteContact(@Param('id') id: number): Promise<void> {
      await this.contactService.remove(id);
    }

    
@Post('new-police')
async createPolice(
  @Body(new ValidationPipe()) createPoliceDto: CreatePoliceDto,
): Promise<Police> {
  return this.policeService.create(createPoliceDto);
}

@Patch('update-police/:id')
async updatePolice(
  @Param('id', ParseIntPipe) id: number,
  @Body(new ValidationPipe()) updatePoliceDto: UpdatePoliceDto,
): Promise<Police> {
  return this.policeService.update(id, updatePoliceDto);
}

@Get('all-polices')
async getAllPolices(): Promise<Police[]> {
  return this.policeService.findAll();
}

@Get('police/:id')
async getPoliceById(
  @Param('id', ParseIntPipe) id: number,
): Promise<Police> {
  return this.policeService.findOneById(id);
}

@Delete('delete-police/:id')
async deletePolice(@Param('id', ParseIntPipe) id: number): Promise<void> {
  await this.policeService.remove(id);
}

@Patch('update-status/:id')
async updateStatus(@Param('id', ParseIntPipe) id: number): Promise<Police> {
  return this.policeService.actualizarEstado(id);
}


}
