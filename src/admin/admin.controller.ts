import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, ValidationPipe } from '@nestjs/common';

import { ServiceService } from './service/service.service';

import { CreateServiceDto } from './service/dto/create-service.dto';
import { CreateBrandDto } from './service/dto/create-brand.dto';
import { CreateVehicleDto } from './service/dto/create-vechicle.dto';

import { UpdateServiceDto } from './service/dto/update-service.dto';
import { UpdateBrandDto } from './service/dto/update-brand.dto';
import { UpdateVehicleDto } from './service/dto/update-vehicle.dto';

import { ServiceEntity } from './service/entities/service.entity';
import { BrandEntity } from './service/entities/brand.entity';
import { VehicleEntity } from './service/entities/vehicle.entity';


@Controller('admin')
export class AdminController {
    constructor(private readonly serviceService: ServiceService) { }


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
        @Body(new ValidationPipe) vehicleData: CreateVehicleDto): Promise<VehicleEntity> {
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
    ): Promise<VehicleEntity> {
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
    async getAllVehicleTypes(): Promise<VehicleEntity[]> {
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


}
