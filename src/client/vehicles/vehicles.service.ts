import { Injectable } from '@nestjs/common';

import { VehicleEntity } from './entities/vehicle.entity';
import { BrandEntity } from 'src/admin/service/entities/brand.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
    constructor(
        @InjectRepository(VehicleEntity)
        private readonly vehicleRepository: Repository<VehicleEntity>,

        @InjectRepository(BrandEntity)
        private readonly brandRepository: Repository<BrandEntity>,

    ) { }

    async createVehicle(vehicleData: CreateVehicleDto): Promise<VehicleEntity> {
        const newVehicle = this.vehicleRepository.create(vehicleData);
        return this.vehicleRepository.save(newVehicle);
    }

    async updateVehicle(id: number, vehicleData: UpdateVehicleDto): Promise<VehicleEntity> {
        await this.vehicleRepository.update(id, vehicleData);
        return this.vehicleRepository.findOne({ where: { id } });
    }
    
    async deleteVehicle(id: number): Promise<void> {
        await this.vehicleRepository.delete(id);
    }

    async getAllBrand(): Promise<BrandEntity[]> {
        return this.brandRepository.find();
    }

    async getVehiclesByOwner(idPropietario: number): Promise<VehicleEntity[]> {
        return this.vehicleRepository.find({
            where: {
                idPropietario: { id: idPropietario }
            }
        });

    }

}
