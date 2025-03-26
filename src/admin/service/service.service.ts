import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';

import { ServiceEntity } from './entities/service.entity';
import { BrandEntity } from './entities/brand.entity';
import { VehicleTypeEntity } from './entities/vehicle.entity';
import { LogEntity } from 'src/log/entity/log.entity';

import { CreateServiceDto } from './dto/create-service.dto';
import { CreateBrandDto } from './dto/create-brand.dto';
import { CreateVehicleDto } from './dto/create-vechicle.dto';

import { UpdateServiceDto } from './dto/update-service.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';


@Injectable()
export class ServiceService {
    constructor(
        @InjectRepository(ServiceEntity)
        private readonly serviceRepository: Repository<ServiceEntity>,

        @InjectRepository(BrandEntity)
        private readonly brandRepository: Repository<BrandEntity>,

        @InjectRepository(VehicleTypeEntity)
        private readonly vehicleRepository: Repository<VehicleTypeEntity>,

        @InjectRepository(LogEntity)
        private readonly logRepository: Repository<LogEntity>,
    ) { }

    // Método privado para guardar logs
    private async saveLog(level: string, message: string, extraInfo?: string) {
        await this.logRepository.save({
            level,
            message,
            extraInfo,
            timestamp: new Date(),
        });
    }


    async createService(serviceData: CreateServiceDto): Promise<ServiceEntity> {
        const newService = this.serviceRepository.create(serviceData);
        // Log de creación exitosa de servicio
        await this.saveLog('INFO', 'Servicio creado', `ID: ${newService.id}`);
        return this.serviceRepository.save(newService);
    }

    async createBrand(brandData: CreateBrandDto): Promise<BrandEntity> {
        const newBrand = this.brandRepository.create(brandData);
        // Log de creación exitosa de marca
        await this.saveLog('INFO', 'Marca creada', `ID: ${newBrand.id}`);
        return this.brandRepository.save(newBrand);
    }

    async createVehicleType(vehicleData: CreateVehicleDto): Promise<VehicleTypeEntity> {
        const newVehicleType = this.vehicleRepository.create(vehicleData);
        // Log de creación exitosa de tipo de vehículo
        await this.saveLog('INFO', 'Tipo de vehículo creado', `nombre: ${newVehicleType.nombre}`);
        return this.vehicleRepository.save(newVehicleType);
    }

    async updateService(id: number, updateData: UpdateServiceDto): Promise<ServiceEntity> {
        const service = await this.serviceRepository.findOne({ where: { id } });
        if (!service) {
            // Log de error si no se encuentra el servicio
            await this.saveLog('ERROR', 'Servicio no encontrado para actualizar', `ID: ${id}`);
            throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
        }
        Object.assign(service, updateData); // Actualiza solo los campos enviados
        // Log de actualización exitosa
        await this.saveLog('INFO', 'Servicio actualizado', `ID: ${service.id}`);
        return this.serviceRepository.save(service);
    }

    async updateBrand(id: number, updateData: UpdateBrandDto): Promise<BrandEntity> {
        const brand = await this.brandRepository.findOne({ where: { id } });
        if (!brand) {
            throw new NotFoundException(`Marca con ID ${id} no encontrada`);
        }
        Object.assign(brand, updateData);
        // Log de actualización exitosa
        await this.saveLog('INFO', 'Marca actualizada', `ID: ${brand.id}`);
        return this.brandRepository.save(brand);
    }

    async updateVehicleType(id: number, updateData: UpdateVehicleDto): Promise<VehicleTypeEntity> {
        const vehicle = await this.vehicleRepository.findOne({ where: { id } });
        if (!vehicle) {
            throw new NotFoundException(`Tipo de vehículo con ID ${id} no encontrado`);
        }
        Object.assign(vehicle, updateData);
        // Log de actualización exitosa
        await this.saveLog('INFO', 'Tipo de vehículo actualizado', `ID: ${vehicle.id}`);
        return this.vehicleRepository.save(vehicle);
    }

    async getAllservices(): Promise<ServiceEntity[]> {
        return this.serviceRepository.find();

    }
    async getServiceById(id: number): Promise<ServiceEntity[]> {
        const service = await this.serviceRepository.find({ where: { id } });
        if (!service) {
            // Log de error si no se encuentra el servicio
            await this.saveLog('ERROR', 'Servicio no encontrado', `ID: ${id}`);
            throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
        }
        return service;
    }


    async getAllBrands(): Promise<BrandEntity[]> {
        return this.brandRepository.find();
    }

    async getAllVehicleTypes(): Promise<VehicleTypeEntity[]> {
        return this.vehicleRepository.find();
    }

    async deleteService(id: number): Promise<void> {
        await this.serviceRepository.delete(id);
        // Log de eliminación exitosa de servicio
        await this.saveLog('INFO', 'Servicio eliminado', `ID: ${id}`);
    }

    async deleteBrand(id: number): Promise<void> {
        await this.brandRepository.delete(id);
        // Log de eliminación exitosa de marca
        await this.saveLog('INFO', 'Marca eliminada', `ID: ${id}`);
    }

    async deleteVehicleType(id: number): Promise<void> {
        await this.vehicleRepository.delete(id);
        // Log de eliminación exitosa de tipo de vehículo
        await this.saveLog('INFO', 'Tipo de vehículo eliminado', `ID: ${id}`);
    }


}
