import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { InformationService } from './information/information.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { VehiclesService } from './vehicles/vehicles.service';
import { VehicleEntity } from './vehicles/entities/vehicle.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User,VehicleEntity])],
  controllers: [ClientController],
  providers: [InformationService, VehiclesService],
  exports:[InformationService]
})
export class ClientModule {}
