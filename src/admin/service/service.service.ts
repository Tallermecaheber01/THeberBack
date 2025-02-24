import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';

import { ServiceEntity } from './entities/service.entity';
import { BrandEntity } from './entities/brand.entity';
import { VehicleEntity } from './entities/vehicle.entity';

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

        @InjectRepository(VehicleEntity)
        private readonly vehicleRepository: Repository<VehicleEntity>
    ) { }

    async createService(serviceData: CreateServiceDto): Promise<ServiceEntity> {
        const newService = this.serviceRepository.create(serviceData);
        return this.serviceRepository.save(newService);
    }

    async createBrand(brandData: CreateBrandDto): Promise<BrandEntity> {
        const newBrand = this.brandRepository.create(brandData);
        return this.brandRepository.save(newBrand);
    }

    async createVehicleType(vehicleData: CreateVehicleDto): Promise<VehicleEntity> {
        const newVehicleType = this.vehicleRepository.create(vehicleData);
        return this.vehicleRepository.save(newVehicleType);
    }

    async updateService(id: number, updateData: UpdateServiceDto): Promise<ServiceEntity> {
        const service = await this.serviceRepository.findOne({ where: { id } });
        if (!service) {
            throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
        }
        Object.assign(service, updateData); // Actualiza solo los campos enviados
        return this.serviceRepository.save(service);
    }

    async updateBrand(id: number, updateData: UpdateBrandDto): Promise<BrandEntity> {
        const brand = await this.brandRepository.findOne({ where: { id } });
        if (!brand) {
            throw new NotFoundException(`Marca con ID ${id} no encontrada`);
        }
        Object.assign(brand, updateData);
        return this.brandRepository.save(brand);
    }

    async updateVehicleType(id: number, updateData: UpdateVehicleDto): Promise<VehicleEntity> {
        const vehicle = await this.vehicleRepository.findOne({ where: { id } });
        if (!vehicle) {
            throw new NotFoundException(`Tipo de vehículo con ID ${id} no encontrado`);
        }
        Object.assign(vehicle, updateData);
        return this.vehicleRepository.save(vehicle);
    }

    async getAllservices(): Promise<ServiceEntity[]> {
        return this.serviceRepository.find();
    }

    async getAllBrands(): Promise<BrandEntity[]> {
        return this.brandRepository.find();
    }

    async getAllVehicleTypes(): Promise<VehicleEntity[]> {
        return this.vehicleRepository.find();
    }

    async deleteService(id: number): Promise<void> {
        await this.serviceRepository.delete(id);
    }

    async deleteBrand(id: number): Promise<void> {
        await this.brandRepository.delete(id);
    }

    async deleteVehicleType(id: number): Promise<void> {
        await this.vehicleRepository.delete(id);
    }

    async getAllServicesWithNames(): Promise<any[]> {
        const services = await this.serviceRepository.createQueryBuilder('service')
            .leftJoinAndSelect('service.tipoVehiculo', 'vehicleType')  // Unimos tipos de vehículos
            .leftJoinAndSelect('service.marca', 'brand')  // Unimos marcas
            .select([
                'service.id',
                'service.nombre',
                'service.descripcion',
                'service.imagen',
                'vehicleType.nombre',  // Seleccionamos los nombres de tipos de vehículos
                'brand.nombre'  // Seleccionamos los nombres de marcas
            ])
            .getRawMany();  // Usamos getRawMany para obtener los resultados
    
        // Transformamos la respuesta para agrupar los tipos de vehículos y marcas en arrays
        return services.map(service => ({
            service_id: service.service_id,
            service_name: service.service_name,
            service_description: service.service_description,
            service_image: service.service_image,
            tipoVehiculoNombres: service.vehicleType_nombre ? [service.vehicleType_nombre] : [], // Crear un array si existe
            marcaNombres: service.brand_nombre ? [service.brand_nombre] : [] // Crear un array si existe
        }));
    }
}
